import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { PrestatairesListClient } from "@/components/pros/prestataires-list-client";
import { prisma } from "@/lib/db/prisma";
import type { SearchParams } from "@/lib/nls";
import { redactContactsInBio } from "@/lib/pro-display";
import { createPageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Prestataires afro vérifiés",
    description:
      "Trouve un prestataire de confiance, consulte ses réalisations et demande gratuitement un rendez-vous sur Nevent.",
    path: "/prestataires",
    locale,
    keywords: [
      "prestataire afro",
      "services diaspora",
      "professionnel afro vérifié",
      "réservation prestataire",
    ],
  });
}

type PrestatairesSearchParams = SearchParams & {
  q?: string | string[];
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<PrestatairesSearchParams>;
};

export default async function PrestatairesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const initialSearch = Array.isArray(sp?.q) ? (sp.q[0] ?? "") : (sp?.q ?? "");

  // Plateforme 100% gratuite pour les fans : on expose les noms et handles
  // de tous les prestataires. L'ordre d'affichage met en avant les fiches
  // mises en avant / certifiées / vérifiées.
  const { pros, unavailable } = await prisma.proProfile
    .findMany({
      where: { isVerified: true },
      orderBy: [
        { isBoosted: "desc" },
        { isCertified: "desc" },
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
        isCertified: true,
        isBoosted: true,
        isVerified: true,
        rating: true,
        reviewsCount: true,
        instagramHandle: true,
        tiktokHandle: true,
      },
      take: 200,
    })
    // Les fiches créées avant la règle « pas de coordonnées dans la
    // présentation » en contiennent encore : on les neutralise côté serveur,
    // pour qu'elles n'atteignent même pas le navigateur.
    .then((pros) => ({
      pros: pros.map((pro) => ({ ...pro, bio: redactContactsInBio(pro.bio) })),
      unavailable: false,
    }))
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
