import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { inquirySchema } from "@/lib/validations";
import { sanitizePlainText } from "@/lib/sanitize";
import {
  sendAdminInquiryNotification,
  sendContactConfirmation,
} from "@/lib/email";
import { getSettings } from "@/lib/data";
import { Inquiry } from "@/models";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`inquiries:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
    if (!limited.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((limited.reset - Date.now()) / 1000)),
          },
        },
      );
    }

    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ success: true, data: { id: "ok" } });
    }

    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    await connectDB();

    const inquiry = await Inquiry.create({
      fullName: sanitizePlainText(data.fullName),
      email: data.email.toLowerCase().trim(),
      phone: data.phone ? sanitizePlainText(data.phone) : undefined,
      organization: data.organization
        ? sanitizePlainText(data.organization)
        : undefined,
      country: data.country ? sanitizePlainText(data.country) : undefined,
      inquiryType: data.inquiryType,
      subject: data.subject ? sanitizePlainText(data.subject) : undefined,
      message: sanitizePlainText(data.message),
      consent: data.consent,
      status: "new",
    });

    const settings = await getSettings();
    const payload = {
      fullName: inquiry.fullName,
      email: inquiry.email,
      phone: inquiry.phone ?? undefined,
      organization: inquiry.organization ?? undefined,
      inquiryType: inquiry.inquiryType,
      subject: inquiry.subject ?? undefined,
      message: inquiry.message,
    };

    await Promise.allSettled([
      sendContactConfirmation(payload),
      sendAdminInquiryNotification(payload, settings.contactRecipient),
    ]);

    return NextResponse.json(
      { success: true, data: { id: String(inquiry._id) } },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/inquiries]", error);
    return NextResponse.json(
      { success: false, error: "Unable to save inquiry." },
      { status: 500 },
    );
  }
}
