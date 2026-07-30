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
import { revalidateEvent } from "@/lib/revalidate";
import { eventSchema } from "@/lib/validations";
import { Event } from "@/models/Event";

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
      { summary: { $regex: escapeRegex(q), $options: "i" } },
      { location: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    Event.find(filter).sort({ startDate: -1 }).skip(skip).limit(limit).lean(),
    Event.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const data = eventSchema.parse(await request.json());
    if (await Event.findOne({ slug: data.slug })) {
      return jsonError("An event with this slug already exists", 409);
    }
    const doc = await Event.create(data);
    await logActivity({
      session: result.session,
      action: "create",
      entityType: "event",
      entityId: String(doc._id),
      summary: `Created event “${doc.title}”`,
      request,
    });
    if (doc.status === "published") revalidateEvent(doc.slug);
    return jsonOk(doc, "Event created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create event", 500);
  }
}
