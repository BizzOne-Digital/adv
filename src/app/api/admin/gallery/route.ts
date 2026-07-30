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
import { revalidateGallery } from "@/lib/revalidate";
import { gallerySchema } from "@/lib/validations";
import { GalleryItem } from "@/models/GalleryItem";

export async function GET(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { searchParams } = new URL(request.url);
  const { page, limit, skip, q, status } = parsePagination(searchParams);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { title: { $regex: escapeRegex(q), $options: "i" } },
      { slug: { $regex: escapeRegex(q), $options: "i" } },
      { category: { $regex: escapeRegex(q), $options: "i" } },
      { caption: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    GalleryItem.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    GalleryItem.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const data = gallerySchema.parse(await request.json());
    if (await GalleryItem.findOne({ slug: data.slug })) {
      return jsonError("A gallery item with this slug already exists", 409);
    }
    const doc = await GalleryItem.create(data);
    await logActivity({
      session: result.session,
      action: "create",
      entityType: "gallery",
      entityId: String(doc._id),
      summary: `Created gallery item “${doc.title}”`,
      request,
    });
    if (doc.status === "published") revalidateGallery();
    return jsonOk(doc, "Gallery item created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create gallery item", 500);
  }
}
