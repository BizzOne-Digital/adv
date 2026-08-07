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
import { CACHE_TAGS, revalidateContent } from "@/lib/revalidate";
import { faqSchema } from "@/lib/validations";
import { FAQ } from "@/models/FAQ";

export async function GET(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { searchParams } = new URL(request.url);
  const { page, limit, skip, q, status } = parsePagination(searchParams);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { question: { $regex: escapeRegex(q), $options: "i" } },
      { answer: { $regex: escapeRegex(q), $options: "i" } },
      { category: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    FAQ.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    FAQ.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const data = faqSchema.parse(await request.json());
    const doc = await FAQ.create(data);
    await logActivity({
      session: result.session,
      action: "create",
      entityType: "faq",
      entityId: String(doc._id),
      summary: `Created FAQ “${doc.question.slice(0, 60)}”`,
      request,
    });
    if (doc.status === "active") {
      revalidateContent({ tags: [CACHE_TAGS.faq], paths: ["/faq", "/contact"] });
    }
    return jsonOk(doc, "FAQ created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create FAQ", 500);
  }
}
