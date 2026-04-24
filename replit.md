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

See `.env.example` for all required variables:

- `NEXT_PUBLIC_APP_URL` - App URL
- `DATABASE_URL` / `DIRECT_URL` - PostgreSQL connection strings
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` / `CLERK_WEBHOOK_SECRET` - Clerk auth
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` - Stripe payments
- `STRIPE_VIP_PRICE_ID` (10 €) / `STRIPE_VIP_EARLY_BIRD_PRICE_ID` (7 € until 2026-04-30, optional) / `STRIPE_PRO_PRICE_ID` (20 €) / `STRIPE_BOOST_PRICE_ID` (9 €) - Stripe price IDs

## Pricing & Stripe

- **VIP Warrior**: 10 € flat, Early Bird 7 € until 2026-04-30 (toggle in `src/lib/stripe-config.ts`)
- **Pro**: 20 € flat for all categories (Beauté, Merch, After...)
- **Boost**: 9 €
- VIP grants `User.isVipActive=true` and `vipUntil=2026-05-31` via Stripe webhook
- Pro purchase grants `User.role=PRO`
- Checkout API routes: `/api/checkout/vip|pro|boost` (POST, requires Clerk auth)
- Webhook: `/api/webhooks/stripe` (signature-verified, handles `checkout.session.completed` + async variants)
- Landing pages: `/vip` (with Early Bird countdown banner), `/pro`, success at `/checkout/success?type=vip|pro|boost`
- Stripe MCP is connected in **test mode** (acct_1P092OHgqcjJnzrU). Live keys (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`) must be added by the user in env vars to enable real checkout.
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` - Email via Resend
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` - Supabase storage
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Analytics

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
