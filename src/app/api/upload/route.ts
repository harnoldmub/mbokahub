import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";

import { requireAdmin } from "@/lib/admin";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  extForMime,
  getStorageClient,
  publicUrlForKey,
} from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UploadedFile = { url: string; name: string; size: number; type: string };

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  let admin = false;
  try {
    await requireAdmin();
    admin = true;
  } catch {
    admin = false;
  }
  const keyPrefix = admin ? "uploads" : `pro-photos/${userId}`;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide (multipart attendu)" },
      { status: 400 },
    );
  }

  const files = formData.getAll("files").filter((v): v is File => v instanceof File);
  if (files.length === 0) {
    return NextResponse.json(
      { error: "Aucun fichier reçu" },
      { status: 400 },
    );
  }
  if (files.length > 12) {
    return NextResponse.json(
      { error: "Maximum 12 fichiers par envoi" },
      { status: 400 },
    );
  }

  const client = getStorageClient();
  const uploaded: UploadedFile[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      errors.push(`${file.name}: type non supporté (${file.type || "inconnu"})`);
      continue;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      errors.push(
        `${file.name}: trop lourd (${(file.size / 1024 / 1024).toFixed(1)} Mo, max 5 Mo)`,
      );
      continue;
    }

    const ext = extForMime(file.type);
    const key = `${keyPrefix}/${Date.now()}-${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const result = await client.uploadFromBytes(key, buffer);
      if (!result.ok) {
        const msg = result.error?.message ?? "échec de l'upload";
        console.error("[api/upload] uploadFromBytes failed", {
          key,
          file: file.name,
          err: msg,
        });
        // Fallback: try the streaming path (forces resumable:false internally).
        try {
          await client.uploadFromStream(key, Readable.from(buffer));
        } catch (streamErr) {
          const streamMsg =
            streamErr instanceof Error ? streamErr.message : String(streamErr);
          console.error("[api/upload] uploadFromStream fallback failed", {
            key,
            err: streamMsg,
          });
          errors.push(`${file.name}: ${msg} (stream: ${streamMsg})`);
          continue;
        }
      }
      uploaded.push({
        url: publicUrlForKey(key),
        name: file.name,
        size: file.size,
        type: file.type,
      });
    } catch (e) {
      console.error("[api/upload] unexpected error", {
        key,
        err: e instanceof Error ? e.message : String(e),
      });
      errors.push(
        `${file.name}: ${e instanceof Error ? e.message : "erreur inconnue"}`,
      );
    }
  }

  if (uploaded.length === 0) {
    return NextResponse.json(
      { error: errors.join(" · ") || "Aucun fichier traité" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    files: uploaded,
    ...(errors.length > 0 ? { warnings: errors } : {}),
  });
}
