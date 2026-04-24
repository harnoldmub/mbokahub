import { ArrowLeft, AtSign, MapPin, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactLock } from "@/components/shared/contact-lock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";

type ProDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProDetailsPage({ params }: ProDetailsPageProps) {
  const { id } = await params;
  const pro = await prisma.proProfile.findUnique({
    where: { id },
  });

  if (!pro) {
    notFound();
  }

  const meta = PRO_CATEGORY_BY_ID[pro.category];
  const cover = pro.photos?.[0];

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
            alt={pro.displayName}
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
            <h1 className="font-display text-4xl uppercase tracking-tight text-paper">
              {pro.displayName}
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

          {pro.instagramHandle && (
            <a
              href={`https://instagram.com/${pro.instagramHandle.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-paper-dim hover:text-paper"
            >
              <AtSign className="h-4 w-4" /> @
              {pro.instagramHandle.replace(/^@/, "")}
            </a>
          )}

          <div className="border-t border-white/10 pt-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
              Contact WhatsApp
            </p>
            <div className="mt-2">
              <ContactLock value={pro.whatsapp} />
            </div>
            <p className="mt-3 text-xs text-paper-mute">
              Connecte-toi pour révéler le numéro et contacter ce prestataire.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
