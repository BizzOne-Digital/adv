import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { inquiryAdminUpdateSchema } from "@/lib/validations";
import { Inquiry } from "@/models/Inquiry";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Inquiry.findById(id).lean();
  if (!doc) return jsonError("Inquiry not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = inquiryAdminUpdateSchema.parse(await request.json());
    const existing = await Inquiry.findById(id);
    if (!existing) return jsonError("Inquiry not found", 404);
    if (data.status !== undefined) existing.status = data.status;
    if (data.adminNotes !== undefined) existing.adminNotes = data.adminNotes;
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "inquiry",
      entityId: String(existing._id),
      summary: `Updated inquiry from ${existing.fullName} (${existing.status})`,
      request,
    });
    return jsonOk(existing, "Inquiry updated");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update inquiry", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Inquiry.findByIdAndDelete(id);
  if (!doc) return jsonError("Inquiry not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "inquiry",
    entityId: String(doc._id),
    summary: `Deleted inquiry from ${doc.fullName}`,
    request,
  });
  return jsonOk({ deleted: true }, "Inquiry deleted");
}
