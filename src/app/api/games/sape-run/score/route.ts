import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

const MAX_PSEUDO_LEN = 24;
const MAX_SCORE = 1_000_000;

function sanitizePseudo(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input
    .trim()
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .slice(0, MAX_PSEUDO_LEN);
  if (trimmed.length < 2) return null;
  return trimmed;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const data = (body ?? {}) as {
    pseudo?: unknown;
    score?: unknown;
    level?: unknown;
  };

  const pseudo = sanitizePseudo(data.pseudo);
  if (!pseudo) {
    return NextResponse.json({ error: "invalid_pseudo" }, { status: 400 });
  }

  const rawScore =
    typeof data.score === "number" || typeof data.score === "string"
      ? Number(data.score)
      : NaN;
  if (
    !Number.isInteger(rawScore) ||
    rawScore < 0 ||
    rawScore > MAX_SCORE
  ) {
    return NextResponse.json({ error: "invalid_score" }, { status: 400 });
  }
  const score = rawScore;

  const rawLevel =
    data.level === undefined || data.level === null ? 1 : Number(data.level);
  const level =
    Number.isInteger(rawLevel) && rawLevel >= 1 && rawLevel <= 999
      ? rawLevel
      : 1;

  // Optional Clerk attribution — game is public, so userId is best-effort.
  let userId: string | null = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
      });
      userId = user?.id ?? null;
    }
  } catch {
    userId = null;
  }

  try {
    const created = await prisma.gameScore.create({
      data: { pseudo, score, level, userId },
      select: { id: true, score: true, pseudo: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, score: created });
  } catch (e) {
    console.error("[api/games/sape-run/score] create failed", {
      err: e instanceof Error ? e.message : String(e),
    });
    return NextResponse.json({ error: "persist_failed" }, { status: 500 });
  }
}
