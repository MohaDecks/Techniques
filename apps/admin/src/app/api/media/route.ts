import { NextResponse } from "next/server";
import { createId } from "@farsamo/core";
import { saveUploadFile } from "@farsamo/core/uploads";
import { uploadImageToCloudinary } from "@farsamo/core/cloudinary";
import type { MediaKind } from "@farsamo/core";

export const runtime = "nodejs";

const ALLOWED: MediaKind[] = ["service", "category", "provider", "banner", "request"];

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const id = createId("media");
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "image/jpeg";
  const requested = String(form.get("kind") || "service") as MediaKind;
  const kind = ALLOWED.includes(requested) ? requested : "service";
  const cloud = await uploadImageToCloudinary(id, buffer, mimeType);
  const fileName = cloud?.publicId ?? saveUploadFile(id, buffer, mimeType);

  return NextResponse.json({
    id,
    kind,
    name: String(form.get("name") || file.name || "Upload"),
    url: cloud?.url ?? `/api/media/${id}`,
    fileName,
    mimeType,
    size: buffer.length,
    isActive: true,
    createdAt: new Date().toISOString(),
  });
}
