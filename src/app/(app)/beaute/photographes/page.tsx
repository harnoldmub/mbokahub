import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { PrestatairesListClient } from "@/components/pros/prestataires-list-client";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const CATEGORIES = ["PHOTOGRAPHE", "VIDEASTE"] as const;

export default async function PhotographesPage() {
  const pros = await prisma.proProfile.findMany({
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
  });

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute left-[-10vw] top-[20vh] font-display text-[25vw] text-paper opacity-[0.03] select-none leading-none uppercase">
          CAPTURE
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/beaute"
          className="inline-flex items-center gap-2 font-mono text-[10px] text-paper-mute uppercase tracking-[0.2em] mb-12 hover:text-blood transition-colors"
        >
          <ChevronLeft className="size-3" /> Retour aux prestations
        </Link>
        <SectionHeading
          number="04"
          description="Photographes et vidéastes vérifiés pour capturer le week-end. Noms et contacts WhatsApp visibles, gratuit pour la famille."
          eyebrow="Photographes & Vidéastes"
          title="Capturez l'Instant"
        />
        <div className="mt-14">
          <PrestatairesListClient pros={pros} unlocked />
        </div>
      </div>
    </main>
  );
}
