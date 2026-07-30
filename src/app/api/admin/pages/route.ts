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
import { revalidatePage } from "@/lib/revalidate";
import { pageSchema } from "@/lib/validations";
import { Page } from "@/models/Page";

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
    ];
  }

  const [items, total] = await Promise.all([
    Page.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    Page.countDocuments(filter),
  ]);

  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  try {
    const body = await request.json();
    const data = pageSchema.parse(body);

    const existing = await Page.findOne({ slug: data.slug });
    if (existing) return jsonError("A page with this slug already exists", 409);

    const doc = await Page.create({
      ...data,
      publishedAt:
        data.status === "published"
          ? data.publishedAt || new Date()
          : undefined,
    });

    await logActivity({
      session: result.session,
      action: "create",
      entityType: "page",
      entityId: String(doc._id),
      summary: `Created page “${doc.title}”`,
      request,
    });

    if (doc.status === "published") {
      revalidatePage(doc.slug);
    }

    return jsonOk(doc, "Page created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create page", 500);
  }
}
