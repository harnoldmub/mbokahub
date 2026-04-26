import { Client } from "@replit/object-storage";

let cached: Client | null = null;

export function getStorageClient(): Client {
  if (!cached) {
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    cached = bucketId ? new Client({ bucketId }) : new Client();
  }
  return cached;
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function extForMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export function publicUrlForKey(key: string): string {
  return `/api/files/${key}`;
}
