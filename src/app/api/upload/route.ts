import { NextResponse } from "next/server";

import { requireAdmin, jsonOk, jsonError } from "@/lib/admin";
import { logActivity } from "@/lib/admin";
import {
  isUploadFolder,
  saveFolderUpload,
  MAX_UPLOAD_BYTES,
} from "@/lib/upload/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") || "misc");

    if (!(file instanceof File)) {
      return jsonError("Missing file", 400);
    }

    if (!isUploadFolder(folderRaw)) {
      return jsonError(
        'Invalid folder. Use "pages", "products", "gallery", or "misc".',
        400,
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return jsonError(
        `Image exceeds ${(MAX_UPLOAD_BYTES / (1024 * 1024)).toFixed(1)}MB limit. Compress and try again.`,
        413,
      );
    }

    const saved = await saveFolderUpload(file, folderRaw);

    await logActivity({
      session: authResult.session,
      action: "upload.create",
      entityType: "storedUpload",
      summary: `Uploaded ${saved.folder}/${saved.filename}`,
      metadata: { folder: saved.folder, filename: saved.filename, size: saved.size },
      request,
    });

    return jsonOk(
      {
        url: saved.url,
        filename: saved.filename,
        folder: saved.folder,
        size: saved.size,
        mimeType: saved.mimeType,
      },
      "Uploaded",
      201,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return jsonError(message, 400);
  }
}
