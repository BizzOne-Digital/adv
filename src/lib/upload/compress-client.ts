"use client";

/**
 * Compress / resize images in the browser before upload so large phone
 * photos stay under Vercel's ~4.5MB request body limit.
 */
export async function compressImageForUpload(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  },
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  const maxWidth = options?.maxWidth ?? 2000;
  const maxHeight = options?.maxHeight ?? 2000;
  const quality = options?.quality ?? 0.8;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const outputType =
    file.type === "image/png" || file.type === "image/webp"
      ? file.type
      : "image/jpeg";

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), outputType, quality);
  });

  if (!blob) return file;

  // Prefer compressed only when it actually helps (or we resized).
  if (blob.size >= file.size && scale >= 1) {
    return file;
  }

  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  const ext =
    outputType === "image/png" ? "png" : outputType === "image/webp" ? "webp" : "jpg";

  return new File([blob], `${base}.${ext}`, {
    type: outputType,
    lastModified: Date.now(),
  });
}
