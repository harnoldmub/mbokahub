import { NextResponse } from "next/server";

import { getStorageClient } from "@/lib/storage";

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const objectKey = key.join("/");

  if (!objectKey || objectKey.includes("..")) {
    return NextResponse.json({ error: "Clé invalide" }, { status: 400 });
  }

  const client = getStorageClient();
  const result = await client.downloadAsBytes(objectKey);

  if (!result.ok) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  const data = result.value;
  const buffer: Buffer = Array.isArray(data) ? data[0] : data;

  const ext = objectKey.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(buffer.byteLength),
    },
  });
}
