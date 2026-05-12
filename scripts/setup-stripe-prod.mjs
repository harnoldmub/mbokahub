#!/usr/bin/env node
/**
 * Bootstrap Stripe LIVE products, prices, and webhook for Nevent.
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
  console.error(
    "ERROR: STRIPE_SECRET_KEY env var must be a valid Stripe secret key (sk_live_... for prod).",
  );
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

const LOGO_URL = `${APP_URL}/logo.png`;

const PRODUCTS = {
  pro: {
    name: "Placement Pro Premium Nevent",
    description:
      "Option payante de visibilité pour prestataires : mise en avant, badge sponsorisé et statistiques. L'inscription pro reste gratuite.",
    statement_descriptor: "NEVENT PRO",
    images: [LOGO_URL],
    metadata: { type: "pro", brand: "Nevent" },
  },
  boost: {
    name: "Boost de visibilité",
    description:
      "Mise en avant prioritaire d'un trajet ou d'un profil pro pendant 7 jours.",
    statement_descriptor: "NEVENT BOOST",
    images: [LOGO_URL],
    metadata: { type: "boost", brand: "Nevent" },
  },
};

async function ensureProduct(spec) {
  // Lookup by metadata.type for stability across renames
  const list = await stripe.products.search({
    query: `metadata['type']:'${spec.metadata.type}' AND metadata['brand']:'Nevent'`,
    limit: 1,
  });
  const desired = {
    name: spec.name,
    description: spec.description,
    statement_descriptor: spec.statement_descriptor,
    images: spec.images,
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
    console.log(
      `  ✓ Price exists: ${label} = ${amountCents / 100}€ (${list.data[0].id})`,
    );
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
    console.log(
      "     (secret can only be retrieved once at creation; rotate if lost)",
    );
    return { endpoint: existing, secret: null };
  }
  const w = await stripe.webhookEndpoints.create({
    url,
    enabled_events: events,
    description:
      "Nevent — Production webhook (paiements Pro Premium, Boost)",
  });
  console.log(`  + Webhook created: ${url} (${w.id})`);
  return { endpoint: w, secret: w.secret };
}

(async () => {
  console.log("--- Products & Prices ---");
  const proProduct = await ensureProduct(PRODUCTS.pro);
  const proPrice = await ensurePrice(
    proProduct.id,
    "nevent_pro_1999",
    1999,
    "Placement Pro Premium",
  );

  const boostProduct = await ensureProduct(PRODUCTS.boost);
  const boostPrice = await ensurePrice(
    boostProduct.id,
    "nevent_boost_899",
    899,
    "Boost Vedette",
  );

  console.log("\n--- Webhook ---");
  const webhookUrl = `${APP_URL}/api/webhooks/stripe`;
  const { secret: webhookSecret } = await ensureWebhook(webhookUrl);

  console.log(
    "\n=================================================================",
  );
  console.log(
    `✅ Stripe ${mode} ready. Set these as PRODUCTION secrets in Replit:`,
  );
  console.log(
    "=================================================================\n",
  );
  console.log(`STRIPE_PRO_PRICE_ID=${proPrice.id}`);
  console.log(`STRIPE_BOOST_PRICE_ID=${boostPrice.id}`);
  if (webhookSecret) {
    console.log(`STRIPE_WEBHOOK_SECRET=${webhookSecret}`);
  } else {
    console.log(
      "STRIPE_WEBHOOK_SECRET=<existing — rotate via Stripe dashboard if you don't have it>",
    );
  }
  if (isLive) {
    console.log(
      "STRIPE_SECRET_KEY=<keep your existing sk_live_... secret — never print it>",
    );
    console.log(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (from your Stripe dashboard)",
    );
  }
  console.log(
    "\n👉 N'oublie pas dans Stripe Dashboard → Settings → Business :",
  );
  console.log("   • Public business name : Nevent");
  console.log("   • Support email       : admin@mbokahub.com");
  console.log("   • Support URL         : https://mbokahub.com");
  console.log(
    "   • Statement descriptor: NEVENT (sera préfixé aux noms produits)",
  );
  console.log("\nDone.\n");
})().catch((err) => {
  console.error("\nFAILED:", err.message);
  process.exit(1);
});
