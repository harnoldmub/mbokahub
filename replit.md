# Mboka Hub

A Next.js 15 community platform for the diaspora concert in Paris 2026. It provides services around the Stade de France event: ride-sharing (trajets), beauty professionals, afters/events, merch listings, quizzes, and games.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **Auth**: Clerk (`@clerk/nextjs`)
- **Database**: PostgreSQL via Prisma ORM
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **Email**: Resend
- **Package Manager**: pnpm

## Project Structure

```
src/
  app/
    (app)/        - Main app routes (trajets, beaute, afters, merch, jeu, quiz)
    (auth)/       - Clerk sign-in / sign-up pages
    (dashboard)/  - User and admin dashboards
    (legal)/      - Legal pages (CGU, confidentialite, mentions legales)
    (marketing)/  - Marketing pages (homepage, a-propos, cgv, disclaimer, pro)
    api/          - API routes (checkout, pros, quiz, trajets, webhooks)
  components/     - Shared UI components
  lib/            - Utilities, constants, helpers
  middleware.ts   - Clerk middleware protecting /dashboard and /admin routes
prisma/
  schema.prisma   - Database schema
```

## Environment Variables Required

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` - Clerk auth
- `STRIPE_VIP_PRICE_ID` / `STRIPE_PRO_PRICE_ID` / `STRIPE_BOOST_PRICE_ID` - Stripe price IDs

Optional (recommended):
- `NEXT_PUBLIC_APP_URL` - canonical URL (auto-derived from request `Origin` if absent)
- `STRIPE_VIP_EARLY_BIRD_PRICE_ID` - 7 € price (active until 2026-04-30)
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - explicit LIVE keys for production (overrides connector)
- `STRIPE_WEBHOOK_SECRET` - required for the webhook to verify events
- `CLERK_WEBHOOK_SECRET`, Resend, Supabase, Plausible — only when those features are needed

## Pricing & Stripe

- **VIP Famille**: 10 € flat, Early Bird 7 € until 2026-04-30 (toggle in `src/lib/stripe-config.ts`)
- **Pro**: 20 € flat for all categories (Beauté, Merch, After...)
- **Boost**: 9 € — applied to a TRAJET or PRO_PROFILE via metadata `targetType` + `targetId`
- VIP payment → `User.isVipActive=true`, `vipUntil=2026-05-31`, ContactLock unlocks
- Pro payment → `User.role=PRO` + `ProProfile.isPremium=true`, `premiumUntil=2026-05-31`
- Boost payment → target `isBoosted=true`, `boostUntil=2026-05-31`

### Stripe credentials resolution
`src/lib/stripe.ts` resolves credentials in this order:
1. `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` env vars (for LIVE prod)
2. Replit Stripe connector (sandbox in dev, deployment env in prod)

### Production launch
Run `STRIPE_SECRET_KEY=sk_live_xxx APP_URL=https://mbokahub.com node scripts/setup-stripe-prod.mjs` to bootstrap LIVE products, prices, and webhook endpoint. The script prints all env vars to set in the deployment.

## Checkout endpoints
- `POST /api/checkout/vip` — creates VIP checkout (uses Early Bird price if active)
- `POST /api/checkout/pro` — body `{ category }` (MAQUILLEUSE, COIFFEUR, etc.)
- `POST /api/checkout/boost` — body `{ targetType: "TRAJET" | "PRO_PROFILE", targetId }`
- `POST /api/webhooks/stripe` — Stripe webhook (signature verified)

All checkout endpoints derive `success_url`/`cancel_url` from the request `Origin`, so they work in dev preview, production, and any custom domain without env tweaking.

## Dashboard actions
- `/dashboard/annonces` shows each owned trajet/pro profile with a "Booster 9 €" button (`BoostButton` → `/api/checkout/boost`).
- For pros without `isPremium=true`, an "Activer ma fiche pro 20 €" CTA appears (`PremiumActivateButton` → `/api/checkout/pro`).

## Helpers
- `src/lib/app-url.ts` → `getAppUrl(req?)` — resolves base URL from request origin → env → REPLIT_DOMAINS → localhost.
- `src/lib/auth-helpers.ts` → `getOptionalDbUser()`, `isCurrentUserVip()` — used by detail pages and `ContactLock` for unlock state.

## Replit-Specific Configuration

### Port & Dev Server
- Dev server runs on port **5000** with `0.0.0.0` host binding
- `pnpm run dev` → `next dev -p 5000 -H 0.0.0.0`

### PostCSS / Tailwind v4 Fix
The `postcss.config.mjs` sets `base: "./src"` for `@tailwindcss/postcss` to prevent the pnpm content-addressable store (`/.local/share/pnpm/store`) from being scanned. Without this, webpack's css-loader receives 28,000+ dependency messages pointing into the pnpm store (paths like `./..`) causing a build error.

### Webpack
`next.config.ts` sets `resolve.symlinks = false` and adds Replit dev origins to `allowedDevOrigins` and `images.remotePatterns`.

### Routes
- Duplicate route conflict resolved: removed `(legal)/disclaimer/page.tsx` (kept `(marketing)/disclaimer/page.tsx`)

## Database

Run after environment variables are set:
```bash
pnpm run db:migrate   # Run migrations
pnpm run db:generate  # Regenerate Prisma client
```
