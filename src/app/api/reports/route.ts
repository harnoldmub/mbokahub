import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import type { ReportReason, ReportTargetType } from "@prisma/client";

const VALID_TYPES: ReportTargetType[] = [
  "TRAJET",
  "PRO_PROFILE",
  "AFTER",
  "USER",
  "MERCH_PRODUCT",
];
const VALID_REASONS: ReportReason[] = [
  "ARNAQUE",
  "FAUX_PROFIL",
  "SPAM",
  "CONTENU_INAPPROPRIE",
  "PRIX_ABUSIF",
  "CONTACT_NON_REPONSE",
  "AUTRE",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetType, targetId, reason, description, email } = body ?? {};

    if (!VALID_TYPES.includes(targetType)) {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }
    if (!VALID_REASONS.includes(reason)) {
      return NextResponse.json({ error: "Motif invalide" }, { status: 400 });
    }
    if (!targetId || typeof targetId !== "string") {
      return NextResponse.json({ error: "Cible manquante" }, { status: 400 });
    }

    const { userId } = await auth();
    let reporterEmail: string | null = email ?? null;
    let reporterId: string | null = null;

    if (userId) {
      const user = await currentUser();
      reporterEmail = user?.primaryEmailAddress?.emailAddress ?? reporterEmail;
      const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
      reporterId = dbUser?.id ?? null;
    }

    const report = await prisma.report.create({
      data: {
        targetType,
        targetId,
        reason,
        description: description?.toString().slice(0, 1000) ?? null,
        reporterEmail,
        reporterId,
      },
    });

    return NextResponse.json({ ok: true, id: report.id });
  } catch (e) {
    console.error("[reports] POST error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
