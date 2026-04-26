import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getAppUrl } from "@/lib/app-url";
import { prisma } from "@/lib/db/prisma";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { isEarlyBirdActive } from "@/lib/stripe-config";

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

    const env = getEnv();
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

    if (dbUser.isVipActive) {
      return NextResponse.json(
        { error: "Tu es déjà VIP", redirect: "/dashboard" },
        { status: 400 },
      );
    }

    const earlyBird = isEarlyBirdActive();
    const priceId =
      earlyBird && env.STRIPE_VIP_EARLY_BIRD_PRICE_ID
        ? env.STRIPE_VIP_EARLY_BIRD_PRICE_ID
        : env.STRIPE_VIP_PRICE_ID;
    if (!priceId) {
      console.error("[checkout/vip] missing STRIPE_VIP_PRICE_ID");
      return NextResponse.json(
        { error: "Paiement temporairement indisponible. Réessaie plus tard." },
        { status: 503 },
      );
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
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?type=vip&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/vip?canceled=1`,
      locale: "fr",
      payment_method_types: ["card"],
      metadata: {
        userId: dbUser.id,
        clerkId: userId,
        type: "VIP_FAN",
        earlyBird: earlyBird ? "1" : "0",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe URL manquante" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout/vip]", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessaie dans un instant." },
      { status: 500 },
    );
  }
}
