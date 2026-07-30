import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { revalidateEvent } from "@/lib/revalidate";
import { eventSchema } from "@/lib/validations";
import { Event } from "@/models/Event";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Event.findById(id).lean();
  if (!doc) return jsonError("Event not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = eventSchema.parse(await request.json());
    const existing = await Event.findById(id);
    if (!existing) return jsonError("Event not found", 404);
    if (data.slug !== existing.slug) {
      if (await Event.findOne({ slug: data.slug })) {
        return jsonError("An event with this slug already exists", 409);
      }
    }
    existing.set(data);
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "event",
      entityId: String(existing._id),
      summary: `Updated event “${existing.title}”`,
      request,
    });
    if (existing.status === "published") revalidateEvent(existing.slug);
    return jsonOk(existing, "Event saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update event", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Event.findByIdAndDelete(id);
  if (!doc) return jsonError("Event not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "event",
    entityId: String(doc._id),
    summary: `Deleted event “${doc.title}”`,
    request,
  });
  if (doc.status === "published") revalidateEvent(doc.slug);
  return jsonOk({ deleted: true }, "Event deleted");
}
