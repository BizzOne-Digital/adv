import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { revalidateBlog } from "@/lib/revalidate";
import { sanitizeHtml } from "@/lib/sanitize";
import { readingTime } from "@/lib/utils";
import { blogSchema } from "@/lib/validations";
import { BlogPost } from "@/models/BlogPost";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await BlogPost.findById(id).lean();
  if (!doc) return jsonError("Blog post not found", 404);
  return jsonOk(doc);
}

export async function PUT(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const { id } = await context.params;
    const data = blogSchema.parse(await request.json());
    const existing = await BlogPost.findById(id);
    if (!existing) return jsonError("Blog post not found", 404);
    if (data.slug !== existing.slug && (await BlogPost.findOne({ slug: data.slug }))) {
      return jsonError("A blog post with this slug already exists", 409);
    }
    const content = sanitizeHtml(data.content);
    const wasPublished = existing.status === "published";
    existing.set({
      ...data,
      content,
      readingTimeMinutes: readingTime(content),
      publishedAt:
        data.status === "published"
          ? data.publishedAt || existing.publishedAt || new Date()
          : existing.publishedAt,
    });
    await existing.save();
    await logActivity({
      session: result.session,
      action: "update",
      entityType: "blog",
      entityId: String(existing._id),
      summary: `Updated blog “${existing.title}”`,
      request,
    });
    if (existing.status === "published" || wasPublished) {
      revalidateBlog(existing.slug);
    }
    return jsonOk(existing, "Blog post saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update blog post", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { id } = await context.params;
  const doc = await BlogPost.findByIdAndDelete(id);
  if (!doc) return jsonError("Blog post not found", 404);
  await logActivity({
    session: result.session,
    action: "delete",
    entityType: "blog",
    entityId: String(doc._id),
    summary: `Deleted blog “${doc.title}”`,
    request,
  });
  if (doc.status === "published") revalidateBlog(doc.slug);
  return jsonOk({ deleted: true }, "Blog post deleted");
}
