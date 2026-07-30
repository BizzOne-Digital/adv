import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { revalidateService } from "@/lib/revalidate";
import { serviceSchema } from "@/lib/validations";
import { Service } from "@/models/Service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const { id } = await context.params;
  const doc = await Service.findById(id).lean();
  if (!doc) return jsonError("Service not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  try {
    const { id } = await context.params;
    const data = serviceSchema.parse(await request.json());
    const existing = await Service.findById(id);
    if (!existing) return jsonError("Service not found", 404);

    if (data.slug !== existing.slug) {
      const clash = await Service.findOne({ slug: data.slug });
      if (clash) return jsonError("A service with this slug already exists", 409);
    }

    const oldSlug = existing.slug;
    existing.set(data);
    await existing.save();

    await logActivity({
      session: result.session,
      action: "update",
      entityType: "service",
      entityId: String(existing._id),
      summary: `Updated service “${existing.name}”`,
      request,
    });

    revalidateService(existing.slug);
    if (oldSlug !== existing.slug) revalidateService(oldSlug);
    return jsonOk(existing, "Service saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update service", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const { id } = await context.params;
  const doc = await Service.findByIdAndDelete(id);
  if (!doc) return jsonError("Service not found", 404);

  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "service",
    entityId: String(doc._id),
    summary: `Deleted service “${doc.name}”`,
    request,
  });

  revalidateService(doc.slug);
  return jsonOk({ deleted: true }, "Service deleted");
}
