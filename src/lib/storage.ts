import { createReadStream } from "node:fs";
import { mkdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED_MEDIA_PREFIXES = ["uploads/", "pro-photos/"] as const;

export function getMediaStorageRoot(): string {
  const configured = process.env.MEDIA_STORAGE_ROOT?.trim();
  return configured
    ? path.resolve(process.cwd(), configured)
    : path.join(process.cwd(), ".media");
}

export function isSafeMediaKey(key: string): boolean {
  return Boolean(
    key &&
      !key.includes("..") &&
      ALLOWED_MEDIA_PREFIXES.some((prefix) => key.startsWith(prefix)),
  );
}

function resolveLocalPathForKey(key: string): string {
  if (!isSafeMediaKey(key)) {
    throw new Error("Clé media invalide");
  }

  return path.join(getMediaStorageRoot(), ...key.split("/"));
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

export async function putMediaObject(
  key: string,
  buffer: Buffer,
): Promise<void> {
  const absolutePath = resolveLocalPathForKey(key);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, buffer);
}

export async function mediaExists(key: string): Promise<boolean> {
  try {
    await stat(resolveLocalPathForKey(key));
    return true;
  } catch {
    return false;
  }
}

export function mediaReadStream(key: string) {
  return createReadStream(resolveLocalPathForKey(key));
}

export function publicUrlForKey(key: string): string {
  return `/api/files/${key}`;
}

export function mediaKeyFromPublicUrl(url: string): string | null {
  const prefix = "/api/files/";
  if (!url.startsWith(prefix)) return null;

  const key = decodeURIComponent(url.slice(prefix.length));
  return isSafeMediaKey(key) ? key : null;
}

export async function deleteMediaByUrl(url: string): Promise<void> {
  const key = mediaKeyFromPublicUrl(url);
  if (!key) return;

  try {
    await unlink(resolveLocalPathForKey(key));
  } catch {
    // Ignore missing files / old orphaned references.
  }
}

export function normalizeUploadedMediaUrls(
  value: string,
  maxFiles = 12,
): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const raw of value.split(/[\n,]+/)) {
    const candidate = raw.trim();
    if (!candidate) continue;
    if (
      !/^https?:\/\//i.test(candidate) &&
      !candidate.startsWith("/api/files/")
    ) {
      continue;
    }
    if (seen.has(candidate)) continue;

    seen.add(candidate);
    normalized.push(candidate);

    if (normalized.length >= maxFiles) break;
  }

  return normalized;
}
