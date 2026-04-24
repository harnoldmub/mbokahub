#!/usr/bin/env node
/**
 * Bootstrap Stripe LIVE products, prices, and webhook for Mboka Hub.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_xxx APP_URL=https://mbokahub.com node scripts/setup-stripe-prod.mjs
 *
 * Idempotent: products are looked up by metadata.type (so you can rename them
 * here without creating duplicates), prices by lookup_key.
 *
 * Outputs the env vars you need to set in your production deployment.
 */

import Stripe from "stripe";

const SECRET = process.env.STRIPE_SECRET_KEY;
const APP_URL = (process.env.APP_URL || "").replace(/\/$/, "");

if (!SECRET || !SECRET.startsWith("sk_")) {
  console.error("ERROR: STRIPE_SECRET_KEY env var must be a valid Stripe secret key (sk_live_... for prod).");
  process.exit(1);
}
if (!APP_URL) {
  console.error("ERROR: APP_URL env var required, e.g. https://mbokahub.com");
  process.exit(1);
}

const isLive = SECRET.startsWith("sk_live_");
const mode = isLive ? "LIVE" : "TEST";
const stripe = new Stripe(SECRET, { apiVersion: "2026-03-25.dahlia" });

console.log(`\n>>> Configuring Stripe (${mode}) for ${APP_URL}\n`);

const PRODUCTS = {
  vip: {
    name: "Mboka Hub — Pass VIP Famille",
    description:
      "Accès VIP fan diaspora pour Fally Ipupa au Stade de France (2-3 mai 2026). Déblocage des contacts covoiturage & prestataires, badge VIP et avantages de la Famille Mboka.",
    statement_descriptor: "MBOKAHUB VIP",
    metadata: { type: "vip", brand: "Mboka Hub" },
  },
  pro: {
    name: "Mboka Hub — Fiche Pro Premium",
    description:
      "Activation de la fiche prestataire Premium sur Mboka Hub : visibilité prioritaire, badge vérifié et accès aux demandes des fans diaspora jusqu'au 31 mai 2026.",
    statement_descriptor: "MBOKAHUB PRO",
    metadata: { type: "pro", brand: "Mboka Hub" },
  },
  boost: {
    name: "Mboka Hub — Boost Vedette",
    description:
      "Mise en avant d'une annonce covoiturage ou d'une fiche prestataire en tête des listes Mboka Hub jusqu'au 31 mai 2026.",
    statement_descriptor: "MBOKAHUB BOOST",
    metadata: { type: "boost", brand: "Mboka Hub" },
  },
};

async function ensureProduct(spec) {
  // Lookup by metadata.type for stability across renames
  const list = await stripe.products.search({
    query: `metadata['type']:'${spec.metadata.type}' AND metadata['brand']:'Mboka Hub'`,
    limit: 1,
  });
  const desired = {
    name: spec.name,
    description: spec.description,
    statement_descriptor: spec.statement_descriptor,
    metadata: spec.metadata,
  };
  if (list.data[0]) {
    const p = list.data[0];
    const updated = await stripe.products.update(p.id, desired);
    console.log(`  ✓ Product updated: ${updated.name} (${updated.id})`);
    return updated;
  }
  const p = await stripe.products.create(desired);
  console.log(`  + Product created: ${p.name} (${p.id})`);
  return p;
}

async function ensurePrice(productId, lookupKey, amountCents, label) {
  const list = await stripe.prices.list({
    lookup_keys: [lookupKey],
    limit: 1,
    active: true,
  });
  if (list.data[0]) {
    console.log(`  ✓ Price exists: ${label} = ${amountCents / 100}€ (${list.data[0].id})`);
    return list.data[0];
  }
  const p = await stripe.prices.create({
    product: productId,
    currency: "eur",
    unit_amount: amountCents,
    lookup_key: lookupKey,
    nickname: label,
  });
  console.log(`  + Price created: ${label} = ${amountCents / 100}€ (${p.id})`);
  return p;
}

async function ensureWebhook(url) {
  const events = [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
  ];
  const all = await stripe.webhookEndpoints.list({ limit: 100 });
  const existing = all.data.find((w) => w.url === url);
  if (existing) {
    console.log(`  ✓ Webhook exists: ${url} (${existing.id})`);
    console.log("     (secret can only be retrieved once at creation; rotate if lost)");
    return { endpoint: existing, secret: null };
  }
  const w = await stripe.webhookEndpoints.create({
    url,
    enabled_events: events,
    description: "Mboka Hub — Production webhook (paiements VIP, Pro, Boost)",
  });
  console.log(`  + Webhook created: ${url} (${w.id})`);
  return { endpoint: w, secret: w.secret };
}

(async () => {
  console.log("--- Products & Prices ---");
  const vipProduct = await ensureProduct(PRODUCTS.vip);
  const vipPrice = await ensurePrice(vipProduct.id, "mbokahub_vip_10", 1000, "Pass VIP Famille");
  const vipEarlyPrice = await ensurePrice(
    vipProduct.id,
    "mbokahub_vip_early_7",
    700,
    "Pass VIP Famille — Early Bird (jusqu'au 30 avril)",
  );

  const proProduct = await ensureProduct(PRODUCTS.pro);
  const proPrice = await ensurePrice(proProduct.id, "mbokahub_pro_20", 2000, "Fiche Pro Premium");

  const boostProduct = await ensureProduct(PRODUCTS.boost);
  const boostPrice = await ensurePrice(boostProduct.id, "mbokahub_boost_9", 900, "Boost Vedette");

  console.log("\n--- Webhook ---");
  const webhookUrl = `${APP_URL}/api/webhooks/stripe`;
  const { secret: webhookSecret } = await ensureWebhook(webhookUrl);

  console.log("\n=================================================================");
  console.log(`✅ Stripe ${mode} ready. Set these as PRODUCTION secrets in Replit:`);
  console.log("=================================================================\n");
  console.log(`STRIPE_VIP_PRICE_ID=${vipPrice.id}`);
  console.log(`STRIPE_VIP_EARLY_BIRD_PRICE_ID=${vipEarlyPrice.id}`);
  console.log(`STRIPE_PRO_PRICE_ID=${proPrice.id}`);
  console.log(`STRIPE_BOOST_PRICE_ID=${boostPrice.id}`);
  if (webhookSecret) {
    console.log(`STRIPE_WEBHOOK_SECRET=${webhookSecret}`);
  } else {
    console.log("STRIPE_WEBHOOK_SECRET=<existing — rotate via Stripe dashboard if you don't have it>");
  }
  if (isLive) {
    console.log(`STRIPE_SECRET_KEY=${SECRET}`);
    console.log("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (from your Stripe dashboard)");
  }
  console.log(
    "\n👉 N'oublie pas dans Stripe Dashboard → Settings → Business :",
  );
  console.log("   • Public business name : Mboka Hub");
  console.log("   • Support email       : admin@mbokahub.com");
  console.log("   • Support URL         : https://mbokahub.com");
  console.log("   • Statement descriptor: MBOKA HUB (sera préfixé aux noms produits)");
  console.log("\nDone.\n");
})().catch((err) => {
  console.error("\nFAILED:", err.message);
  process.exit(1);
});
