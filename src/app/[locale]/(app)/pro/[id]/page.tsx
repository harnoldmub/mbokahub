import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  AtSign,
  MapPin,
  Pencil,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminProActionsBar } from "@/components/admin/admin-pro-actions-bar";
import { BookingModal } from "@/components/pros/booking-modal";
import { ContactProButton } from "@/components/pros/contact-pro-button";
import { ProGalleryClient } from "@/components/pros/pro-gallery-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isCurrentUserAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db/prisma";
import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";

type ProDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function ProDetailsPage({
  params,
  searchParams,
}: ProDetailsPageProps) {
  const { id } = await params;
  const { from } = await searchParams;
  const { userId: clerkId } = await auth();
  const [pro, isAdmin, dbUser] = await Promise.all([
    prisma.proProfile.findUnique({
      where: { id },
      include: {
        services: {
          where: { isActive: true },
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        },
      },
    }),
    isCurrentUserAdmin(),
    clerkId
      ? prisma.user.findUnique({
          where: { clerkId },
          select: { id: true },
        })
      : null,
  ]);

  if (!pro) {
    notFound();
  }

  const isOwner = dbUser !== null && dbUser.id === pro.userId;
  // Plateforme 100% gratuite pour les fans : la fiche est toujours ouverte.
  const meta = PRO_CATEGORY_BY_ID[pro.category];
  const cover = pro.photos?.[0];
  const galleryPhotos = (pro.photos ?? []).slice(1);
  const displayedName = pro.displayName;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild size="sm" variant="ghost">
          <Link
            href={isAdmin && from === "admin" ? "/admin/pros" : "/prestataires"}
          >
            <ArrowLeft aria-hidden />
            {isAdmin && from === "admin"
              ? "Retour à l'admin"
              : "Retour aux prestataires"}
          </Link>
        </Button>
        {isOwner && !isAdmin && (
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/profil-pro">
              <Pencil aria-hidden /> Modifier ma fiche
            </Link>
          </Button>
        )}
      </div>

      {isAdmin && (
        <section className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
            Actions admin
          </p>
          <p className="mt-1 text-sm text-paper-dim">
            Modifier, valider, certifier ou supprimer ce profil. Chaque action
            demande une confirmation.
          </p>
          <div className="mt-3">
            <AdminProActionsBar
              pro={{
                id: pro.id,
                displayName: pro.displayName,
                category: pro.category,
                city: pro.city,
                country: pro.country,
                whatsapp: pro.whatsapp,
                bio: pro.bio,
                priceRange: pro.priceRange,
                instagramHandle: pro.instagramHandle,
                tiktokHandle: pro.tiktokHandle,
                specialities: pro.specialities,
                photos: pro.photos,
                isVerified: pro.isVerified,
                isPremium: pro.isPremium,
              }}
            />
          </div>
          {isOwner && (
            <div className="mt-3">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/profil-pro">
                  <Pencil aria-hidden /> Modifier ma fiche (vue propriétaire)
                </Link>
              </Button>
            </div>
          )}
        </section>
      )}

      <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-coal/60">
        {cover ? (
          <div className="relative h-72 w-full">
            <Image
              alt={displayedName}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              src={cover}
              unoptimized
            />
          </div>
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

          {galleryPhotos.length > 0 && (
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                Galerie
              </p>
              <ProGalleryClient
                photos={galleryPhotos}
                altPrefix={displayedName}
                startIndex={2}
              />
            </div>
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

          {pro.instagramHandle ? (
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

          <div className="rounded-2xl border border-blood/20 bg-blood/10 p-5">
            <p className="font-display text-xl uppercase text-paper mb-1">
              Réserver un créneau
            </p>
            <p className="text-sm text-paper-dim mb-4">
              Choisis ta prestation et un créneau disponible directement en ligne.
            </p>
            <BookingModal
              proProfileId={pro.id}
              proName={pro.displayName}
              services={pro.services.map((s) => ({
                id: s.id,
                name: s.name,
                durationMinutes: s.durationMinutes,
                price: s.price,
              }))}
            />
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
              Contact direct
            </p>
            <div className="mt-3">
              <ContactProButton
                proUserId={pro.userId}
                isSignedIn={!!clerkId}
                label="Écrire un message"
              />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
              Messagerie sécurisée · gratuit pour tous
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
