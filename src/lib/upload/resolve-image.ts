/**
 * Resolve CMS / content image URLs for safe storefront display.
 * - `/api/uploads/...` → MongoDB-backed uploads (Vercel-safe)
 * - legacy `/uploads/...` disk paths → static fallback
 * - otherwise return the URL as-is (`/images/...`, absolute https, etc.)
 */
export const DEFAULT_CMS_IMAGE = "/images/heroes/page-hero.svg";

export function resolveCmsImage(
  url: string | null | undefined,
  fallback: string = DEFAULT_CMS_IMAGE,
): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("/api/uploads/")) {
    return trimmed;
  }

  // Legacy local-disk paths written before Mongo uploads — do not use on Vercel.
  if (
    trimmed.startsWith("/uploads/") ||
    trimmed.startsWith("uploads/") ||
    trimmed.includes("/public/uploads/")
  ) {
    return fallback;
  }

  return trimmed;
}

export function isMongoUploadUrl(url: string | null | undefined): boolean {
  return Boolean(url && url.startsWith("/api/uploads/"));
}
