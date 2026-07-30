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
import { activitySchema } from "@/lib/validations";
import { Activity } from "@/models/Activity";

export async function GET(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const { searchParams } = new URL(request.url);
  const { page, limit, skip, q, status } = parsePagination(searchParams);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { name: { $regex: escapeRegex(q), $options: "i" } },
      { slug: { $regex: escapeRegex(q), $options: "i" } },
      { summary: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Activity.find(filter).sort({ order: 1, name: 1 }).skip(skip).limit(limit).lean(),
    Activity.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  try {
    const data = activitySchema.parse(await request.json());
    if (await Activity.findOne({ slug: data.slug })) {
      return jsonError("An activity with this slug already exists", 409);
    }
    const doc = await Activity.create(data);
    await logActivity({
      session: result.session,
      action: "create",
      entityType: "activity",
      entityId: String(doc._id),
      summary: `Created activity “${doc.name}”`,
      request,
    });
    if (doc.status === "active") {
      revalidateContent({ tags: [CACHE_TAGS.activities], paths: ["/activities", "/"] });
    }
    return jsonOk(doc, "Activity created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create activity", 500);
  }
}
