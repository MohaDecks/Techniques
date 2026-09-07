import { NextResponse } from "next/server";
import { deleteUploadFile, findUploadFile } from "@farsamo/core/uploads";
import { deleteCloudinaryImage } from "@farsamo/core/cloudinary";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const found = findUploadFile(id);
  if (!found) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(found.buffer), {
    headers: {
      "Content-Type": found.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await deleteCloudinaryImage(id);
  deleteUploadFile(id);
  return NextResponse.json({ ok: true });
}
