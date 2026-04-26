import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAppUrl } from "@/lib/app-url";
import { prisma } from "@/lib/db/prisma";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

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
    if (!env.STRIPE_PRO_PRICE_ID) {
      console.error("[checkout/pro] missing STRIPE_PRO_PRICE_ID");
      return NextResponse.json(
        { error: "Paiement temporairement indisponible. Réessaie plus tard." },
        { status: 503 },
      );
    }
    const stripe = await getStripe();
    const appUrl = getAppUrl(req);

    let category: string | undefined;
    try {
      const json = (await req.json()) as unknown;
      const parsed = bodySchema.parse(json);
      category = parsed?.category?.toUpperCase();
    } catch {
      category = undefined;
    }
    // Toutes les catégories pro partagent le même prix et le même type
    const paymentType = "PRO_PREMIUM";

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
      success_url: `${appUrl}/checkout/success?type=pro&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pro?canceled=1`,
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
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessaie dans un instant." },
      { status: 500 },
    );
  }
}
