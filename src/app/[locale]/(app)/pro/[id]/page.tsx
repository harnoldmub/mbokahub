import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  AtSign,
  Clock,
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

          {/* ── Prestations + réservation ── */}
          <div className="rounded-2xl border border-ash overflow-hidden">
            <div className="px-5 py-4 bg-smoke border-b border-ash flex items-center justify-between gap-3">
              <p className="font-display text-base uppercase text-paper">
                Prestations &amp; réservation
              </p>
              {pro.services.length === 0 && (
                <BookingModal
                  proProfileId={pro.id}
                  proName={pro.displayName}
                  services={[]}
                />
              )}
            </div>

            {pro.services.length > 0 ? (
              <>
                <div className="divide-y divide-ash">
                  {pro.services.map((svc) => (
                    <div
                      key={svc.id}
                      className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-smoke/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-paper truncate">{svc.name}</p>
                        {svc.description && (
                          <p className="mt-0.5 text-xs text-paper-dim truncate">{svc.description}</p>
                        )}
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-paper-dim">
                          <Clock className="size-3 shrink-0 text-blood" />
                          {svc.durationMinutes < 60
                            ? `${svc.durationMinutes} min`
                            : svc.durationMinutes % 60 === 0
                              ? `${svc.durationMinutes / 60} h`
                              : `${Math.floor(svc.durationMinutes / 60)} h ${svc.durationMinutes % 60}`}
                          {svc.price ? (
                            <span className="ml-2 font-semibold text-paper">{svc.price.toFixed(0)} €</span>
                          ) : null}
                        </p>
                      </div>
                      <BookingModal
                        proProfileId={pro.id}
                        proName={pro.displayName}
                        services={pro.services.map((s) => ({
                          id: s.id,
                          name: s.name,
                          durationMinutes: s.durationMinutes,
                          price: s.price,
                          description: s.description,
                        }))}
                        initialServiceId={svc.id}
                        triggerLabel="Réserver"
                        triggerClassName="shrink-0 inline-flex h-9 items-center gap-1.5 rounded-full border border-blood bg-white px-4 text-sm font-medium text-blood hover:bg-blood hover:text-white transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 border-t border-ash bg-smoke/40 flex items-center justify-between gap-3">
                  <p className="text-xs text-paper-mute">
                    Demande gratuite · confirmation par le prestataire
                  </p>
                  <BookingModal
                    proProfileId={pro.id}
                    proName={pro.displayName}
                    services={pro.services.map((s) => ({
                      id: s.id,
                      name: s.name,
                      durationMinutes: s.durationMinutes,
                      price: s.price,
                      description: s.description,
                    }))}
                    triggerLabel="Voir tous les créneaux"
                    triggerClassName="shrink-0 inline-flex h-9 items-center gap-1.5 rounded-full bg-blood px-4 text-sm font-medium text-white hover:bg-blood-deep transition-colors"
                  />
                </div>
              </>
            ) : (
              <p className="px-5 py-6 text-sm text-paper-dim">
                Envoie une demande de rendez-vous directement au prestataire.
              </p>
            )}
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
