import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { EARLY_BIRD_DEADLINE } from "@/lib/stripe-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PRESENCE_TTL_MS = 90_000;

declare global {
  // eslint-disable-next-line no-var
  var __mbokaPresence: Map<string, number> | undefined;
}

function getStore(): Map<string, number> {
  if (!globalThis.__mbokaPresence) {
    globalThis.__mbokaPresence = new Map();
  }
  return globalThis.__mbokaPresence;
}

function sweep(store: Map<string, number>) {
  const cutoff = Date.now() - PRESENCE_TTL_MS;
  for (const [id, ts] of store) {
    if (ts < cutoff) store.delete(id);
  }
}

async function buildPayload(presenceCount: number) {
  const now = Date.now();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const [proSignups24h, newsletter24h, vipPayments7d] = await Promise.all([
    prisma.proProfile.count({ where: { createdAt: { gte: oneDayAgo } } }),
    prisma.newsletterSubscriber.count({ where: { createdAt: { gte: oneDayAgo } } }),
    prisma.payment.count({
      where: {
        type: "VIP_FAN",
        status: "COMPLETED",
        createdAt: { gte: sevenDaysAgo },
      },
    }),
  ]);

  const earlyBirdMs = Math.max(0, EARLY_BIRD_DEADLINE.getTime() - now);

  return {
    presence: presenceCount,
    proSignups24h,
    newsletter24h,
    vipPayments7d,
    earlyBirdMs,
  };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sid = String(body?.sid ?? "").slice(0, 64);
  const store = getStore();

  if (sid) store.set(sid, Date.now());
  sweep(store);

  try {
    const payload = await buildPayload(store.size);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[fomo] POST", e);
    return NextResponse.json(
      { presence: store.size, proSignups24h: 0, newsletter24h: 0, vipPayments7d: 0, earlyBirdMs: 0 },
      { status: 200 },
    );
  }
}

export async function GET() {
  const store = getStore();
  sweep(store);
  try {
    const payload = await buildPayload(store.size);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[fomo] GET", e);
    return NextResponse.json(
      { presence: store.size, proSignups24h: 0, newsletter24h: 0, vipPayments7d: 0, earlyBirdMs: 0 },
      { status: 200 },
    );
  }
}
