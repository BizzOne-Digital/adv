import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { CACHE_TAGS, revalidateContent } from "@/lib/revalidate";
import { faqSchema } from "@/lib/validations";
import { FAQ } from "@/models/FAQ";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await FAQ.findById(id).lean();
  if (!doc) return jsonError("FAQ not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = faqSchema.parse(await request.json());
    const existing = await FAQ.findById(id);
    if (!existing) return jsonError("FAQ not found", 404);
    existing.set(data);
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "faq",
      entityId: String(existing._id),
      summary: `Updated FAQ “${existing.question.slice(0, 60)}”`,
      request,
    });
    revalidateContent({ tags: [CACHE_TAGS.faq], paths: ["/faq", "/contact"] });
    return jsonOk(existing, "FAQ saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update FAQ", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await FAQ.findByIdAndDelete(id);
  if (!doc) return jsonError("FAQ not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "faq",
    entityId: String(doc._id),
    summary: `Deleted FAQ “${doc.question.slice(0, 60)}”`,
    request,
  });
  revalidateContent({ tags: [CACHE_TAGS.faq], paths: ["/faq", "/contact"] });
  return jsonOk({ deleted: true }, "FAQ deleted");
}
