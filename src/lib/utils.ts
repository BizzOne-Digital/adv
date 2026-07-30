import { type ClassValue, clsx } from "clsx";
import { format, isValid, parseISO } from "date-fns";
import slugifyLib from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function slugify(value: string): string {
  return slugifyLib(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function formatDate(
  value: string | Date | null | undefined,
  pattern = "MMMM d, yyyy",
): string {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? parseISO(value) : value;

  if (!isValid(date)) {
    return "";
  }

  return format(date, pattern);
}

export function readingTime(content: string, wordsPerMinute = 200): number {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return 1;
  }

  const words = plainText.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function absoluteUrl(path = ""): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  if (!path) {
    return base;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
