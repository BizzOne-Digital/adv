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
import { testimonialSchema } from "@/lib/validations";
import { Testimonial } from "@/models/Testimonial";

export async function GET(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  const { searchParams } = new URL(request.url);
  const { page, limit, skip, q } = parsePagination(searchParams);
  const approved = searchParams.get("approved");
  const filter: Record<string, unknown> = {};
  if (approved === "true") filter.approved = true;
  if (approved === "false") filter.approved = false;
  if (q) {
    filter.$or = [
      { name: { $regex: escapeRegex(q), $options: "i" } },
      { organization: { $regex: escapeRegex(q), $options: "i" } },
      { quote: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    Testimonial.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Testimonial.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const data = testimonialSchema.parse(await request.json());
    const doc = await Testimonial.create(data);
    await logActivity({
      session: result.session,
      action: "create",
      entityType: "testimonial",
      entityId: String(doc._id),
      summary: `Created testimonial from “${doc.name}”`,
      request,
    });
    if (doc.approved) {
      revalidateContent({ tags: [CACHE_TAGS.testimonials], paths: ["/", "/testimonials"] });
    }
    return jsonOk(doc, "Testimonial created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create testimonial", 500);
  }
}
