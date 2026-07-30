import { NextResponse } from "next/server";

import {
  getStoredUpload,
  isSafeFilename,
  isUploadFolder,
} from "@/lib/upload/store";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ folder: string; filename: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { folder: folderRaw, filename: filenameRaw } = await params;
  const folder = decodeURIComponent(folderRaw);
  const filename = decodeURIComponent(filenameRaw);

  if (!isUploadFolder(folder) || !isSafeFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const doc = await getStoredUpload(folder, filename);
    if (!doc?.data) {
      return new NextResponse("Not found", { status: 404 });
    }

    const raw = doc.data as unknown;
    let bytes: Buffer;
    if (Buffer.isBuffer(raw)) {
      bytes = raw;
    } else if (raw instanceof Uint8Array) {
      bytes = Buffer.from(raw);
    } else if (
      raw &&
      typeof raw === "object" &&
      "buffer" in raw &&
      (raw as { buffer: ArrayBuffer }).buffer
    ) {
      bytes = Buffer.from((raw as { buffer: ArrayBuffer }).buffer);
    } else {
      bytes = Buffer.from(raw as ArrayBuffer);
    }

    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
