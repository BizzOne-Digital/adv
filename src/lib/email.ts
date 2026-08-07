import nodemailer from "nodemailer";
import { Resend } from "resend";

import type { Booking, Inquiry } from "@/types";

const FROM_EMAIL =
  process.env.EMAIL_FROM || "CAFBEX <farm@cafbex.ca>";

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD,
  );
}

function getSmtpTransporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    process.env.SMTP_SECURE === "true" ||
    (!process.env.SMTP_SECURE && port === 465);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<{ sent: boolean; id?: string }> {
  if (smtpConfigured()) {
    try {
      const transporter = getSmtpTransporter();
      const info = await transporter.sendMail({
        from: FROM_EMAIL,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        html: options.html,
      });
      return { sent: true, id: info.messageId };
    } catch (error) {
      console.error("[email] SMTP send failed:", error);
      return { sent: false };
    }
  }

  const client = getResendClient();
  if (!client) {
    console.info(
      "[email] No SMTP or RESEND_API_KEY configured — skipping:",
      options.subject,
    );
    return { sent: false };
  }

  const { data, error } = await client.emails.send({
    from: FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    console.error("[email] Resend failed:", error);
    return { sent: false };
  }

  return { sent: true, id: data?.id };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactConfirmation(
  inquiry: Pick<Inquiry, "fullName" | "email" | "inquiryType" | "message">,
): Promise<{ sent: boolean; id?: string }> {
  const html = `
    <div style="font-family: Georgia, serif; color: #0B3D2E; line-height: 1.6;">
      <h1 style="font-size: 22px;">Thank you for contacting CAFBEX</h1>
      <p>Dear ${escapeHtml(inquiry.fullName)},</p>
      <p>
        We received your ${escapeHtml(inquiry.inquiryType)} inquiry and will respond
        as soon as possible.
      </p>
      <p><strong>Your message:</strong></p>
      <blockquote style="border-left: 3px solid #C6FF4E; padding-left: 12px; color: #334;">
        ${escapeHtml(inquiry.message)}
      </blockquote>
      <p>Canada–Africa Farmers Business Exchange</p>
    </div>
  `;

  return sendEmail({
    to: inquiry.email,
    subject: "We received your message — CAFBEX",
    html,
  });
}

export async function sendAdminInquiryNotification(
  inquiry: Pick<
    Inquiry,
    | "fullName"
    | "email"
    | "phone"
    | "organization"
    | "inquiryType"
    | "subject"
    | "message"
  >,
  recipient?: string,
): Promise<{ sent: boolean; id?: string }> {
  const to =
    recipient ||
    process.env.CONTACT_RECIPIENT_EMAIL ||
    process.env.CONTACT_TO ||
    process.env.ADMIN_EMAIL;

  if (!to) {
    console.info("[email] No contact recipient configured — skipping admin notification.");
    return { sent: false };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
      <h1 style="font-size: 20px;">New CAFBEX inquiry</h1>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(inquiry.fullName)}</li>
        <li><strong>Email:</strong> ${escapeHtml(inquiry.email)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(inquiry.phone ?? "—")}</li>
        <li><strong>Organization:</strong> ${escapeHtml(inquiry.organization ?? "—")}</li>
        <li><strong>Type:</strong> ${escapeHtml(inquiry.inquiryType)}</li>
        <li><strong>Subject:</strong> ${escapeHtml(inquiry.subject ?? "—")}</li>
      </ul>
      <p><strong>Message</strong></p>
      <p>${escapeHtml(inquiry.message)}</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `New inquiry: ${inquiry.inquiryType} — ${inquiry.fullName}`,
    html,
  });
}

export async function sendBookingConfirmation(
  booking: Pick<
    Booking,
    | "fullName"
    | "email"
    | "bookingType"
    | "preferredDate"
    | "preferredTime"
    | "timezone"
    | "message"
  >,
): Promise<{ sent: boolean; id?: string }> {
  const preferredDate =
    booking.preferredDate instanceof Date
      ? booking.preferredDate.toISOString().slice(0, 10)
      : booking.preferredDate
        ? String(booking.preferredDate)
        : "To be confirmed";

  const html = `
    <div style="font-family: Georgia, serif; color: #0B3D2E; line-height: 1.6;">
      <h1 style="font-size: 22px;">Booking request received</h1>
      <p>Dear ${escapeHtml(booking.fullName)},</p>
      <p>
        Thank you for requesting a ${escapeHtml(booking.bookingType.replace(/-/g, " "))}
        with CAFBEX. Our team will review your request and follow up shortly.
      </p>
      <ul>
        <li><strong>Preferred date:</strong> ${escapeHtml(preferredDate)}</li>
        <li><strong>Preferred time:</strong> ${escapeHtml(booking.preferredTime ?? "Flexible")}</li>
        <li><strong>Time zone:</strong> ${escapeHtml(booking.timezone ?? "—")}</li>
      </ul>
      <p><strong>Your message:</strong></p>
      <blockquote style="border-left: 3px solid #1B6B45; padding-left: 12px;">
        ${escapeHtml(booking.message)}
      </blockquote>
      <p>Canada–Africa Farmers Business Exchange</p>
    </div>
  `;

  return sendEmail({
    to: booking.email,
    subject: "Your CAFBEX booking request",
    html,
  });
}

export async function sendAdminBookingNotification(
  booking: Pick<
    Booking,
    | "fullName"
    | "email"
    | "phone"
    | "organization"
    | "country"
    | "bookingType"
    | "preferredDate"
    | "preferredTime"
    | "message"
  >,
  recipient?: string,
): Promise<{ sent: boolean; id?: string }> {
  const to =
    recipient ||
    process.env.BOOKING_TO ||
    process.env.CONTACT_RECIPIENT_EMAIL ||
    process.env.CONTACT_TO ||
    process.env.ADMIN_EMAIL;

  if (!to) {
    console.info("[email] No booking recipient configured — skipping admin notification.");
    return { sent: false };
  }

  const preferredDate =
    booking.preferredDate instanceof Date
      ? booking.preferredDate.toISOString().slice(0, 10)
      : booking.preferredDate
        ? String(booking.preferredDate)
        : "—";

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
      <h1 style="font-size: 20px;">New CAFBEX booking request</h1>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(booking.fullName)}</li>
        <li><strong>Email:</strong> ${escapeHtml(booking.email)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(booking.phone ?? "—")}</li>
        <li><strong>Organization:</strong> ${escapeHtml(booking.organization ?? "—")}</li>
        <li><strong>Country:</strong> ${escapeHtml(booking.country)}</li>
        <li><strong>Type:</strong> ${escapeHtml(booking.bookingType)}</li>
        <li><strong>Preferred date:</strong> ${escapeHtml(preferredDate)}</li>
        <li><strong>Preferred time:</strong> ${escapeHtml(booking.preferredTime ?? "—")}</li>
      </ul>
      <p><strong>Message</strong></p>
      <p>${escapeHtml(booking.message)}</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `New booking: ${booking.bookingType} — ${booking.fullName}`,
    html,
  });
}
