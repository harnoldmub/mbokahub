# Nevent

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
- `STRIPE_PRO_PRICE_ID` / `STRIPE_BOOST_PRICE_ID` - Stripe price IDs (only needed when `PAYMENTS_ENABLED` is true)

Optional (recommended):
- `NEXT_PUBLIC_APP_URL` - canonical URL (auto-derived from request `Origin` if absent)
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - explicit LIVE keys for production (overrides connector)
- `STRIPE_WEBHOOK_SECRET` - required for the webhook to verify events
- `CLERK_WEBHOOK_SECRET`, Resend, Supabase, Plausible — only when those features are needed

## Pricing & Stripe

**Nevent is free for everyone during the launch phase.** `PAYMENTS_ENABLED` is
the single switch: while it is `false`, `/api/checkout/pro` and
`/api/checkout/boost` grant the benefit immediately without charging, and the
dashboard buttons read "gratuitement". Flipping it to `true` re-enables the
paid flows below — nothing else needs changing.

- **VIP Famille**: retired. The contact lock it unlocked no longer exists;
  contacts are public for everyone. `/api/checkout/vip` answers `410 Gone`.
  Users who paid before the switch keep the ⭐ Famille Fondatrice badge for
  life (`isFoundingFamilyMember()`).
- **Pro**: 19,99 € flat for all categories — dormant while `PAYMENTS_ENABLED`
  is false.
- **Boost**: 8,99 € — applied to a TRAJET or PRO_PROFILE via metadata
  `targetType` + `targetId`. Dormant under the same switch.
- Pro payment → `User.role=PRO` + `ProProfile.isPremium=true`
- Boost payment → target `isBoosted=true`

### Stripe credentials resolution
`src/lib/stripe.ts` resolves credentials in this order:
1. `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` env vars (for LIVE prod)
2. Replit Stripe connector (sandbox in dev, deployment env in prod)

### Production launch
Run `STRIPE_SECRET_KEY=sk_live_xxx APP_URL=https://mbokahub.com node scripts/setup-stripe-prod.mjs` to bootstrap LIVE products, prices, and webhook endpoint. The script prints all env vars to set in the deployment.

## Checkout endpoints
- `POST /api/checkout/vip` — retired, answers `410 Gone` (kept to close old clients)
- `POST /api/checkout/pro` — body `{ category }` (MAQUILLEUSE, COIFFEUR, etc.)
- `POST /api/checkout/boost` — body `{ targetType: "TRAJET" | "PRO_PROFILE", targetId }`
- `POST /api/webhooks/stripe` — Stripe webhook (signature verified)

All checkout endpoints derive `success_url`/`cancel_url` from the request `Origin`, so they work in dev preview, production, and any custom domain without env tweaking.

## Dashboard actions
- `/dashboard/annonces` shows each owned trajet/pro profile with a "Mettre en vedette" button (`BoostButton` → `/api/checkout/boost`). The price is only shown when `PAYMENTS_ENABLED` is true.
- For pros without `isPremium=true`, a "Mettre ma fiche en avant" CTA appears (`PremiumActivateButton` → `/api/checkout/pro`), free under the same switch.

## Helpers
- `src/lib/app-url.ts` → `getAppUrl(req?)` — resolves base URL from request origin → env → REPLIT_DOMAINS → localhost.
- `src/lib/auth-helpers.ts` → `getOptionalDbUser()`, `isCurrentUserVip()` — the VIP flag now only drives the historical Famille Fondatrice badge; `ContactLock` no longer locks anything.

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
- `/api/health` returns `{ ok, db, latencyMs }` for uptime monitoring (no auth, no-cache).

### Post-merge setup
`scripts/post-merge.sh` runs automatically after every project task merge: `pnpm install`, `prisma generate`, then `prisma migrate deploy` (skipped if `DATABASE_URL` unset). Configured in `.replit` `[postMerge]`, 180s timeout. Idempotent and non-interactive.

### Booking system (Treatwell-style)
- Schema: `Service`, `TeamMember`, `ServiceMember`, `WorkingHours`, `TimeOff` + `ProBooking` extended with `serviceId?`, `teamMemberId?`, `durationMin?`. Migration `20260512000000_add_booking_slots`.
- Slots calculated on-the-fly via `src/lib/booking-slots.ts` (`computeAvailableSlots` / `isSlotStillAvailable`), 28-day window, 15-minute granularity, no `Slot` table.
- Public flow `/[locale]/pro/[id]`: prestation → membre → grille semaine. Falls back to free-form date/time form when the pro has no online-bookable service or category is `VENDEUR_MERCH` / `BABYSITTER`.
- Dashboard: `/dashboard/profil-pro/{prestations,equipe,horaires}` with shared `ProfilProTabs`.
- Concurrency: `createSlotBookingAction` uses Prisma Serializable transaction with P2034 (40001) retry to prevent double-booking; `updateServiceAction` whitelists submitted `memberId`s against TeamMembers actually owned by the current pro to prevent multi-tenant leak.

### Error & loading boundaries
- `src/app/error.tsx` — friendly error UI for any route failure (with `reset()`).
- `src/app/global-error.tsx` — fallback when even the root layout crashes.
- `src/app/loading.tsx` — spinner shown during route transitions / suspense.

### Security
- `STRIPE_WEBHOOK_SECRET` lives **only** in Replit Secrets. It must NEVER be
  hardcoded in `.replit` `[userenv.shared]` (was previously leaked there in
  commit `d8b566f` — now removed). Rotate the value in the Stripe dashboard
  whenever you suspect it has been exposed.
- Stripe checkout redirects from `boost-button` / `premium-activate-button` are
  validated against an `https://(checkout|billing).stripe.com/` allow-list
  before `window.location.href` (defense in depth against open-redirect).

## Database

Run after environment variables are set:
```bash
pnpm run db:migrate   # Run migrations
pnpm run db:generate  # Regenerate Prisma client
```
