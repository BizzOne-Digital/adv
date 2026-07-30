import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { revalidateProducts } from "@/lib/revalidate";
import { productSchema } from "@/lib/validations";
import { Product } from "@/models/Product";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Product.findById(id).lean();
  if (!doc) return jsonError("Product not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = productSchema.parse(await request.json());
    const existing = await Product.findById(id);
    if (!existing) return jsonError("Product not found", 404);
    if (data.slug !== existing.slug && (await Product.findOne({ slug: data.slug }))) {
      return jsonError("A product with this slug already exists", 409);
    }
    existing.set(data);
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "product",
      entityId: String(existing._id),
      summary: `Updated product “${existing.name}”`,
      request,
    });
    revalidateProducts(existing.slug);
    return jsonOk(existing, "Product saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update product", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Product.findByIdAndDelete(id);
  if (!doc) return jsonError("Product not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "product",
    entityId: String(doc._id),
    summary: `Deleted product “${doc.name}”`,
    request,
  });
  revalidateProducts(doc.slug);
  return jsonOk({ deleted: true }, "Product deleted");
}
