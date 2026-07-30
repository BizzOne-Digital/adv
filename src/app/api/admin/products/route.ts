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
import { revalidateProducts } from "@/lib/revalidate";
import { productSchema } from "@/lib/validations";
import { Product } from "@/models/Product";

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
      { category: { $regex: escapeRegex(q), $options: "i" } },
      { summary: { $regex: escapeRegex(q), $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ order: 1, name: 1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return jsonOk({ items, total, page, limit });
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;
  try {
    const data = productSchema.parse(await request.json());
    if (await Product.findOne({ slug: data.slug })) {
      return jsonError("A product with this slug already exists", 409);
    }
    const doc = await Product.create(data);
    await logActivity({
      session: result.session,
      action: "create",
      entityType: "product",
      entityId: String(doc._id),
      summary: `Created product “${doc.name}”`,
      request,
    });
    if (doc.status === "active") revalidateProducts(doc.slug);
    return jsonOk(doc, "Product created", 201);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to create product", 500);
  }
}
