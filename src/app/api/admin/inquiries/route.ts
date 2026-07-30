import {
  escapeRegex,
  jsonOk,
  parsePagination,
  requireAdmin,
} from "@/lib/admin";
import { Inquiry } from "@/models/Inquiry";

export async function GET(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const { searchParams } = new URL(request.url);
  const { page, limit, skip, q, status } = parsePagination(searchParams);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { fullName: { $regex: escapeRegex(q), $options: "i" } },
      { email: { $regex: escapeRegex(q), $options: "i" } },
      { subject: { $regex: escapeRegex(q), $options: "i" } },
      { organization: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Inquiry.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit });
}
