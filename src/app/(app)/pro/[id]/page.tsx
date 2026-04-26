import {
  ArrowLeft,
  AtSign,
  Crown,
  LockKeyhole,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactLock } from "@/components/shared/contact-lock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canSeePrivateProInfo } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db/prisma";
import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";
import { publicProName } from "@/lib/pro-display";

type ProDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProDetailsPage({ params }: ProDetailsPageProps) {
  const { id } = await params;
  const [pro, unlocked] = await Promise.all([
    prisma.proProfile.findUnique({ where: { id } }),
    canSeePrivateProInfo(),
  ]);

  if (!pro) {
    notFound();
  }

  const meta = PRO_CATEGORY_BY_ID[pro.category];
  const cover = pro.photos?.[0];
  const maskedWa = pro.whatsapp.replace(/(\+?\d{2,3})\d+(\d{2})/, "$1******$2");
  const displayedName = publicProName({
    category: pro.category,
    city: pro.city,
    displayName: pro.displayName,
    unlocked,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Button asChild size="sm" variant="ghost">
        <Link href="/prestataires">
          <ArrowLeft aria-hidden /> Retour aux prestataires
        </Link>
      </Button>

      <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-coal/60">
        {cover ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={cover}
            alt={displayedName}
            className="h-72 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 items-center justify-center text-7xl opacity-40">
            {meta?.icon ?? "✨"}
          </div>
        )}

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {meta?.icon} {meta?.label ?? pro.category}
            </Badge>
            {pro.isPremium && (
              <Badge className="border-blood/40 bg-blood/15 text-blood">
                <Sparkles className="h-3 w-3" /> Premium
              </Badge>
            )}
            {pro.isVerified && (
              <Badge className="border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
                ✔ Vérifié
              </Badge>
            )}
          </div>

          <div>
            <h1
              className={`font-display text-4xl uppercase tracking-tight text-paper ${
                unlocked ? "" : "italic text-paper-dim"
              }`}
            >
              {displayedName}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-paper-dim">
              <MapPin className="h-4 w-4" />
              {pro.city}, {pro.country}
            </p>
          </div>

          {pro.bio && (
            <p className="whitespace-pre-line text-paper-dim">{pro.bio}</p>
          )}

          {pro.specialities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pro.specialities.map((s: string) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-paper-dim"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {(pro.rating > 0 || pro.reviewsCount > 0) && (
            <div className="flex items-center gap-2 text-sm text-paper-dim">
              <Star className="h-4 w-4 text-amber-400" />
              {pro.rating.toFixed(1)} ({pro.reviewsCount} avis)
            </div>
          )}

          {pro.priceRange && (
            <p className="text-sm text-paper-dim">
              <span className="font-mono uppercase tracking-widest text-paper-mute">
                Tarifs :
              </span>{" "}
              {pro.priceRange}
            </p>
          )}

          {unlocked && pro.instagramHandle ? (
            <a
              href={`https://instagram.com/${pro.instagramHandle.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-paper-dim hover:text-paper"
            >
              <AtSign className="h-4 w-4" /> @
              {pro.instagramHandle.replace(/^@/, "")}
            </a>
          ) : null}

          {unlocked ? (
            <div className="border-t border-white/10 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                Contact WhatsApp
              </p>
              <div className="mt-2">
                <ContactLock
                  value={maskedWa}
                  rawValue={pro.whatsapp}
                  unlocked
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-vip/30 bg-gradient-to-br from-vip/10 via-coal/40 to-coal/40 p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-vip/15 text-vip">
                  <Crown className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-vip">
                    Pass VIP Famille
                  </p>
                  <p className="mt-1 font-display text-xl uppercase text-paper">
                    Rejoins la Famille — ceux qui savent avant les autres.
                  </p>
                </div>
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-paper-dim sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-vip" />
                  Groupe privé Famille Mboka (annonces &amp; bons plans)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-vip" />
                  Tirage backstage avec l&apos;artiste
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-vip" />
                  Tous les contacts prestas vérifiés
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-vip" />
                  Covoiturages prioritaires
                </li>
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button asChild className="shadow-[var(--glow-red)]">
                  <Link href="/vip">
                    <LockKeyhole aria-hidden className="size-4" />
                    Rejoindre la Famille
                  </Link>
                </Button>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute">
                  Paiement unique · pas d&apos;abonnement
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
