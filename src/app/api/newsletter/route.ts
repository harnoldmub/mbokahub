import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const source = String(body.source ?? "footer").trim().slice(0, 50);

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, source, confirmed: false },
      update: { source },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[newsletter] POST", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
