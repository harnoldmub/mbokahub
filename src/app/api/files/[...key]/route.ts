import { Readable } from "node:stream";
import { NextResponse } from "next/server";

import {
  createLocalMediaReadStream,
  getMediaStorageMode,
  getStorageClient,
  localMediaExists,
} from "@/lib/storage";

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

const ALLOWED_PREFIXES = ["uploads/", "pro-photos/"];

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

  const storageMode = getMediaStorageMode();

  let webStream: ReadableStream<Uint8Array>;
  if (storageMode === "local") {
    if (!(await localMediaExists(objectKey))) {
      return NextResponse.json(
        { error: "Fichier introuvable" },
        { status: 404 },
      );
    }
    webStream = Readable.toWeb(
      createLocalMediaReadStream(objectKey),
    ) as ReadableStream<Uint8Array>;
  } else {
    const client = getStorageClient();
    const exists = await client.exists(objectKey);
    if (!exists.ok || !exists.value) {
      return NextResponse.json(
        { error: "Fichier introuvable" },
        { status: 404 },
      );
    }
    const objectStream = client.downloadAsStream(objectKey);
    webStream =
      objectStream instanceof Readable
        ? (Readable.toWeb(objectStream) as ReadableStream<Uint8Array>)
        : (objectStream as ReadableStream<Uint8Array>);
  }

  const ext = objectKey.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
