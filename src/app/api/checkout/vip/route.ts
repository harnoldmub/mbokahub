import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getAppUrl } from "@/lib/app-url";
import { prisma } from "@/lib/db/prisma";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { isEarlyBirdActive } from "@/lib/stripe-config";

const VIP_END = new Date("2026-05-31T23:59:59+02:00");

class PromoUnavailableError extends Error {}

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

    let promoCodeRaw = "";
    try {
      const body = (await req.json().catch(() => ({}))) as {
        promoCode?: string;
      };
      promoCodeRaw = (body.promoCode ?? "").trim().toUpperCase();
    } catch {
      promoCodeRaw = "";
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

    // --- Internal promo code path (100% discount) ---
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
      if (promo.category !== "VIP_FAN") {
        return NextResponse.json(
          { error: "Ce code promo n'est pas valable pour le Pass VIP." },
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
        // Partial discounts go through Stripe via allow_promotion_codes (mapped Stripe coupon).
        // Mboka Hub doesn't yet sync internal codes to Stripe coupons.
        return NextResponse.json(
          {
            error:
              "Code promo partiel — saisis-le sur la page de paiement Stripe.",
          },
          { status: 400 },
        );
      }

      // 100% discount → activate VIP directly, no Stripe required.
      // Use an interactive transaction with a conditional updateMany to atomically
      // claim the promo seat (prevents over-redemption under concurrency).
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
          const vipClaim = await tx.user.updateMany({
            where: { id: dbUser.id, isVipActive: false },
            data: { isVipActive: true, vipUntil: VIP_END },
          });
          if (vipClaim.count !== 1) {
            throw new PromoUnavailableError();
          }
          await tx.payment.create({
            data: {
              userId: dbUser.id,
              stripeSessionId: `promo_${promo.code}_${dbUser.id}_${Date.now()}`,
              type: "VIP_FAN",
              amount: 0,
              currency: "eur",
              status: "COMPLETED",
              completedAt: new Date(),
              metadata: {
                promoCode: promo.code,
                promoLabel: promo.label,
                discountPercent: promo.discountPercent,
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
        redirect: `/checkout/success?type=vip&promo=${encodeURIComponent(promo.code)}`,
      });
    }

    // --- Stripe checkout path ---
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
      allow_promotion_codes: true,
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
