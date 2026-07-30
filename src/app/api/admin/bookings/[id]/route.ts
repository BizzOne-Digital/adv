import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { bookingAdminUpdateSchema } from "@/lib/validations";
import { Booking } from "@/models/Booking";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Booking.findById(id).lean();
  if (!doc) return jsonError("Booking not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = bookingAdminUpdateSchema.parse(await request.json());
    const existing = await Booking.findById(id);
    if (!existing) return jsonError("Booking not found", 404);
    if (data.status !== undefined) existing.status = data.status;
    if (data.adminNotes !== undefined) existing.adminNotes = data.adminNotes;
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "booking",
      entityId: String(existing._id),
      summary: `Updated booking from ${existing.fullName} (${existing.status})`,
      request,
    });
    return jsonOk(existing, "Booking updated");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update booking", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Booking.findByIdAndDelete(id);
  if (!doc) return jsonError("Booking not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "booking",
    entityId: String(doc._id),
    summary: `Deleted booking from ${doc.fullName}`,
    request,
  });
  return jsonOk({ deleted: true }, "Booking deleted");
}
