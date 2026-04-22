# Mboka Hub

Marketplace indépendante pour organiser trajets, pros, afters et bons plans autour du concert diaspora Paris 2026.

## Stack

- Next.js 15 App Router
- TypeScript strict
- Tailwind CSS v4
- shadcn/ui
- Clerk
- Stripe Checkout + webhooks
- Prisma
- Supabase Postgres
- Resend + React Email
- Biome
- Playwright

## Development

```bash
corepack pnpm install
corepack pnpm dev
```

## Database

La base Postgres est hébergée sur Supabase.

- `DATABASE_URL` est utilisée par l'application.
- `DIRECT_URL` est utilisée par Prisma Migrate.
- Les caractères spéciaux du mot de passe doivent être encodés dans les URLs.

```bash
corepack pnpm prisma validate
corepack pnpm prisma migrate dev --name init
corepack pnpm prisma generate
```

## Quality

```bash
corepack pnpm lint
corepack pnpm build
```

## Legal Guardrails

Mboka Hub reste une plateforme indépendante de mise en relation. Le nom de l'artiste, l'affiche officielle et toute billetterie interne sont exclus du code, du branding, du SEO et des routes publiques.
