import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { CACHE_TAGS, revalidateContent } from "@/lib/revalidate";
import { pricingSchema } from "@/lib/validations";
import { PricingItem } from "@/models/PricingItem";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await PricingItem.findById(id).lean();
  if (!doc) return jsonError("Pricing item not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = pricingSchema.parse(await request.json());
    const existing = await PricingItem.findById(id);
    if (!existing) return jsonError("Pricing item not found", 404);
    if (data.slug !== existing.slug && (await PricingItem.findOne({ slug: data.slug }))) {
      return jsonError("A pricing item with this slug already exists", 409);
    }
    existing.set(data);
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "pricing",
      entityId: String(existing._id),
      summary: `Updated pricing “${existing.title}”`,
      request,
    });
    revalidateContent({ tags: [CACHE_TAGS.pricing], paths: ["/pricing"] });
    return jsonOk(existing, "Pricing item saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update pricing item", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await PricingItem.findByIdAndDelete(id);
  if (!doc) return jsonError("Pricing item not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "pricing",
    entityId: String(doc._id),
    summary: `Deleted pricing “${doc.title}”`,
    request,
  });
  revalidateContent({ tags: [CACHE_TAGS.pricing], paths: ["/pricing"] });
  return jsonOk({ deleted: true }, "Pricing item deleted");
}
