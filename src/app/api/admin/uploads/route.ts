import { NextResponse } from "next/server";

import { requireAdmin, jsonOk, jsonError, parsePagination } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { buildUploadUrl } from "@/lib/upload/store";
import { StoredUpload } from "@/models/StoredUpload";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { limit, skip } = parsePagination(searchParams);
    const folder = searchParams.get("folder")?.trim();

    const filter: Record<string, unknown> = {};
    if (folder) filter.folder = folder;

    const [items, total] = await Promise.all([
      StoredUpload.find(filter)
        .select("-data")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StoredUpload.countDocuments(filter),
    ]);

    return jsonOk({
      items: items.map((doc) => ({
        _id: String(doc._id),
        folder: doc.folder,
        filename: doc.filename,
        mimeType: doc.mimeType,
        size: doc.size,
        url: buildUploadUrl(
          doc.folder as "pages" | "products" | "gallery" | "misc",
          doc.filename,
        ),
        createdAt: doc.createdAt,
      })),
      total,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list uploads";
    return jsonError(message, 500);
  }
}
