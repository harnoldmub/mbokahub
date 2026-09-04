import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Check, MapPin, Pencil, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminProActionsBar } from "@/components/admin/admin-pro-actions-bar";
import { ProGalleryClient } from "@/components/pros/pro-gallery-client";
import { ProPlaceholderCover } from "@/components/pros/pro-placeholder-cover";
import { ProProfileTabs } from "@/components/pros/pro-profile-tabs";
import { RatingBadge } from "@/components/pros/rating-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isCurrentUserAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db/prisma";
import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";
import { redactContactsInBio } from "@/lib/pro-display";
import { createPageMetadata, getSiteUrl } from "@/lib/seo";

type ProDetailsPageProps = {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const pro = await prisma.proProfile
    .findUnique({
      where: { id },
      select: {
        displayName: true,
        category: true,
        city: true,
        bio: true,
        photos: true,
      },
    })
    .catch(() => null);
  if (!pro) {
    return createPageMetadata({
      title: "Prestataire introuvable",
      description: "Ce profil prestataire n’est pas disponible.",
      path: `/pro/${id}`,
      locale,
      noIndex: true,
    });
  }
  const cat = PRO_CATEGORY_BY_ID[pro.category]?.label ?? "Prestataire";
  const city = pro.city ? ` à ${pro.city}` : "";
  const title = `${pro.displayName} — ${cat}${city}`;
  const description =
    redactContactsInBio(pro.bio)?.slice(0, 160).trim() ||
    `${cat}${city}. Découvrez le profil, les photos et réservez en ligne sur Nevent.`;
  const cover = pro.photos?.[0];
  return createPageMetadata({
    title,
    description,
    path: `/pro/${id}`,
    locale,
    image: cover || undefined,
    imageAlt: `${pro.displayName}, ${cat}${city}`,
    type: "profile",
    keywords: [cat, pro.displayName, pro.city, "prestataire afro"].filter(
      (value): value is string => Boolean(value),
    ),
  });
}

export default async function ProDetailsPage({
  params,
  searchParams,
}: ProDetailsPageProps) {
  const { id, locale } = await params;
  const { from } = await searchParams;
  const { userId: clerkId } = await auth();
  const [pro, isAdmin, dbUser] = await Promise.all([
    prisma.proProfile.findUnique({
      where: { id },
      include: {
        onlineServices: {
          where: { isOnlineBookable: true },
          orderBy: [{ position: "asc" }, { createdAt: "asc" }],
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
  // Fiches antérieures à la règle « pas de coordonnées dans la présentation ».
  const publicBio = redactContactsInBio(pro.bio);
  const meta = PRO_CATEGORY_BY_ID[pro.category];
  const cover = pro.photos?.[0];
  const galleryPhotos = (pro.photos ?? []).slice(1);
  const displayedName = pro.displayName;
  const proJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: pro.displayName,
    description:
      redactContactsInBio(pro.bio) ||
      `${meta?.label ?? "Prestataire"} à ${pro.city}`,
    url: `${getSiteUrl()}/${locale}/pro/${pro.id}`,
    image: pro.photos,
    address: {
      "@type": "PostalAddress",
      addressLocality: pro.city,
      addressCountry: pro.country,
    },
    ...(pro.reviewsCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: pro.rating,
            reviewCount: pro.reviewsCount,
          },
        }
      : {}),
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <script type="application/ld+json">{JSON.stringify(proJsonLd)}</script>
      {/* ── Nav ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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

      {/* ── Admin panel ── */}
      {isAdmin && (
        <section className="mt-6 rounded-2xl border-2 border-amber-500 bg-amber-500 p-4 text-black shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest">
              Mode admin · actions sur cette fiche
            </p>
            <Link
              href={`/dashboard/profil-pro?as=${pro.id}`}
              className="inline-flex items-center rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black/80"
            >
              Gérer ce prestataire (act-as)
            </Link>
          </div>
          <div className="mt-3 rounded-xl bg-black/10 p-3">
            <AdminProActionsBar
              pro={{
                id: pro.id,
                displayName: pro.displayName,
                category: pro.category,
                city: pro.city,
                country: pro.country,
                whatsapp: pro.whatsapp,
                bio: publicBio,
                priceRange: pro.priceRange,
                instagramHandle: pro.instagramHandle,
                tiktokHandle: pro.tiktokHandle,
                specialities: pro.specialities,
                photos: pro.photos,
                isVerified: pro.isVerified,
                isCertified: pro.isCertified,
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

      {/* ── Hero ── */}
      <div className="overflow-hidden rounded-3xl border border-ash bg-white">
        {cover ? (
          <div className="relative h-56 w-full sm:h-72">
            <Image
              alt={displayedName}
              className="object-cover"
              fill
              sizes="(max-width: 672px) 100vw, 672px"
              src={cover}
              unoptimized
            />
          </div>
        ) : (
          <ProPlaceholderCover
            displayName={displayedName}
            category={pro.category}
            className="h-44 w-full sm:h-56"
          />
        )}

        <div className="px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              {meta?.icon && <meta.icon className="size-3.5 text-blood" />}
              {meta?.label ?? pro.category}
            </Badge>
            {pro.isCertified && (
              <Badge className="border-blood/40 bg-blood/10 text-blood gap-1">
                <Sparkles className="h-3 w-3" /> Certifié
              </Badge>
            )}
            {pro.isVerified && (
              <Badge className="border-emerald-400/30 bg-emerald-500/10 text-emerald-400 gap-1">
                <Check className="h-3 w-3 stroke-[2.5]" /> Vérifié
              </Badge>
            )}
          </div>

          <h1 className="mt-3 font-display text-3xl uppercase tracking-tight text-paper sm:text-4xl">
            {displayedName}
          </h1>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-paper-dim">
            <MapPin className="size-3.5 text-blood/80 shrink-0" />
            {pro.city}, {pro.country}
          </p>

          <RatingBadge rating={pro.rating} reviewsCount={pro.reviewsCount} />
        </div>
      </div>

      {/* ── Gallery strip ── */}
      {galleryPhotos.length > 0 && (
        <div className="mt-3">
          <ProGalleryClient
            photos={galleryPhotos}
            altPrefix={displayedName}
            startIndex={2}
          />
        </div>
      )}

      {/* ── Tabs: RDV / Avis / À-propos ── */}
      <div className="mt-4">
        <ProProfileTabs
          proProfileId={pro.id}
          proName={pro.displayName}
          proUserId={pro.userId}
          bio={publicBio}
          instagramHandle={pro.instagramHandle}
          city={pro.city}
          country={pro.country}
          specialities={pro.specialities}
          rating={pro.rating}
          reviewsCount={pro.reviewsCount}
          priceRange={pro.priceRange}
          services={pro.onlineServices.map((s) => ({
            id: s.id,
            name: s.name,
            durationMinutes: s.durationMin,
            price: s.priceCents / 100,
            description: s.description,
          }))}
          availability={[]}
          isSignedIn={!!clerkId}
        />
      </div>
    </main>
  );
}
