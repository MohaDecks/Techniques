import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export function uploadsDir() {
  const fromApp = path.resolve(process.cwd(), "../../data/uploads");
  if (existsSync(path.dirname(fromApp))) return fromApp;
  return path.resolve(process.cwd(), "data/uploads");
}

export function extensionFromMime(mime: string) {
  if (mime.includes("png")) return ".png";
  if (mime.includes("webp")) return ".webp";
  if (mime.includes("gif")) return ".gif";
  return ".jpg";
}

export function saveUploadFile(id: string, buffer: Buffer, mimeType: string) {
  const dir = uploadsDir();
  mkdirSync(dir, { recursive: true });
  const fileName = `${id}${extensionFromMime(mimeType)}`;
  writeFileSync(path.join(dir, fileName), buffer);
  return fileName;
}

export function findUploadFile(id: string) {
  const dir = uploadsDir();
  if (!existsSync(dir)) return null;
  const fileName = readdirSync(dir).find((name) => name.startsWith(id));
  if (!fileName) return null;
  const filePath = path.join(dir, fileName);
  const ext = path.extname(fileName).toLowerCase();
  return {
    fileName,
    filePath,
    mimeType: MIME_BY_EXT[ext] ?? "application/octet-stream",
    buffer: readFileSync(filePath),
  };
}

export function deleteUploadFile(id: string) {
  const found = findUploadFile(id);
  if (found) unlinkSync(found.filePath);
}
