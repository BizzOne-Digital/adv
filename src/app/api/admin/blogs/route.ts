import { ZodError } from "zod";

import {
  escapeRegex,
  jsonError,
  jsonOk,
  logActivity,
  parsePagination,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { revalidateBlog } from "@/lib/revalidate";
import { sanitizeHtml } from "@/lib/sanitize";
import { readingTime } from "@/lib/utils";
import { blogSchema } from "@/lib/validations";
import { BlogPost } from "@/models/BlogPost";

export async function GET(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { searchParams } = new URL(request.url);
  const { page, limit, skip, q, status } = parsePagination(searchParams);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { title: { $regex: escapeRegex(q), $options: "i" } },
      { slug: { $regex: escapeRegex(q), $options: "i" } },
      { excerpt: { $regex: escapeRegex(q), $options: "i" } },
      { tags: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    BlogPost.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const data = blogSchema.parse(await request.json());
    if (await BlogPost.findOne({ slug: data.slug })) {
      return jsonError("A blog post with this slug already exists", 409);
    }
    const content = sanitizeHtml(data.content);
    const doc = await BlogPost.create({
      ...data,
      content,
      readingTimeMinutes: readingTime(content),
      publishedAt:
        data.status === "published" ? data.publishedAt || new Date() : undefined,
      authorId: result.session.user.id,
      authorName: data.authorName || result.session.user.name || "CAFBEX",
    });
    await logActivity({
      session: result.session,
      action: "create",
      entityType: "blog",
      entityId: String(doc._id),
      summary: `Created blog “${doc.title}”`,
      request,
    });
    if (doc.status === "published") revalidateBlog(doc.slug);
    return jsonOk(doc, "Blog post created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create blog post", 500);
  }
}
