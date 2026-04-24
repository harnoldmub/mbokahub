import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { prisma } from "@/lib/db/prisma";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const VIP_END = new Date("2026-05-31T23:59:59+02:00");
const PREMIUM_END = new Date("2026-05-31T23:59:59+02:00");
const BOOST_END = new Date("2026-05-31T23:59:59+02:00");

const KNOWN_TYPES = new Set([
  "VIP_FAN",
  "BOOST",
  "PRO_PREMIUM_MAQUILLEUSE",
  "PRO_PREMIUM_COIFFEUR",
  "PRO_PREMIUM_BARBIER",
  "PRO_PREMIUM_PHOTOGRAPHE",
  "PRO_PREMIUM_MERCH",
  "PRO_PREMIUM_AFTER",
  "CONDUCTEUR_REVEAL",
]);

type PaymentTypeEnum =
  | "VIP_FAN"
  | "BOOST"
  | "PRO_PREMIUM_MAQUILLEUSE"
  | "PRO_PREMIUM_COIFFEUR"
  | "PRO_PREMIUM_BARBIER"
  | "PRO_PREMIUM_PHOTOGRAPHE"
  | "PRO_PREMIUM_MERCH"
  | "PRO_PREMIUM_AFTER"
  | "CONDUCTEUR_REVEAL";

function paymentTypeFromMetadata(
  meta: Record<string, string> | undefined,
): PaymentTypeEnum | null {
  const t = meta?.type ?? "";
  if (KNOWN_TYPES.has(t)) return t as PaymentTypeEnum;
  return null;
}

async function activateBoost(meta: Record<string, string>) {
  const targetType = meta.targetType;
  const targetId = meta.targetId;
  if (!targetType || !targetId) return;

  if (targetType === "TRAJET") {
    const r = await prisma.trajet.updateMany({
      where: { id: targetId },
      data: { isBoosted: true, boostUntil: BOOST_END },
    });
    if (r.count === 0) {
      console.warn("[stripe webhook] boost target trajet missing", targetId);
    }
  } else if (targetType === "PRO_PROFILE") {
    const r = await prisma.proProfile.updateMany({
      where: { id: targetId },
      data: { isBoosted: true, boostUntil: BOOST_END },
    });
    if (r.count === 0) {
      console.warn("[stripe webhook] boost target pro missing", targetId);
    }
  }
}

async function revokeBoost(meta: Record<string, string>) {
  const targetType = meta.targetType;
  const targetId = meta.targetId;
  if (!targetType || !targetId) return;
  if (targetType === "TRAJET") {
    await prisma.trajet.updateMany({
      where: { id: targetId },
      data: { isBoosted: false, boostUntil: null },
    });
  } else if (targetType === "PRO_PROFILE") {
    await prisma.proProfile.updateMany({
      where: { id: targetId },
      data: { isBoosted: false, boostUntil: null },
    });
  }
}

async function activateProPremium(userId: string) {
  await prisma.user.updateMany({
    where: { id: userId },
    data: { role: "PRO" },
  });
  await prisma.proProfile.updateMany({
    where: { userId },
    data: { isPremium: true, premiumUntil: PREMIUM_END },
  });
}

async function revokeProPremium(userId: string) {
  await prisma.proProfile.updateMany({
    where: { userId },
    data: { isPremium: false, premiumUntil: null },
  });
}

async function activateVip(userId: string) {
  await prisma.user.updateMany({
    where: { id: userId },
    data: { isVipActive: true, vipUntil: VIP_END },
  });
}

async function revokeVip(userId: string) {
  await prisma.user.updateMany({
    where: { id: userId },
    data: { isVipActive: false, vipUntil: null },
  });
}

async function recordPayment(
  session: Stripe.Checkout.Session,
  userId: string,
  type: PaymentTypeEnum,
  status: "COMPLETED" | "PENDING" | "FAILED",
  meta: Record<string, string>,
) {
  const amountEur = (session.amount_total ?? 0) / 100;
  await prisma.payment.upsert({
    where: { stripeSessionId: session.id },
    update: {
      status,
      stripePaymentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
    create: {
      userId,
      stripeSessionId: session.id,
      stripePaymentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      type,
      amount: amountEur,
      currency: session.currency ?? "eur",
      status,
      metadata: meta,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });
}

async function handleSessionEvent(
  session: Stripe.Checkout.Session,
  outcome: "settled" | "pending" | "failed",
) {
  const meta = (session.metadata ?? {}) as Record<string, string>;
  const userId = meta.userId;
  if (!userId) {
    console.warn(
      "[stripe webhook] session without userId metadata",
      session.id,
    );
    return;
  }
  const type = paymentTypeFromMetadata(meta);
  if (!type) {
    console.warn("[stripe webhook] unknown payment type", meta.type);
    return;
  }

  if (outcome === "failed") {
    await recordPayment(session, userId, type, "FAILED", meta);
    if (type === "VIP_FAN") await revokeVip(userId);
    else if (type.startsWith("PRO_PREMIUM_")) await revokeProPremium(userId);
    else if (type === "BOOST") await revokeBoost(meta);
    return;
  }

  if (outcome === "pending") {
    await recordPayment(session, userId, type, "PENDING", meta);
    return;
  }

  // outcome === "settled" — payment confirmed paid by Stripe
  await recordPayment(session, userId, type, "COMPLETED", meta);
  if (type === "VIP_FAN") await activateVip(userId);
  else if (type.startsWith("PRO_PREMIUM_")) await activateProPremium(userId);
  else if (type === "BOOST") await activateBoost(meta);
}

export async function POST(req: Request) {
  const env = getEnv();
  if (!env.STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 },
    );
  }

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 },
    );
  }

  const stripe = await getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    console.error("[stripe webhook] signature verification failed", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const outcome =
          session.payment_status === "paid" ? "settled" : "pending";
        await handleSessionEvent(session, outcome);
        break;
      }
      case "checkout.session.async_payment_succeeded":
        await handleSessionEvent(
          event.data.object as Stripe.Checkout.Session,
          "settled",
        );
        break;
      case "checkout.session.async_payment_failed":
        await handleSessionEvent(
          event.data.object as Stripe.Checkout.Session,
          "failed",
        );
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler error", event.type, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
