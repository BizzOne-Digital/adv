import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { revalidateGallery } from "@/lib/revalidate";
import { gallerySchema } from "@/lib/validations";
import { GalleryItem } from "@/models/GalleryItem";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await GalleryItem.findById(id).lean();
  if (!doc) return jsonError("Gallery item not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = gallerySchema.parse(await request.json());
    const existing = await GalleryItem.findById(id);
    if (!existing) return jsonError("Gallery item not found", 404);
    if (data.slug !== existing.slug && (await GalleryItem.findOne({ slug: data.slug }))) {
      return jsonError("A gallery item with this slug already exists", 409);
    }
    existing.set(data);
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "gallery",
      entityId: String(existing._id),
      summary: `Updated gallery item “${existing.title}”`,
      request,
    });
    revalidateGallery();
    return jsonOk(existing, "Gallery item saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update gallery item", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await GalleryItem.findByIdAndDelete(id);
  if (!doc) return jsonError("Gallery item not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "gallery",
    entityId: String(doc._id),
    summary: `Deleted gallery item “${doc.title}”`,
    request,
  });
  revalidateGallery();
  return jsonOk({ deleted: true }, "Gallery item deleted");
}
