import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { CACHE_TAGS, revalidateContent } from "@/lib/revalidate";
import { testimonialSchema } from "@/lib/validations";
import { Testimonial } from "@/models/Testimonial";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Testimonial.findById(id).lean();
  if (!doc) return jsonError("Testimonial not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = testimonialSchema.parse(await request.json());
    const existing = await Testimonial.findById(id);
    if (!existing) return jsonError("Testimonial not found", 404);
    existing.set(data);
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "testimonial",
      entityId: String(existing._id),
      summary: `Updated testimonial from “${existing.name}”`,
      request,
    });
    revalidateContent({ tags: [CACHE_TAGS.testimonials], paths: ["/"] });
    return jsonOk(existing, "Testimonial saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update testimonial", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Testimonial.findByIdAndDelete(id);
  if (!doc) return jsonError("Testimonial not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "testimonial",
    entityId: String(doc._id),
    summary: `Deleted testimonial from “${doc.name}”`,
    request,
  });
  revalidateContent({ tags: [CACHE_TAGS.testimonials], paths: ["/"] });
  return jsonOk({ deleted: true }, "Testimonial deleted");
}
