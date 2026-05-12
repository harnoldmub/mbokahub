import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

import { PrestatairesListClient } from "@/components/pros/prestataires-list-client";
import { prisma } from "@/lib/db/prisma";
import type { SearchParams } from "@/lib/nls";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Prestataires · Nevent",
  description:
    "Trouvez un prestataire de confiance, consultez ses médias et demandez un rendez-vous gratuitement.",
};

type PrestatairesSearchParams = SearchParams & {
  q?: string | string[];
};

type Props = { searchParams?: Promise<PrestatairesSearchParams> };

export default async function PrestatairesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const initialSearch = Array.isArray(sp?.q) ? (sp.q[0] ?? "") : (sp?.q ?? "");

  // Plateforme 100% gratuite pour les fans : on expose les noms et handles
  // de tous les prestataires. L'ordre d'affichage met en avant les fiches
  // boostées / premium / vérifiées (sponsorisé prêt pour la V2 entreprises).
  const { pros, unavailable } = await prisma.proProfile
    .findMany({
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
    })
    .then((pros) => ({ pros, unavailable: false }))
    .catch((error) => {
      console.error("[prestataires] database unavailable", error);
      return { pros: [], unavailable: true };
    });

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-14 pb-6 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blood">
          Annuaire gratuit
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-paper sm:text-5xl">
          Trouver un prestataire
        </h1>
        <p className="mt-3 max-w-2xl text-base text-paper-dim">
          Recherchez un service, consultez la galerie, puis demandez un créneau
          sans paywall.
        </p>
        {unavailable ? (
          <div className="mt-6 flex max-w-2xl items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-paper-dim">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
            <p>
              La base de données est temporairement inaccessible. La page reste
              disponible et affichera les prestataires dès que Supabase répond.
            </p>
          </div>
        ) : null}
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-6 py-12 text-paper-mute">
            Chargement des prestataires...
          </div>
        }
      >
        <PrestatairesListClient
          pros={pros}
          unlocked
          initialSearch={initialSearch}
        />
      </Suspense>
    </main>
  );
}
