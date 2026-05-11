import { Suspense } from "react";

import { GuaranteeStrip } from "@/components/marketing/guarantee-strip";
import { VipMemberBanner } from "@/components/marketing/vip-member-banner";
import { PrestatairesListClient } from "@/components/pros/prestataires-list-client";
import { prisma } from "@/lib/db/prisma";
import { getLocaleFromSearchParams, nls, type SearchParams } from "@/lib/nls";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Prestataires · Mboka Hub",
  description:
    "Trouve un prestataire de confiance pour ton week-end Stade de France : beauté, événementiel, sécurité, transport, garde d'enfants…",
};

type PrestatairesSearchParams = SearchParams & {
  q?: string | string[];
};

type Props = { searchParams?: Promise<PrestatairesSearchParams> };

export default async function PrestatairesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = getLocaleFromSearchParams(sp);
  const initialSearch = Array.isArray(sp?.q) ? (sp.q[0] ?? "") : (sp?.q ?? "");
  const copy = nls[locale].prestatairesPage;

  // Plateforme 100% gratuite pour les fans : on expose les noms et handles
  // de tous les prestataires. L'ordre d'affichage met en avant les fiches
  // boostées / premium / vérifiées (sponsorisé prêt pour la V2 entreprises).
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
      instagramHandle: true,
      tiktokHandle: true,
    },
    take: 200,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-blood/10 via-transparent to-transparent" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-4 lg:px-8">
        <VipMemberBanner message="Tous les contacts WhatsApp des prestataires sont débloqués." />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
          {copy.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl uppercase tracking-tight text-paper sm:text-4xl lg:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-paper-dim sm:text-base">
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
        <PrestatairesListClient
          pros={pros}
          unlocked
          initialSearch={initialSearch}
        />
      </Suspense>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <GuaranteeStrip />
      </section>
    </main>
  );
}
