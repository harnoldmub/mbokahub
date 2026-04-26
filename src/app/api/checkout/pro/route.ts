import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAppUrl } from "@/lib/app-url";
import { prisma } from "@/lib/db/prisma";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

const PREMIUM_END = new Date("2026-05-31T23:59:59+02:00");

class PromoUnavailableError extends Error {}

const bodySchema = z
  .object({
    category: z.string().optional(),
    promoCode: z.string().optional(),
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

    let category: string | undefined;
    let promoCodeRaw = "";
    try {
      const json = (await req.json()) as unknown;
      const parsed = bodySchema.parse(json);
      category = parsed?.category?.toUpperCase();
      promoCodeRaw = (parsed?.promoCode ?? "").trim().toUpperCase();
    } catch {
      category = undefined;
      promoCodeRaw = "";
    }

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

    const proProfile = await prisma.proProfile.findUnique({
      where: { userId: dbUser.id },
    });
    if (!proProfile) {
      return NextResponse.json(
        {
          error:
            "Crée d'abord ta fiche pro avant d'activer Premium.",
          redirect: "/pro/inscrire",
        },
        { status: 400 },
      );
    }
    if (proProfile.isPremium) {
      return NextResponse.json(
        { error: "Ta fiche est déjà Premium.", redirect: "/dashboard/annonces" },
        { status: 400 },
      );
    }

    // --- Internal promo code path ---
    if (promoCodeRaw) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCodeRaw },
      });

      if (!promo || !promo.isActive) {
        return NextResponse.json(
          { error: "Code promo invalide ou désactivé." },
          { status: 400 },
        );
      }
      if (promo.category !== "PRO") {
        return NextResponse.json(
          { error: "Ce code promo n'est pas valable pour les fiches pro." },
          { status: 400 },
        );
      }
      if (promo.expiresAt && promo.expiresAt < new Date()) {
        return NextResponse.json(
          { error: "Ce code promo a expiré." },
          { status: 400 },
        );
      }
      if (promo.usedCount >= promo.maxUses) {
        return NextResponse.json(
          { error: "Ce code promo a atteint son nombre maximum d'utilisations." },
          { status: 400 },
        );
      }
      const alreadyRedeemed = await prisma.promoCodeRedemption.findUnique({
        where: {
          promoCodeId_userEmail: { promoCodeId: promo.id, userEmail: email },
        },
      });
      if (alreadyRedeemed) {
        return NextResponse.json(
          { error: "Tu as déjà utilisé ce code." },
          { status: 400 },
        );
      }
      if (promo.discountPercent !== 100) {
        return NextResponse.json(
          {
            error:
              "Code promo partiel — saisis-le sur la page de paiement Stripe.",
          },
          { status: 400 },
        );
      }

      try {
        await prisma.$transaction(async (tx) => {
          const claim = await tx.promoCode.updateMany({
            where: {
              id: promo.id,
              isActive: true,
              usedCount: { lt: promo.maxUses },
              OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
            data: { usedCount: { increment: 1 } },
          });
          if (claim.count !== 1) {
            throw new PromoUnavailableError();
          }
          await tx.promoCodeRedemption.create({
            data: {
              promoCodeId: promo.id,
              userEmail: email,
              userId: dbUser.id,
            },
          });
          const premiumClaim = await tx.proProfile.updateMany({
            where: { userId: dbUser.id, isPremium: false },
            data: { isPremium: true, premiumUntil: PREMIUM_END },
          });
          if (premiumClaim.count !== 1) {
            throw new PromoUnavailableError();
          }
          await tx.payment.create({
            data: {
              userId: dbUser.id,
              stripeSessionId: `promo_${promo.code}_${dbUser.id}_${Date.now()}`,
              type: "PRO_PREMIUM",
              amount: 0,
              currency: "eur",
              status: "COMPLETED",
              completedAt: new Date(),
              metadata: {
                promoCode: promo.code,
                promoLabel: promo.label,
                discountPercent: promo.discountPercent,
                category: category ?? proProfile.category,
              },
            },
          });
        });
      } catch (err) {
        if (err instanceof PromoUnavailableError) {
          return NextResponse.json(
            { error: "Ce code promo n'est plus disponible." },
            { status: 400 },
          );
        }
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          return NextResponse.json(
            { error: "Tu as déjà utilisé ce code." },
            { status: 400 },
          );
        }
        throw err;
      }

      return NextResponse.json({
        redirect: `/checkout/success?type=pro&promo=${encodeURIComponent(promo.code)}`,
      });
    }

    // --- Stripe checkout path ---
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
      allow_promotion_codes: true,
      metadata: {
        userId: dbUser.id,
        clerkId: userId,
        type: "PRO_PREMIUM",
        category: category ?? proProfile.category,
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
