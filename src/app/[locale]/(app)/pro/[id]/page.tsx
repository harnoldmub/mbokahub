import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  AtSign,
  CalendarCheck,
  Clock,
  MapPin,
  MessageCircle,
  Pencil,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminProActionsBar } from "@/components/admin/admin-pro-actions-bar";
import { BookingWeek } from "@/components/pros/booking-week";
import { ProGalleryClient } from "@/components/pros/pro-gallery-client";
import { ContactLock } from "@/components/shared/contact-lock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createSlotBookingAction } from "@/lib/actions/booking";
import { createProBookingAction } from "@/lib/actions/public";
import { isCurrentUserAdmin } from "@/lib/auth-helpers";
import {
  computeAvailableSlots,
  formatDuration,
  formatPriceCents,
  NON_BOOKABLE_CATEGORIES,
} from "@/lib/booking-slots";
import { prisma } from "@/lib/db/prisma";
import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";

type ProDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    booking?: string;
    from?: string;
    serviceId?: string;
    teamMemberId?: string;
    startsAt?: string;
  }>;
};

export default async function ProDetailsPage({
  params,
  searchParams,
}: ProDetailsPageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const { booking, from, serviceId, teamMemberId, startsAt } = sp;
  const { userId: clerkId } = await auth();
  const [pro, isAdmin, dbUser] = await Promise.all([
    prisma.proProfile.findUnique({
      where: { id },
      include: {
        services: {
          where: { isOnlineBookable: true },
          orderBy: { position: "asc" },
          include: { members: { include: { teamMember: true } } },
        },
        teamMembers: {
          where: { isActive: true },
          orderBy: { position: "asc" },
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
  const meta = PRO_CATEGORY_BY_ID[pro.category];
  const cover = pro.photos?.[0];
  const galleryPhotos = (pro.photos ?? []).slice(1);
  const displayedName = pro.displayName;
  const whatsappDigits = pro.whatsapp.replace(/[^\d]/g, "");
  const bookingMessage = encodeURIComponent(
    `Bonjour ${displayedName}, je viens de Nevent et je veux réserver un créneau.`,
  );

  // Only surface services that actually have at least one active assigned
  // member — otherwise the slot grid would be empty and the user dead-ends.
  const bookableServices = pro.services.filter((s) =>
    s.members.some((sm) => sm.teamMember.isActive),
  );
  const showOnlineBooking =
    !NON_BOOKABLE_CATEGORIES.has(pro.category) &&
    bookableServices.length > 0 &&
    pro.teamMembers.length > 0;

  // Selected service (when client clicked "Choisir")
  const selectedService =
    serviceId && showOnlineBooking
      ? bookableServices.find((s) => s.id === serviceId)
      : null;

  // Compute slots if a service is selected
  let weekData: Awaited<ReturnType<typeof computeAvailableSlots>> | null = null;
  if (selectedService) {
    weekData = await computeAvailableSlots({
      proProfileId: pro.id,
      serviceId: selectedService.id,
    });
  }

  const selectedSlotDate =
    startsAt && !Number.isNaN(new Date(startsAt).getTime())
      ? new Date(startsAt)
      : null;
  const selectedMember =
    teamMemberId && weekData
      ? weekData.members.find((m) => m.id === teamMemberId)
      : null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
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
        </section>
      )}

      {/* HEADER */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-coal/60">
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

        <div className="space-y-5 p-6 sm:p-8">
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

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl uppercase tracking-tight text-paper sm:text-4xl">
                {displayedName}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-paper-dim">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {pro.city}, {pro.country}
                </span>
                {(pro.rating > 0 || pro.reviewsCount > 0) && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400" />
                    {pro.rating.toFixed(1)} ({pro.reviewsCount} avis)
                  </span>
                )}
              </p>
            </div>
            {showOnlineBooking ? (
              <Button asChild>
                <a href="#book">
                  <CalendarCheck className="size-4" /> Prendre RDV
                </a>
              </Button>
            ) : null}
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
        </div>
      </section>

      {/* GALLERY */}
      {galleryPhotos.length > 0 && (
        <section className="mt-8 grid gap-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
            Galerie
          </p>
          <ProGalleryClient
            photos={galleryPhotos}
            altPrefix={displayedName}
            startIndex={2}
          />
        </section>
      )}

      {/* BOOKING SECTION */}
      <section
        id="book"
        className="mt-10 rounded-3xl border border-white/10 bg-coal/60 p-6 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-blood/15 text-blood">
            <CalendarCheck className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl uppercase text-paper">
              Réserver en ligne
            </h2>
            <p className="text-paper-mute text-xs">
              Choisis ta prestation, ton créneau et confirme en 30 secondes.
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-paper-dim">
          <strong className="text-warning">Acomptes :</strong> Un prestataire
          peut demander un acompte ne dépassant <strong>jamais 20€</strong>,
          payable hors plateforme (PayPal/Paylib…).
        </div>

        {booking === "requested" ? (
          <p className="mt-4 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            Demande envoyée. Le prestataire va la confirmer.
          </p>
        ) : null}
        {booking === "taken" ? (
          <p className="mt-4 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-paper">
            Ce créneau vient d&apos;être pris. Choisis-en un autre.
          </p>
        ) : null}
        {booking === "missing" || booking === "date" ? (
          <p className="mt-4 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-paper">
            Vérifie tes informations.
          </p>
        ) : null}

        {!showOnlineBooking ? (
          <LegacyBookingForm
            proId={pro.id}
            displayedName={displayedName}
            whatsappDigits={whatsappDigits}
            bookingMessage={bookingMessage}
          />
        ) : (
          <div className="mt-6 grid gap-6">
            {/* Step 1 — services list */}
            <div className="grid gap-2">
              {bookableServices.map((s) => {
                const isSelected = selectedService?.id === s.id;
                return (
                  <div
                    key={s.id}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-blood/40 bg-blood/5"
                        : "border-white/10 bg-coal hover:border-white/20"
                    }`}
                  >
                    <div>
                      <p className="font-display text-base text-paper">
                        {s.name}
                      </p>
                      <p className="text-paper-mute text-xs">
                        {formatDuration(s.durationMin)} ·{" "}
                        {formatPriceCents(s.priceCents)}
                      </p>
                      {s.description ? (
                        <p className="mt-1 max-w-xl text-paper-dim text-sm">
                          {s.description}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      asChild
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                    >
                      <Link href={`/pro/${pro.id}?serviceId=${s.id}#book`}>
                        {isSelected ? "Sélectionnée" : "Choisir"}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Step 2 — pick member + slot */}
            {selectedService && weekData ? (
              <div className="grid gap-5 rounded-2xl border border-white/10 bg-ink/40 p-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                    Étape 2 — Choisis ton créneau
                  </p>
                  <h3 className="mt-2 font-display text-xl uppercase text-paper">
                    {selectedService.name}
                  </h3>
                  <p className="text-paper-mute text-xs">
                    {formatDuration(selectedService.durationMin)} ·{" "}
                    {formatPriceCents(selectedService.priceCents)}
                  </p>
                </div>

                {weekData.members.length > 1 ? (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute mb-2">
                      Avec qui&nbsp;?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/pro/${pro.id}?serviceId=${selectedService.id}#book`}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          !teamMemberId
                            ? "border-blood/40 bg-blood/15 text-paper"
                            : "border-white/10 bg-coal text-paper-dim hover:bg-smoke"
                        }`}
                      >
                        Sans préférence
                      </Link>
                      {weekData.members.map((m) => (
                        <Link
                          key={m.id}
                          href={`/pro/${pro.id}?serviceId=${selectedService.id}&teamMemberId=${m.id}#book`}
                          className={`rounded-full border px-3 py-1.5 text-sm transition ${
                            teamMemberId === m.id
                              ? "border-blood/40 bg-blood/15 text-paper"
                              : "border-white/10 bg-coal text-paper-dim hover:bg-smoke"
                          }`}
                        >
                          {m.displayName}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                <BookingWeek
                  proId={pro.id}
                  serviceId={selectedService.id}
                  teamMemberId={teamMemberId ?? ""}
                  days={weekData.days.map((d) => ({
                    date: d.date,
                    slots: d.slots.map((s) => ({
                      startsAt: s.startsAt.toISOString(),
                      endsAt: s.endsAt.toISOString(),
                      teamMemberId: s.teamMemberId,
                    })),
                  }))}
                  members={weekData.members.map((m) => ({
                    id: m.id,
                    displayName: m.displayName,
                  }))}
                />

                {selectedSlotDate ? (
                  <form
                    id="booking-form"
                    action={createSlotBookingAction}
                    className="grid gap-3 rounded-2xl border border-blood/30 bg-blood/5 p-4"
                  >
                    <input type="hidden" name="proProfileId" value={pro.id} />
                    <input
                      type="hidden"
                      name="serviceId"
                      value={selectedService.id}
                    />
                    <input
                      type="hidden"
                      name="teamMemberId"
                      value={teamMemberId ?? ""}
                    />
                    <input
                      type="hidden"
                      name="startsAt"
                      value={selectedSlotDate.toISOString()}
                    />
                    <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                      Créneau choisi
                    </p>
                    <p className="font-display text-lg text-paper">
                      {new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "full",
                        timeStyle: "short",
                      }).format(selectedSlotDate)}
                      {selectedMember
                        ? ` · avec ${selectedMember.displayName}`
                        : ""}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className="h-11 rounded-xl border border-white/10 bg-coal px-3 text-sm text-paper outline-none focus:border-blood/40"
                        name="clientName"
                        placeholder="Ton nom"
                        required
                      />
                      <input
                        className="h-11 rounded-xl border border-white/10 bg-coal px-3 text-sm text-paper outline-none focus:border-blood/40"
                        name="clientPhone"
                        placeholder="Téléphone / WhatsApp"
                        required
                      />
                      <input
                        className="h-11 rounded-xl border border-white/10 bg-coal px-3 text-sm text-paper outline-none focus:border-blood/40 sm:col-span-2"
                        name="clientEmail"
                        placeholder="Email optionnel"
                        type="email"
                      />
                    </div>
                    <textarea
                      className="min-h-20 rounded-xl border border-white/10 bg-coal px-3 py-3 text-sm text-paper outline-none focus:border-blood/40"
                      name="note"
                      placeholder="Note (optionnel) : longueur de cheveux, couleur souhaitée…"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="inline-flex items-center gap-2 text-xs text-paper-mute">
                        <Clock className="size-3.5" />
                        Confirmation par le prestataire.
                      </p>
                      <Button type="submit">Confirmer la réservation</Button>
                    </div>
                  </form>
                ) : null}
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
            Contact WhatsApp
          </p>
          <div className="mt-2">
            <ContactLock value={pro.whatsapp} rawValue={pro.whatsapp} />
          </div>
        </div>
      </section>
    </main>
  );
}

function LegacyBookingForm({
  proId,
  displayedName: _displayedName,
  whatsappDigits,
  bookingMessage,
}: {
  proId: string;
  displayedName: string;
  whatsappDigits: string;
  bookingMessage: string;
}) {
  return (
    <form
      action={createProBookingAction}
      className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-ink/40 p-5"
    >
      <input name="proProfileId" type="hidden" value={proId} />
      <p className="text-paper-dim text-sm">
        Ce prestataire n&apos;a pas encore configuré sa réservation par
        créneaux. Envoie-lui une demande libre, il te répondra par WhatsApp.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="h-11 rounded-xl border border-white/10 bg-coal px-3 text-sm text-paper outline-none focus:border-blood/40"
          name="clientName"
          placeholder="Ton nom"
          required
        />
        <input
          className="h-11 rounded-xl border border-white/10 bg-coal px-3 text-sm text-paper outline-none focus:border-blood/40"
          name="clientPhone"
          placeholder="Téléphone / WhatsApp"
          required
        />
        <input
          className="h-11 rounded-xl border border-white/10 bg-coal px-3 text-sm text-paper outline-none focus:border-blood/40"
          name="clientEmail"
          placeholder="Email optionnel"
          type="email"
        />
        <input
          className="h-11 rounded-xl border border-white/10 bg-coal px-3 text-sm text-paper outline-none focus:border-blood/40"
          name="requestedAt"
          required
          type="datetime-local"
        />
      </div>
      <textarea
        className="min-h-20 rounded-xl border border-white/10 bg-coal px-3 py-3 text-sm text-paper outline-none focus:border-blood/40"
        name="note"
        placeholder="Message optionnel"
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <a
            href={`https://wa.me/${whatsappDigits}?text=${bookingMessage}`}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        </Button>
        <Button type="submit">Envoyer la demande</Button>
      </div>
    </form>
  );
}
