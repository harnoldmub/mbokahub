import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { PrestatairesListClient } from "@/components/pros/prestataires-list-client";
import { canSeePrivateProInfo } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db/prisma";
import { maskedProLabel } from "@/lib/pro-display";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  "MAQUILLEUSE",
  "ESTHETICIENNE",
  "PROTHESISTE_ONGLES",
  "TECHNICIENNE_CILS",
] as const;

export default async function MaquilleusesPage() {
  const [unlocked, prosRaw] = await Promise.all([
    canSeePrivateProInfo(),
    prisma.proProfile.findMany({
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
    }),
  ]);

  const pros = prosRaw.map((p) => ({
    ...p,
    displayName: unlocked
      ? p.displayName
      : maskedProLabel(p.category, p.city),
    instagramHandle: unlocked ? p.instagramHandle : null,
    tiktokHandle: unlocked ? p.tiktokHandle : null,
  }));

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
          description="Trouve une maquilleuse, esthéticienne, prothésiste ou technicienne cils dispo pour le jour J. Noms et contacts floutés."
          eyebrow="Maquilleuses & Beauté"
          title="Beauté & Style"
        />

        <div className="mt-14">
          <PrestatairesListClient pros={pros} unlocked={unlocked} />
        </div>
      </div>
    </main>
  );
}
