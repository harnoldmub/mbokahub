import { NextResponse } from "next/server";
import { Readable } from "stream";

import { getStorageClient } from "@/lib/storage";

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const ALLOWED_PREFIXES = ["uploads/"];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const objectKey = key.join("/");

  if (
    !objectKey ||
    objectKey.includes("..") ||
    !ALLOWED_PREFIXES.some((p) => objectKey.startsWith(p))
  ) {
    return NextResponse.json({ error: "Clé invalide" }, { status: 400 });
  }

  const client = getStorageClient();

  const exists = await client.exists(objectKey);
  if (!exists.ok || !exists.value) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  const ext = objectKey.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

  const nodeStream = client.downloadAsStream(objectKey);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
