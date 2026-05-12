"use client";

import { AtSign, Clock, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { BookingModal, type ProService } from "./booking-modal";
import { ContactProButton } from "./contact-pro-button";

type ProAvailability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type ProProfileTabsProps = {
  proProfileId: string;
  proName: string;
  proUserId: string;
  bio: string | null;
  instagramHandle: string | null;
  city: string;
  country: string;
  specialities: string[];
  rating: number;
  reviewsCount: number;
  priceRange: string | null;
  services: ProService[];
  availability: ProAvailability[];
  isSignedIn: boolean;
};

const FR_DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
const ORDERED_DAYS = [1, 2, 3, 4, 5, 6, 0];

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}` : `${h} h`;
}

export function ProProfileTabs({
  proProfileId,
  proName,
  proUserId,
  bio,
  instagramHandle,
  city,
  country,
  specialities,
  rating,
  reviewsCount,
  priceRange,
  services,
  availability,
  isSignedIn,
}: ProProfileTabsProps) {
  const [tab, setTab] = useState<"rdv" | "avis" | "apropos">("rdv");

  useEffect(() => {
    function onOpenTab(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === "rdv" || detail === "avis" || detail === "apropos") {
        setTab(detail);
        // scroll the tabs into view so the user actually sees the change
        document
          .getElementById("pro-tabs")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    window.addEventListener("pro:open-tab", onOpenTab);
    return () => window.removeEventListener("pro:open-tab", onOpenTab);
  }, []);

  const availMap = Object.fromEntries(availability.map((a) => [a.dayOfWeek, a]));
  const todayDow = new Date().getDay();

  return (
    <div
      id="pro-tabs"
      className="overflow-hidden rounded-3xl border border-ash bg-white scroll-mt-4"
    >
      {/* Tab bar */}
      <div className="flex border-b border-ash">
        {(
          [
            { id: "rdv", label: "Prendre RDV" },
            { id: "avis", label: "Avis" },
            { id: "apropos", label: "À-propos" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 py-3.5 text-[13px] font-semibold tracking-wide transition-colors border-b-2 -mb-px ${
              tab === id
                ? "border-blood text-blood"
                : "border-transparent text-paper-mute hover:text-paper"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Prendre RDV ── */}
      {tab === "rdv" && (
        <div>
          {services.length > 0 ? (
            <>
              <div className="divide-y divide-ash">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-smoke/60 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-paper">{svc.name}</p>
                      {svc.description && (
                        <p className="mt-0.5 text-xs text-paper-dim line-clamp-1">
                          {svc.description}
                        </p>
                      )}
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-paper-dim">
                        <Clock className="size-3 shrink-0 text-blood" />
                        {formatDuration(svc.durationMinutes)}
                        {svc.price != null ? (
                          <span className="ml-2 font-semibold text-paper">
                            {svc.price.toFixed(0)} €
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <BookingModal
                      proProfileId={proProfileId}
                      proName={proName}
                      services={services}
                      initialServiceId={svc.id}
                      triggerLabel="Réserver"
                      triggerClassName="shrink-0 inline-flex h-9 items-center rounded-full border border-blood bg-white px-4 text-sm font-semibold text-blood hover:bg-blood hover:text-white transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="border-t border-ash bg-smoke/40 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-paper-mute">
                  Demande gratuite · confirmation par le prestataire
                </p>
                <BookingModal
                  proProfileId={proProfileId}
                  proName={proName}
                  services={services}
                  triggerLabel="Voir tous les créneaux"
                  triggerClassName="inline-flex h-9 items-center gap-1.5 rounded-full bg-blood px-5 text-sm font-semibold text-white hover:bg-blood-deep transition-colors"
                />
              </div>
            </>
          ) : (
            <div className="px-5 py-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-paper-dim">
                Envoie une demande de rendez-vous directement au prestataire.
              </p>
              <BookingModal
                proProfileId={proProfileId}
                proName={proName}
                services={[]}
                triggerLabel="Demander un RDV"
                triggerClassName="inline-flex h-9 items-center gap-1.5 rounded-full bg-blood px-5 text-sm font-semibold text-white hover:bg-blood-deep transition-colors"
              />
            </div>
          )}

          {/* Contact */}
          <div className="border-t border-ash px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-paper">Contact direct</p>
              <p className="text-xs text-paper-dim">
                Messagerie sécurisée · gratuit pour tous
              </p>
            </div>
            <ContactProButton
              proUserId={proUserId}
              isSignedIn={isSignedIn}
              label="Écrire un message"
            />
          </div>
        </div>
      )}

      {/* ── Tab: Avis ── */}
      {tab === "avis" && (
        <div className="px-5 py-6">
          {(rating > 0 || reviewsCount > 0) && (
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-400/10">
                <Star className="size-6 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-paper leading-none">
                  {rating.toFixed(1)}
                </p>
                <p className="mt-1 text-sm text-paper-dim">{reviewsCount} avis</p>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-ash/40 text-2xl">
              ⭐
            </div>
            <p className="text-sm text-paper-dim">
              Aucun avis pour l&apos;instant.
              <br />
              Sois le premier à réserver et laisser un avis.
            </p>
          </div>
        </div>
      )}

      {/* ── Tab: À-propos ── */}
      {tab === "apropos" && (
        <div className="divide-y divide-ash">
          {bio && (
            <div className="px-5 py-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                Présentation
              </p>
              <p className="text-sm text-paper-dim whitespace-pre-line leading-relaxed">
                {bio}
              </p>
            </div>
          )}

          {specialities.length > 0 && (
            <div className="px-5 py-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                Spécialités
              </p>
              <div className="flex flex-wrap gap-2">
                {specialities.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-ash bg-smoke px-3 py-1 text-xs text-paper-dim"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="px-5 py-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
              Disponibilités
            </p>
            {availability.length === 0 ? (
              <p className="text-sm text-paper-dim leading-relaxed">
                Ce prestataire gère ses disponibilités au cas par cas.{" "}
                <span className="text-paper-mute">
                  Envoie une demande ou un message pour convenir d&apos;un créneau.
                </span>
              </p>
            ) : (
            <table className="w-full text-sm">
              <tbody>
                {ORDERED_DAYS.map((dow) => {
                  const avail = availMap[dow];
                  if (!avail) return null;
                  const isToday = dow === todayDow;
                  const timeRange = avail.isActive
                    ? `${avail.startTime} – ${avail.endTime}`
                    : null;

                  return (
                    <tr
                      key={dow}
                      className={
                        isToday
                          ? "font-semibold text-paper"
                          : "text-paper-dim"
                      }
                    >
                      <td className="w-32 py-1.5">{FR_DAYS[dow]}</td>
                      <td className="py-1.5">
                        {timeRange ? (
                          <span
                            className={
                              isToday ? "text-blood" : "text-paper-dim"
                            }
                          >
                            {timeRange}
                          </span>
                        ) : (
                          <span className="text-paper-mute">Fermé</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            )}
          </div>

          <div className="px-5 py-4">
            <div className="flex items-center gap-2 text-sm text-paper-dim">
              <MapPin className="size-4 shrink-0" />
              {city}, {country}
            </div>
          </div>

          {instagramHandle && (
            <div className="px-5 py-4">
              <a
                href={`https://instagram.com/${instagramHandle.replace(/^@/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-paper-dim hover:text-paper transition-colors"
              >
                <AtSign className="size-4" />@
                {instagramHandle.replace(/^@/, "")}
              </a>
            </div>
          )}

          {priceRange && (
            <div className="px-5 py-4">
              <p className="text-sm text-paper-dim">
                <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                  Tarifs{" "}
                </span>
                {priceRange}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
