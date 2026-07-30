import { connectDB } from "@/lib/mongodb";
import {
  StoredUpload,
  UPLOAD_FOLDERS,
  type UploadFolder,
} from "@/models/StoredUpload";

export const MAX_UPLOAD_BYTES = Math.floor(4.5 * 1024 * 1024);

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type SaveFolderUploadResult = {
  url: string;
  folder: UploadFolder;
  filename: string;
  size: number;
  mimeType: string;
};

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function buildUploadUrl(folder: UploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${encodeURIComponent(filename)}`;
}

export function parseUploadUrl(
  url: string,
): { folder: UploadFolder; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/?#]+)$/);
  if (!match) return null;
  const folder = decodeURIComponent(match[1]);
  const filename = decodeURIComponent(match[2]);
  if (!isUploadFolder(folder)) return null;
  if (!isSafeFilename(filename)) return null;
  return { folder, filename };
}

export function isSafeFilename(filename: string): boolean {
  if (!filename || filename.length > 200) return false;
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return false;
  }
  return /^[a-zA-Z0-9._-]+$/.test(filename);
}

function sanitizeBaseName(name: string): string {
  const base = name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "image";
}

function uniqueFilename(originalName: string, mimeType: string): string {
  const ext = EXT_BY_MIME[mimeType] || "bin";
  const base = sanitizeBaseName(originalName);
  const stamp = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `${base}-${stamp}.${ext}`;
}

export async function saveFolderUpload(
  file: File,
  folder: UploadFolder,
): Promise<SaveFolderUploadResult> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }

  if (file.size <= 0) {
    throw new Error("Empty file.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image is too large. Maximum size is ${(MAX_UPLOAD_BYTES / (1024 * 1024)).toFixed(1)}MB.`,
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = uniqueFilename(file.name || "image", file.type);

  await connectDB();

  await StoredUpload.findOneAndUpdate(
    { folder, filename },
    {
      folder,
      filename,
      mimeType: file.type,
      size: buffer.length,
      data: buffer,
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );

  return {
    url: buildUploadUrl(folder, filename),
    folder,
    filename,
    size: buffer.length,
    mimeType: file.type,
  };
}

export async function getStoredUpload(folder: UploadFolder, filename: string) {
  if (!isSafeFilename(filename)) return null;
  await connectDB();
  return StoredUpload.findOne({ folder, filename }).lean();
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;
  await connectDB();
  const result = await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });
  return result.deletedCount > 0;
}
