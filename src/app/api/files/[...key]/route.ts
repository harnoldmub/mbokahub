import { Readable } from "node:stream";
import { NextResponse } from "next/server";

import { isSafeMediaKey, mediaExists, mediaReadStream } from "@/lib/storage";

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const objectKey = key.join("/");

  if (!isSafeMediaKey(objectKey)) {
    return NextResponse.json({ error: "Clé invalide" }, { status: 400 });
  }

  if (!(await mediaExists(objectKey))) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  const ext = objectKey.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

  const nodeStream = mediaReadStream(objectKey);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
