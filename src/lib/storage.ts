import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { Client } from "@replit/object-storage";

let cached: Client | null = null;

export function getStorageClient(): Client {
  if (!cached) {
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    cached = bucketId ? new Client({ bucketId }) : new Client();
  }
  return cached;
}

export type MediaStorageMode = "local" | "object";

export function getMediaStorageMode(): MediaStorageMode {
  const configured = process.env.MEDIA_STORAGE_DRIVER;
  if (configured === "object" || configured === "local") return configured;
  if (process.env.MEDIA_UPLOAD_DIR) return "local";
  if (!process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID) return "local";
  return "object";
}

export function getLocalMediaRoot(): string {
  return path.resolve(process.env.MEDIA_UPLOAD_DIR ?? ".media/uploads");
}

export function localPathForKey(key: string): string {
  const root = getLocalMediaRoot();
  const target = path.resolve(root, key);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    throw new Error("Clé média invalide");
  }
  return target;
}

export async function writeLocalMedia(key: string, buffer: Buffer) {
  const target = localPathForKey(key);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, buffer);
}

export async function localMediaExists(key: string): Promise<boolean> {
  try {
    const s = await stat(localPathForKey(key));
    return s.isFile();
  } catch {
    return false;
  }
}

export function createLocalMediaReadStream(key: string) {
  return createReadStream(localPathForKey(key));
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
] as const;

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export function extForMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
    case "image/jpg":
    case "image/pjpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/heic":
    case "image/heic-sequence":
      return "heic";
    case "image/heif":
    case "image/heif-sequence":
      return "heif";
    default:
      return "bin";
  }
}

export function extForFilename(name: string): string | null {
  const dot = name.lastIndexOf(".");
  if (dot < 0 || dot === name.length - 1) return null;
  const ext = name.slice(dot + 1).toLowerCase();
  return ext || null;
}

const EXT_TO_MIME: Record<string, (typeof ALLOWED_IMAGE_TYPES)[number]> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
};

/**
 * Some browsers / mobile uploads send `application/octet-stream` or an empty
 * mime — try to recover a sane image mime from the file extension before we
 * decide to reject the file as "type non supporté".
 */
export function resolveImageMime(file: { type: string; name: string }): string {
  if ((ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return file.type;
  }
  const ext = extForFilename(file.name);
  if (ext && EXT_TO_MIME[ext]) return EXT_TO_MIME[ext];
  return file.type || "";
}

export function publicUrlForKey(key: string): string {
  return `/api/files/${key}`;
}
