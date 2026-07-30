import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { revalidatePage } from "@/lib/revalidate";
import { pageSchema } from "@/lib/validations";
import { Page } from "@/models/Page";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const { slug } = await context.params;
  const doc = await Page.findOne({ slug }).lean();
  if (!doc) return jsonError("Page not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  try {
    const { slug } = await context.params;
    const body = await request.json();
    const data = pageSchema.parse(body);

    if (data.slug !== slug) {
      const clash = await Page.findOne({ slug: data.slug });
      if (clash) return jsonError("A page with this slug already exists", 409);
    }

    const existing = await Page.findOne({ slug });
    if (!existing) return jsonError("Page not found", 404);

    const wasPublished = existing.status === "published";
    existing.set({
      ...data,
      publishedAt:
        data.status === "published"
          ? data.publishedAt || existing.publishedAt || new Date()
          : existing.publishedAt,
    });
    await existing.save();

    await logActivity({
      session: result.session,
      action: "update",
      entityType: "page",
      entityId: String(existing._id),
      summary: `Updated page “${existing.title}”`,
      request,
    });

    if (existing.status === "published" || wasPublished) {
      revalidatePage(existing.slug);
      if (slug !== existing.slug) revalidatePage(slug);
    }

    return jsonOk(existing, "Page saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update page", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const { slug } = await context.params;
  const doc = await Page.findOneAndDelete({ slug });
  if (!doc) return jsonError("Page not found", 404);

  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "page",
    entityId: String(doc._id),
    summary: `Deleted page “${doc.title}”`,
    request,
  });

  if (doc.status === "published") {
    revalidatePage(doc.slug);
  }

  return jsonOk({ deleted: true }, "Page deleted");
}
