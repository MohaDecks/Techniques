import { v2 as cloudinary } from "cloudinary";

const FOLDER = "farsamo";

function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (url) {
    cloudinary.config({ secure: true });
    return true;
  }
  if (cloud_name && api_key && api_secret) {
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    return true;
  }
  return false;
}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  );
}

export async function uploadImageToCloudinary(id: string, buffer: Buffer, mimeType = "image/jpeg") {
  if (!configureCloudinary()) return null;
  try {
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: FOLDER,
      public_id: id,
      overwrite: true,
      resource_type: "image",
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch {
    return null;
  }
}

export async function deleteCloudinaryImage(idOrPublicId: string) {
  if (!configureCloudinary()) return;
  const publicId = idOrPublicId.includes("/") ? idOrPublicId : `${FOLDER}/${idOrPublicId}`;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    return;
  }
}
