import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { sendTrajetPriceOfferEmail } from "@/lib/email";

const MIN_PRICE = 1;
const MAX_PRICE = 500;
const MAX_MSG = 500;

function clean(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  return t ? t.slice(0, max) : null;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const prixPropose = Number(body?.prixPropose);
    const message = clean(body?.message, MAX_MSG);
    const proposerNameInput = clean(body?.name, 80);
    const proposerEmailInput = clean(body?.email, 120);
    const proposerWhatsappInput = clean(body?.whatsapp, 30);

    if (!Number.isFinite(prixPropose) || prixPropose < MIN_PRICE || prixPropose > MAX_PRICE) {
      return NextResponse.json(
        { error: `Le prix doit être entre ${MIN_PRICE} et ${MAX_PRICE} €.` },
        { status: 400 },
      );
    }

    const trajet = await prisma.trajet.findUnique({
      where: { id },
      include: { user: { select: { email: true, name: true } } },
    });
    if (!trajet || !trajet.isApproved || !trajet.isActive) {
      return NextResponse.json({ error: "Trajet introuvable" }, { status: 404 });
    }
    if (!trajet.user.email) {
      return NextResponse.json(
        { error: "Conducteur sans email, impossible de transmettre" },
        { status: 422 },
      );
    }

    let proposerName: string | null = null;
    let proposerEmail: string | null = null;
    const proposerWhatsapp = proposerWhatsappInput;

    const { userId } = await auth();
    if (userId) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true, email: true, name: true },
      });
      if (!dbUser) {
        return NextResponse.json(
          { error: "Compte introuvable, reconnecte-toi." },
          { status: 401 },
        );
      }
      if (dbUser.id === trajet.userId) {
        return NextResponse.json(
          { error: "Tu ne peux pas faire une proposition sur ton propre trajet." },
          { status: 400 },
        );
      }
      const cu = await currentUser();
      proposerEmail =
        dbUser.email ?? cu?.primaryEmailAddress?.emailAddress ?? null;
      proposerName = dbUser.name ?? cu?.firstName ?? null;
    } else {
      proposerName = proposerNameInput;
      if (proposerEmailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(proposerEmailInput)) {
        proposerEmail = proposerEmailInput;
      }
    }

    if (!proposerEmail && !proposerWhatsapp) {
      return NextResponse.json(
        { error: "Laisse au moins un email valide ou un WhatsApp pour qu'on te recontacte." },
        { status: 400 },
      );
    }

    await sendTrajetPriceOfferEmail({
      to: trajet.user.email,
      driverName: trajet.user.name,
      villeDepart: trajet.villeDepart,
      villeArrivee: trajet.villeArrivee,
      prixPublie: trajet.prix,
      prixPropose: Math.round(prixPropose * 100) / 100,
      proposerName,
      proposerEmail,
      proposerWhatsapp,
      message,
      trajetId: trajet.id,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[trajet-offer] POST error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
