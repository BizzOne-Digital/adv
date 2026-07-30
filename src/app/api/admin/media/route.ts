import { ZodError } from "zod";

import {
  escapeRegex,
  jsonError,
  jsonOk,
  logActivity,
  parsePagination,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { mediaAssetSchema } from "@/lib/validations";
import { MediaAsset } from "@/models/MediaAsset";

function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export async function GET(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const { searchParams } = new URL(request.url);
  const { page, limit, skip, q } = parsePagination(searchParams);
  const filter: Record<string, unknown> = {};
  if (q) {
    filter.$or = [
      { publicId: { $regex: escapeRegex(q), $options: "i" } },
      { alt: { $regex: escapeRegex(q), $options: "i" } },
      { caption: { $regex: escapeRegex(q), $options: "i" } },
      { tags: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    MediaAsset.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    MediaAsset.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit, cloudinaryConfigured: cloudinaryConfigured() });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      if (!cloudinaryConfigured()) {
        return jsonError(
          "Cloudinary is not configured. Paste a media URL as JSON instead.",
          400,
        );
      }

      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return jsonError("Missing file", 400);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadToCloudinary(buffer, {
        folder: "cafbex",
        resourceType: "auto",
        tags: ["admin-upload"],
      });

      const resourceType =
        uploaded.resourceType === "video" || uploaded.resourceType === "raw"
          ? uploaded.resourceType
          : "image";

      const doc = await MediaAsset.create({
        publicId: uploaded.publicId,
        url: uploaded.url,
        secureUrl: uploaded.secureUrl,
        resourceType,
        format: uploaded.format,
        width: uploaded.width,
        height: uploaded.height,
        bytes: uploaded.bytes,
        folder: uploaded.folder || "cafbex",
        alt: file.name,
        tags: ["admin-upload"],
      });

      await logActivity({
        session: result.session,
        action: "create",
        entityType: "media",
        entityId: String(doc._id),
        summary: `Uploaded media ${doc.publicId}`,
        request,
      });

      return jsonOk(doc, "Media uploaded", 201);
    }

    const body = await request.json();
    const data = mediaAssetSchema.parse(body);

    if (await MediaAsset.findOne({ publicId: data.publicId })) {
      return jsonError("Media with this publicId already exists", 409);
    }

    const doc = await MediaAsset.create(data);
    await logActivity({
      session: result.session,
      action: "create",
      entityType: "media",
      entityId: String(doc._id),
      summary: `Registered media ${doc.publicId}`,
      request,
    });
    return jsonOk(doc, "Media registered", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    const message = error instanceof Error ? error.message : "Failed to create media";
    return jsonError(message, 500);
  }
}
