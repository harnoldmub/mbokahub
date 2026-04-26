import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAppUrl } from "@/lib/app-url";
import { prisma } from "@/lib/db/prisma";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

const bodySchema = z
  .object({
    targetType: z.enum(["TRAJET", "PRO_PROFILE"]).optional(),
    targetId: z.string().min(1).optional(),
  })
  .optional();

export async function POST(req: Request) {
  const appUrl = getAppUrl(req);
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Connecte-toi d'abord" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email manquant" }, { status: 400 });
    }

    let targetType: "TRAJET" | "PRO_PROFILE" | undefined;
    let targetId: string | undefined;
    try {
      const json = (await req.json()) as unknown;
      const parsed = bodySchema.parse(json);
      targetType = parsed?.targetType;
      targetId = parsed?.targetId;
    } catch {
      // empty body — boost without target (legacy)
    }

    const env = getEnv();
    if (!env.STRIPE_BOOST_PRICE_ID) {
      console.error("[checkout/boost] missing STRIPE_BOOST_PRICE_ID");
      return NextResponse.json(
        { error: "Paiement temporairement indisponible. Réessaie plus tard." },
        { status: 503 },
      );
    }
    const stripe = await getStripe();

    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email,
        name: clerkUser?.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
          : null,
      },
    });

    if (targetType === "TRAJET" && targetId) {
      const trajet = await prisma.trajet.findUnique({ where: { id: targetId } });
      if (!trajet || trajet.userId !== dbUser.id) {
        return NextResponse.json(
          { error: "Trajet introuvable ou non autorisé" },
          { status: 403 },
        );
      }
    } else if (targetType === "PRO_PROFILE" && targetId) {
      const pro = await prisma.proProfile.findUnique({ where: { id: targetId } });
      if (!pro || pro.userId !== dbUser.id) {
        return NextResponse.json(
          { error: "Profil introuvable ou non autorisé" },
          { status: 403 },
        );
      }
    }

    let stripeCustomerId = dbUser.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { clerkId: userId, userId: dbUser.id },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      line_items: [{ price: env.STRIPE_BOOST_PRICE_ID, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?type=boost&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard?canceled=1`,
      locale: "fr",
      payment_method_types: ["card"],
      metadata: {
        userId: dbUser.id,
        clerkId: userId,
        type: "BOOST",
        targetType: targetType ?? "",
        targetId: targetId ?? "",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe URL manquante" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout/boost]", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessaie dans un instant." },
      { status: 500 },
    );
  }
}
