import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { prisma } from "@/lib/db/prisma";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

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

function paymentTypeFromMetadata(meta: Record<string, string> | undefined) {
  const t = meta?.type ?? "";
  if (KNOWN_TYPES.has(t)) {
    return t as
      | "VIP_FAN"
      | "BOOST"
      | "PRO_PREMIUM_MAQUILLEUSE"
      | "PRO_PREMIUM_COIFFEUR"
      | "PRO_PREMIUM_BARBIER"
      | "PRO_PREMIUM_PHOTOGRAPHE"
      | "PRO_PREMIUM_MERCH"
      | "PRO_PREMIUM_AFTER"
      | "CONDUCTEUR_REVEAL";
  }
  return null;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const meta = (session.metadata ?? {}) as Record<string, string>;
  const userId = meta.userId;
  if (!userId) {
    console.warn("[stripe webhook] checkout.session.completed without userId metadata", session.id);
    return;
  }
  const type = paymentTypeFromMetadata(meta);
  if (!type) {
    console.warn("[stripe webhook] unknown payment type", meta.type);
    return;
  }

  const amountEur = (session.amount_total ?? 0) / 100;

  await prisma.payment.upsert({
    where: { stripeSessionId: session.id },
    update: {
      status: "COMPLETED",
      stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
      completedAt: new Date(),
    },
    create: {
      userId,
      stripeSessionId: session.id,
      stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
      type,
      amount: amountEur,
      currency: session.currency ?? "eur",
      status: "COMPLETED",
      metadata: meta,
      completedAt: new Date(),
    },
  });

  if (type === "VIP_FAN") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isVipActive: true,
        vipUntil: new Date("2026-05-31T23:59:59+02:00"),
      },
    });
  } else if (type.startsWith("PRO_PREMIUM_")) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "PRO" },
    });
  }
}

export async function POST(req: Request) {
  const env = getEnv();
  const stripe = getStripe();

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

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
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await prisma.payment.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: "FAILED" },
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler error", event.type, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
