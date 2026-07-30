import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
} from "@/lib/admin";
import { destroyCloudinaryAsset } from "@/lib/cloudinary";
import { MediaAsset } from "@/models/MediaAsset";

type Ctx = { params: Promise<{ id: string }> };

function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await MediaAsset.findById(id).lean();
  if (!doc) return jsonError("Media not found", 404);
  return jsonOk(doc);
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await MediaAsset.findById(id);
  if (!doc) return jsonError("Media not found", 404);

  if (cloudinaryConfigured() && doc.publicId && !doc.publicId.startsWith("url:")) {
    try {
      const resourceType =
        doc.resourceType === "video" || doc.resourceType === "raw"
          ? doc.resourceType
          : "image";
      await destroyCloudinaryAsset(doc.publicId, resourceType);
    } catch {
      // Continue deleting DB record even if Cloudinary destroy fails.
    }
  }

  await doc.deleteOne();
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "media",
    entityId: String(doc._id),
    summary: `Deleted media ${doc.publicId}`,
    request,
  });
  return jsonOk({ deleted: true }, "Media deleted");
}
