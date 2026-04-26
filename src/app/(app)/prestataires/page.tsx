import { Suspense } from "react";

import { GuaranteeStrip } from "@/components/marketing/guarantee-strip";
import { VipMemberBanner } from "@/components/marketing/vip-member-banner";
import { canSeePrivateProInfo } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db/prisma";
import { PrestatairesListClient } from "@/components/pros/prestataires-list-client";
import { maskedProLabel } from "@/lib/pro-display";
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

  const [unlocked, prosRaw] = await Promise.all([
    canSeePrivateProInfo(),
    prisma.proProfile.findMany({
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
    }),
  ]);

  // Server-side masking: never ship the real name / handles to the browser
  // unless the viewer has unlocked access (VIP or admin).
  const pros = prosRaw.map((p) => ({
    ...p,
    displayName: unlocked
      ? p.displayName
      : maskedProLabel(p.category, p.city),
    instagramHandle: unlocked ? p.instagramHandle : null,
    tiktokHandle: unlocked ? p.tiktokHandle : null,
  }));

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
        <PrestatairesListClient pros={pros} unlocked={unlocked} />
      </Suspense>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <GuaranteeStrip />
      </section>
    </main>
  );
}
