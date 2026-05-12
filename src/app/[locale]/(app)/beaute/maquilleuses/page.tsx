import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { PrestatairesListClient } from "@/components/pros/prestataires-list-client";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Maquilleuses afro pro — Réservation en ligne",
  description:
    "Maquilleuses, esthéticiennes, prothésistes ongles et techniciennes cils spécialisées peaux noires et métissées. Réservation directe sur Nevent.",
  alternates: { canonical: "/beaute/maquilleuses" },
};

const CATEGORIES = [
  "MAQUILLEUSE",
  "ESTHETICIENNE",
  "PROTHESISTE_ONGLES",
  "TECHNICIENNE_CILS",
] as const;

export default async function MaquilleusesPage() {
  const pros = await prisma.proProfile
    .findMany({
      where: {
        isVerified: true,
        category: { in: [...CATEGORIES] },
      },
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
    .catch((err) => {
      console.error("[beaute/maquilleuses] database unavailable", err);
      return [];
    });

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute left-[-10vw] top-[20vh] font-display text-[25vw] text-blood opacity-[0.03] select-none leading-none uppercase">
          GLOW
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          className="mb-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute transition-colors hover:text-blood"
          href="/beaute"
        >
          <ChevronLeft className="size-3" />
          Retour aux prestations
        </Link>

        <SectionHeading
          number="02"
          description="Trouve une maquilleuse, esthéticienne, prothésiste ou technicienne cils dispo pour le jour J. Profils vérifiés, messagerie intégrée, gratuit pour la famille."
          eyebrow="Maquilleuses & Beauté"
          title="Beauté & Style"
        />

        <div className="mt-14">
          <PrestatairesListClient pros={pros} unlocked />
        </div>
      </div>
    </main>
  );
}
