import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { bookingSchema } from "@/lib/validations";
import { sanitizePlainText } from "@/lib/sanitize";
import {
  sendAdminBookingNotification,
  sendBookingConfirmation,
} from "@/lib/email";
import { getSettings } from "@/lib/data";
import { Booking } from "@/models";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`bookings:${ip}`, { limit: 8, windowMs: 60 * 60 * 1000 });
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

    // Honeypot
    if (body.website) {
      return NextResponse.json({ success: true, data: { id: "ok" } });
    }

    // Normalize empty date
    if (body.preferredDate === "" || body.preferredDate === null) {
      delete body.preferredDate;
    }

    const parsed = bookingSchema.safeParse(body);
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

    const booking = await Booking.create({
      fullName: sanitizePlainText(data.fullName),
      organization: data.organization
        ? sanitizePlainText(data.organization)
        : undefined,
      role: data.role ? sanitizePlainText(data.role) : undefined,
      country: sanitizePlainText(data.country),
      email: data.email.toLowerCase().trim(),
      phone: data.phone ? sanitizePlainText(data.phone) : undefined,
      bookingType: data.bookingType,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime
        ? sanitizePlainText(data.preferredTime)
        : undefined,
      timezone: data.timezone ? sanitizePlainText(data.timezone) : undefined,
      areasOfInterest: data.areasOfInterest?.map(sanitizePlainText),
      message: sanitizePlainText(data.message),
      consent: data.consent,
      status: "new",
    });

    const settings = await getSettings();
    const payload = {
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone ?? undefined,
      organization: booking.organization ?? undefined,
      country: booking.country,
      bookingType: booking.bookingType,
      preferredDate: booking.preferredDate ?? undefined,
      preferredTime: booking.preferredTime ?? undefined,
      timezone: booking.timezone ?? undefined,
      message: booking.message,
    };

    await Promise.allSettled([
      sendBookingConfirmation(payload),
      sendAdminBookingNotification(payload, settings.bookingRecipient),
    ]);

    return NextResponse.json(
      { success: true, data: { id: String(booking._id) } },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/bookings]", error);
    return NextResponse.json(
      { success: false, error: "Unable to save booking request." },
      { status: 500 },
    );
  }
}
