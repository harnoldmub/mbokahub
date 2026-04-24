import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

const PRO_CATEGORY_TO_PAYMENT_TYPE: Record<string, string> = {
  MAQUILLEUSE: "PRO_PREMIUM_MAQUILLEUSE",
  COIFFEUR: "PRO_PREMIUM_COIFFEUR",
  BARBIER: "PRO_PREMIUM_BARBIER",
  PHOTOGRAPHE: "PRO_PREMIUM_PHOTOGRAPHE",
  VENDEUR_MERCH: "PRO_PREMIUM_MERCH",
  ORGANISATEUR_AFTER: "PRO_PREMIUM_AFTER",
};

const bodySchema = z
  .object({
    category: z.string().optional(),
  })
  .optional();

export async function POST(req: Request) {
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

    const env = getEnv();
    const stripe = getStripe();

    let category: string | undefined;
    try {
      const json = (await req.json()) as unknown;
      const parsed = bodySchema.parse(json);
      category = parsed?.category?.toUpperCase();
    } catch {
      category = undefined;
    }
    const paymentType =
      (category && PRO_CATEGORY_TO_PAYMENT_TYPE[category]) ||
      "PRO_PREMIUM_MAQUILLEUSE";

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
      line_items: [{ price: env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
      success_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/success?type=pro&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/pro?canceled=1`,
      locale: "fr",
      payment_method_types: ["card"],
      metadata: {
        userId: dbUser.id,
        clerkId: userId,
        type: paymentType,
        category: category ?? "",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe URL manquante" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout/pro]", err);
    const msg = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
