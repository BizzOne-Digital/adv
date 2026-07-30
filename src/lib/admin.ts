import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { ZodError } from "zod";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { ActivityLog } from "@/models/ActivityLog";

export async function requireAdmin(): Promise<
  | { session: Session; error?: undefined }
  | { session?: undefined; error: NextResponse }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  await connectDB();
  return { session };
}

export function jsonOk<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function jsonError(error: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error, details }, { status });
}

export function zodErrorResponse(error: ZodError) {
  return jsonError("Validation failed", 400, error.flatten());
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") || 1) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") || 20) || 20),
  );
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";

  return { page, limit, skip: (page - 1) * limit, q, status };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface LogActivityInput {
  session: Session;
  action: string;
  entityType: string;
  entityId?: string;
  summary: string;
  metadata?: Record<string, string | number | boolean | null>;
  request?: Request;
}

export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    const ip =
      input.request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      input.request?.headers.get("x-real-ip") ||
      undefined;

    await ActivityLog.create({
      actorId: input.session.user.id,
      actorEmail: input.session.user.email,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      summary: input.summary,
      metadata: input.metadata,
      ipAddress: ip,
    });
  } catch {
    // Activity logging should never block the primary mutation.
  }
}

export function toPlain<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}
