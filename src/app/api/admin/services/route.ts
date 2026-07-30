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
import { revalidateService } from "@/lib/revalidate";
import { serviceSchema } from "@/lib/validations";
import { Service } from "@/models/Service";

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
    Service.find(filter).sort({ order: 1, name: 1 }).skip(skip).limit(limit).lean(),
    Service.countDocuments(filter),
  ]);

  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  try {
    const body = await request.json();
    const data = serviceSchema.parse(body);
    const existing = await Service.findOne({ slug: data.slug });
    if (existing) return jsonError("A service with this slug already exists", 409);

    const doc = await Service.create(data);

    await logActivity({
      session: result.session,
      action: "create",
      entityType: "service",
      entityId: String(doc._id),
      summary: `Created service “${doc.name}”`,
      request,
    });

    if (doc.status === "active") revalidateService(doc.slug);
    return jsonOk(doc, "Service created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create service", 500);
  }
}
