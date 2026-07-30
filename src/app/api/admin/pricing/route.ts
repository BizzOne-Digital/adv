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
import { pricingSchema } from "@/lib/validations";
import { PricingItem } from "@/models/PricingItem";

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
      { category: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    PricingItem.find(filter).sort({ order: 1, title: 1 }).skip(skip).limit(limit).lean(),
    PricingItem.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const data = pricingSchema.parse(await request.json());
    if (await PricingItem.findOne({ slug: data.slug })) {
      return jsonError("A pricing item with this slug already exists", 409);
    }
    const doc = await PricingItem.create(data);
    await logActivity({
      session: result.session,
      action: "create",
      entityType: "pricing",
      entityId: String(doc._id),
      summary: `Created pricing “${doc.title}”`,
      request,
    });
    if (doc.status === "active") {
      revalidateContent({ tags: [CACHE_TAGS.pricing], paths: ["/pricing"] });
    }
    return jsonOk(doc, "Pricing item created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create pricing item", 500);
  }
}
