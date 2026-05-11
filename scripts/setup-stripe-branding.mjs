#!/usr/bin/env node
/**
 * Configure Stripe Checkout branding for Mboka Hub.
 * Uploads the logo and sets brand colors on your Stripe account.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_xxx node scripts/setup-stripe-branding.mjs
 *   STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-branding.mjs
 */

import Stripe from "stripe";
import { createReadStream } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const SECRET = process.env.STRIPE_SECRET_KEY;
if (!SECRET || !SECRET.startsWith("sk_")) {
  console.error("ERROR: STRIPE_SECRET_KEY must be set (sk_live_... or sk_test_...).");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = resolve(__dirname, "../public/logo.png");

const stripe = new Stripe(SECRET, { apiVersion: "2025-03-31.basil" });
const mode = SECRET.startsWith("sk_live_") ? "LIVE" : "TEST";

// Mboka Hub brand palette
const PRIMARY_COLOR = "#E50914";    // rouge sang — boutons, liens
const SECONDARY_COLOR = "#0a0808";  // noir profond — fond checkout

console.log(`\n>>> Stripe Branding setup (${mode})\n`);

async function uploadFile(purpose, label) {
  console.log(`Uploading ${label}…`);
  const file = await stripe.files.create({
    purpose,
    file: createReadStream(LOGO_PATH),
  });
  console.log(`  ✓ ${label} uploaded: ${file.id}`);
  return file;
}

(async () => {
  const logoFile = await uploadFile("business_logo", "logo");
  const iconFile = await uploadFile("business_icon", "icon");

  console.log("Applying branding to account…");
  const account = await stripe.accounts.retrieve();
  await stripe.accounts.update(account.id, {
    settings: {
      branding: {
        logo: logoFile.id,
        icon: iconFile.id,
        primary_color: PRIMARY_COLOR,
        secondary_color: SECONDARY_COLOR,
      },
    },
  });

  console.log(`  ✓ Branding applied (account ${account.id})`);
  console.log(`     Primary   : ${PRIMARY_COLOR}`);
  console.log(`     Secondary : ${SECONDARY_COLOR}`);
  console.log("\n=================================================================");
  console.log(`✅ Stripe Checkout is now branded Mboka Hub (${mode})`);
  console.log("   Verify → https://dashboard.stripe.com/settings/branding");
  console.log("=================================================================\n");
})().catch((err) => {
  console.error("\nFAILED:", err.message);
  if (err.raw) console.error("Stripe error:", JSON.stringify(err.raw, null, 2));
  process.exit(1);
});
