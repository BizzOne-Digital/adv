import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { CACHE_TAGS, revalidateContent } from "@/lib/revalidate";
import { teamSchema } from "@/lib/validations";
import { TeamMember } from "@/models/TeamMember";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await TeamMember.findById(id).lean();
  if (!doc) return jsonError("Team member not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = teamSchema.parse(await request.json());
    const existing = await TeamMember.findById(id);
    if (!existing) return jsonError("Team member not found", 404);
    if (data.slug !== existing.slug && (await TeamMember.findOne({ slug: data.slug }))) {
      return jsonError("A team member with this slug already exists", 409);
    }
    existing.set(data);
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "team",
      entityId: String(existing._id),
      summary: `Updated team member “${existing.name}”`,
      request,
    });
    revalidateContent({ tags: [CACHE_TAGS.team], paths: ["/team"] });
    return jsonOk(existing, "Team member saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update team member", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await TeamMember.findByIdAndDelete(id);
  if (!doc) return jsonError("Team member not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "team",
    entityId: String(doc._id),
    summary: `Deleted team member “${doc.name}”`,
    request,
  });
  revalidateContent({ tags: [CACHE_TAGS.team], paths: ["/team"] });
  return jsonOk({ deleted: true }, "Team member deleted");
}
