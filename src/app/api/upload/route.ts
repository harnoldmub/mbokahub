import { randomUUID } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import {
  ALLOWED_IMAGE_TYPES,
  extForMime,
  MAX_IMAGE_BYTES,
  publicUrlForKey,
  putMediaObject,
  resolveImageMime,
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

  const files = formData
    .getAll("files")
    .filter((v): v is File => v instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }
  if (files.length > 12) {
    return NextResponse.json(
      { error: "Maximum 12 fichiers par envoi" },
      { status: 400 },
    );
  }

  const uploaded: UploadedFile[] = [];
  const errors: string[] = [];

  const maxMb = Math.round(MAX_IMAGE_BYTES / 1024 / 1024);
  for (const file of files) {
    const mime = resolveImageMime(file);
    if (
      !ALLOWED_IMAGE_TYPES.includes(
        mime as (typeof ALLOWED_IMAGE_TYPES)[number],
      )
    ) {
      errors.push(
        `${file.name}: format non supporté (${file.type || "inconnu"}). Formats acceptés : JPG, PNG, WebP, GIF, HEIC.`,
      );
      continue;
    }
    if (file.size === 0) {
      errors.push(`${file.name}: fichier vide`);
      continue;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      errors.push(
        `${file.name}: trop lourd (${(file.size / 1024 / 1024).toFixed(1)} Mo, max ${maxMb} Mo)`,
      );
      continue;
    }

    const ext = extForMime(mime);
    const key = `${keyPrefix}/${Date.now()}-${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await putMediaObject(key, buffer);
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
