import { Suspense } from "react";

import { prisma } from "@/lib/db/prisma";
import { PrestatairesListClient } from "@/components/pros/prestataires-list-client";
import {
  getLocaleFromSearchParams,
  nls,
  type SearchParams,
} from "@/lib/nls";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Prestataires · Mboka Hub",
  description:
    "Trouve un prestataire de confiance pour ton week-end Stade de France : beauté, événementiel, sécurité, transport, garde d'enfants…",
};

type Props = { searchParams?: Promise<SearchParams> };

export default async function PrestatairesPage({ searchParams }: Props) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].prestatairesPage;

  const pros = await prisma.proProfile.findMany({
    where: { isVerified: true },
    orderBy: [
      { isBoosted: "desc" },
      { isPremium: "desc" },
      { rating: "desc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      slug: true,
      displayName: true,
      category: true,
      city: true,
      country: true,
      bio: true,
      photos: true,
      priceRange: true,
      isPremium: true,
      isBoosted: true,
      isVerified: true,
      rating: true,
      reviewsCount: true,
      whatsapp: true,
      instagramHandle: true,
      tiktokHandle: true,
    },
    take: 200,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-blood/10 via-transparent to-transparent" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-12 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase tracking-tight text-paper sm:text-6xl lg:text-7xl">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-paper-dim">
          {copy.subtitle}
        </p>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-6 py-12 text-paper-mute">
            {copy.loading}
          </div>
        }
      >
        <PrestatairesListClient pros={pros} />
      </Suspense>
    </main>
  );
}
