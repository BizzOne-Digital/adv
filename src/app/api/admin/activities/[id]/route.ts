import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { CACHE_TAGS, revalidateContent } from "@/lib/revalidate";
import { activitySchema } from "@/lib/validations";
import { Activity } from "@/models/Activity";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Activity.findById(id).lean();
  if (!doc) return jsonError("Activity not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = activitySchema.parse(await request.json());
    const existing = await Activity.findById(id);
    if (!existing) return jsonError("Activity not found", 404);
    if (data.slug !== existing.slug) {
      if (await Activity.findOne({ slug: data.slug })) {
        return jsonError("An activity with this slug already exists", 409);
      }
    }
    existing.set(data);
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "activity",
      entityId: String(existing._id),
      summary: `Updated activity “${existing.name}”`,
      request,
    });
    revalidateContent({ tags: [CACHE_TAGS.activities], paths: ["/activities", "/"] });
    return jsonOk(existing, "Activity saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update activity", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await Activity.findByIdAndDelete(id);
  if (!doc) return jsonError("Activity not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "activity",
    entityId: String(doc._id),
    summary: `Deleted activity “${doc.name}”`,
    request,
  });
  revalidateContent({ tags: [CACHE_TAGS.activities], paths: ["/activities", "/"] });
  return jsonOk({ deleted: true }, "Activity deleted");
}
