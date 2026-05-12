import { CalendarCheck, CalendarDays, Clock, Mail, MessageCircle, Plus, Timer, Trash2, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  createProServiceAction,
  deleteProServiceAction,
  saveProAvailabilityAction,
  updateProBookingStatusAction,
} from "@/lib/actions/public";
import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

const statusLabel = {
  PENDING: "À confirmer",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
} as const;

const statusClass = {
  PENDING: "border-warning/40 bg-warning/10 text-paper",
  CONFIRMED: "border-success/40 bg-success/10 text-success",
  CANCELLED: "border-error/40 bg-error/10 text-error",
  COMPLETED: "border-blood/30 bg-blood/10 text-blood",
} as const;

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 h" },
  { value: 90, label: "1 h 30" },
  { value: 120, label: "2 h" },
  { value: 150, label: "2 h 30" },
  { value: 180, label: "3 h" },
  { value: 240, label: "4 h" },
];

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} h ${m}` : `${h} h`;
}

function formatSlot(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function PlanningPage({
  searchParams,
}: {
  searchParams?: Promise<{ updated?: string; error?: string; serviceSaved?: string; serviceDeleted?: string; serviceError?: string; availSaved?: string }>;
}) {
  const sp = await searchParams;
  const user = await getDashboardUser();
  const pro = await prisma.proProfile.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        orderBy: [{ status: "asc" }, { requestedAt: "asc" }],
      },
      services: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      },
      availability: {
        orderBy: { dayOfWeek: "asc" },
      },
    },
  });

  if (!pro) {
    return (
      <div className="grid gap-6">
        <div>
          <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
            Planning
          </p>
          <h1 className="mt-3 font-heading text-4xl text-paper">
            Active d&apos;abord ta fiche pro
          </h1>
          <p className="mt-3 max-w-2xl text-paper-dim leading-7">
            Les demandes de rendez-vous apparaîtront ici dès que ta fiche est
            publiée.
          </p>
        </div>
        <Button asChild className="w-fit">
          <Link href="/pro/inscrire">Créer ma fiche pro</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Planning
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">
          Demandes de rendez-vous
        </h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Les clients peuvent demander un créneau depuis ta fiche publique. Tu
          confirmes, annules ou marques terminé depuis cet espace.
        </p>
        <div className="mt-5 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-paper-dim max-w-2xl">
          <strong className="text-warning">Règle sur les acomptes :</strong> Si tu demandes un acompte pour valider une réservation, celui-ci ne doit <strong>jamais dépasser 20€</strong>. Le paiement se fait directement avec le client via PayPal, Paylib, etc. Tout abus (acompte abusif, arnaque) entraînera le bannissement de la plateforme.
        </div>
      </div>

      {sp?.updated ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success text-sm">
          Statut mis à jour.
        </div>
      ) : null}
      {sp?.serviceSaved ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success text-sm">
          Prestation enregistrée.
        </div>
      ) : null}
      {sp?.serviceDeleted ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success text-sm">
          Prestation supprimée.
        </div>
      ) : null}
      {sp?.availSaved ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success text-sm">
          Disponibilités enregistrées.
        </div>
      ) : null}
      {sp?.error || sp?.serviceError ? (
        <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-error text-sm">
          Impossible d&apos;effectuer cette action.
        </div>
      ) : null}

      {/* ── Services section ── */}
      <section className="rounded-2xl border border-white/10 bg-coal p-5">
        <div className="flex items-center gap-3 mb-5">
          <Timer className="size-5 text-blood" />
          <div>
            <h2 className="font-display text-xl uppercase text-paper">Mes prestations</h2>
            <p className="text-xs text-paper-dim mt-0.5">
              Définis tes services avec leurs durées. Les clients les verront sur ta fiche publique.
            </p>
          </div>
        </div>

        {pro.services.length > 0 ? (
          <div className="mb-5 grid gap-2">
            {pro.services.map((svc) => (
              <div
                key={svc.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                  svc.isActive
                    ? "border-white/10 bg-white/5"
                    : "border-white/5 bg-white/5 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blood/10 px-2.5 py-0.5 font-mono text-[11px] text-blood">
                    <Clock className="size-3" />
                    {formatDuration(svc.durationMinutes)}
                  </span>
                  <span className="font-medium text-paper">{svc.name}</span>
                  {svc.price ? (
                    <span className="text-paper-dim">{svc.price.toFixed(0)} €</span>
                  ) : null}
                  {!svc.isActive && (
                    <span className="text-[10px] text-paper-mute uppercase tracking-wider">désactivé</span>
                  )}
                </div>
                <form action={deleteProServiceAction}>
                  <input type="hidden" name="id" value={svc.id} />
                  <button
                    type="submit"
                    className="rounded-lg p-1.5 text-paper-mute hover:bg-error/10 hover:text-error transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-5 text-sm text-paper-dim">
            Aucune prestation définie pour le moment.
          </p>
        )}

        <details className="group">
          <summary className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-blood/30 bg-blood/10 px-4 py-2 text-sm text-blood hover:bg-blood/15 transition-colors">
            <Plus className="size-4" />
            Ajouter une prestation
          </summary>

          <form
            action={createProServiceAction}
            className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-smoke p-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <label className="flex flex-col gap-1 text-xs text-paper-dim">
                Nom de la prestation *
                <input
                  name="name"
                  required
                  placeholder="Ex : Balayage, Coupe femme, Maquillage événement…"
                  className="rounded-lg border border-white/10 bg-white px-3 py-2 text-paper text-sm"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-xs text-paper-dim">
              Durée *
              <select
                name="durationMinutes"
                required
                defaultValue=""
                className="rounded-lg border border-white/10 bg-white px-3 py-2 text-paper text-sm"
              >
                <option value="" disabled>— Choisir —</option>
                {DURATION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-paper-dim">
              Tarif (optionnel)
              <input
                name="price"
                type="number"
                min="0"
                step="1"
                placeholder="Ex : 80"
                className="rounded-lg border border-white/10 bg-white px-3 py-2 text-paper text-sm"
              />
            </label>

            <div className="sm:col-span-2">
              <label className="flex flex-col gap-1 text-xs text-paper-dim">
                Description courte (optionnel)
                <input
                  name="description"
                  placeholder="Ex : Inclut shampoing et coiffage final"
                  className="rounded-lg border border-white/10 bg-white px-3 py-2 text-paper text-sm"
                />
              </label>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-full bg-blood px-5 text-sm font-medium text-white hover:bg-blood-deep transition-colors"
              >
                <Plus className="size-4" /> Enregistrer la prestation
              </button>
            </div>
          </form>
        </details>
      </section>

      {/* ── Availability section ── */}
      {(() => {
        const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        type AvailRow = { startTime: string; endTime: string; isActive: boolean };
        const availMap = new Map<number, AvailRow>(pro.availability.map((a) => [a.dayOfWeek, a]));
        const defaultHours: AvailRow = { startTime: "09:00", endTime: "19:00", isActive: false };
        return (
          <section className="rounded-2xl border border-white/10 bg-coal p-5">
            <div className="flex items-center gap-3 mb-5">
              <CalendarDays className="size-5 text-blood" />
              <div>
                <h2 className="font-display text-xl uppercase text-paper">Mes disponibilités</h2>
                <p className="text-xs text-paper-dim mt-0.5">
                  Indique tes jours et horaires de travail. Les créneaux visibles sur ta fiche sont calculés automatiquement.
                </p>
              </div>
            </div>
            <form action={saveProAvailabilityAction} className="grid gap-3">
              {[1, 2, 3, 4, 5, 6, 0].map((dow) => {
                const a = availMap.get(dow) ?? { ...defaultHours };
                return (
                  <div key={dow} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <label className="flex items-center gap-2 text-sm text-paper">
                      <input
                        type="checkbox"
                        name={`avail_active_${dow}`}
                        defaultChecked={a.isActive}
                        className="accent-blood"
                      />
                      {DAY_NAMES[dow]}
                    </label>
                    <label className="flex items-center gap-1 text-xs text-paper-dim">
                      De
                      <input
                        type="time"
                        name={`avail_start_${dow}`}
                        defaultValue={a.startTime}
                        className="rounded-lg border border-white/10 bg-white px-2 py-1 text-xs text-paper"
                      />
                    </label>
                    <label className="flex items-center gap-1 text-xs text-paper-dim">
                      à
                      <input
                        type="time"
                        name={`avail_end_${dow}`}
                        defaultValue={a.endTime}
                        className="rounded-lg border border-white/10 bg-white px-2 py-1 text-xs text-paper"
                      />
                    </label>
                  </div>
                );
              })}
              <button
                type="submit"
                className="mt-1 inline-flex h-9 w-fit items-center gap-2 rounded-full bg-blood px-5 text-sm font-medium text-white hover:bg-blood-deep transition-colors"
              >
                Enregistrer les disponibilités
              </button>
            </form>
          </section>
        );
      })()}

      {/* ── Bookings section ── */}
      <div className="rounded-2xl border border-white/10 bg-coal p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl uppercase text-paper">
              {pro.displayName}
            </h2>
            <p className="mt-1 text-sm text-paper-dim">
              {pro.bookings.length} demande{pro.bookings.length > 1 ? "s" : ""}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/pro/${pro.id}`}>Voir ma fiche publique</Link>
          </Button>
        </div>
      </div>

      {pro.bookings.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-coal p-8 text-center">
          <CalendarCheck className="mx-auto size-8 text-blood" />
          <h2 className="mt-4 font-display text-2xl uppercase text-paper">
            Aucune demande pour le moment
          </h2>
          <p className="mx-auto mt-2 max-w-md text-paper-dim">
            Ajoute une photo principale et partage ta fiche pour recevoir des
            demandes de réservation.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pro.bookings.map((booking) => (
            <article
              className="rounded-2xl border border-white/10 bg-coal p-5"
              key={booking.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs ${statusClass[booking.status]}`}
                  >
                    {statusLabel[booking.status]}
                  </span>
                  <h2 className="mt-3 font-display text-2xl uppercase text-paper">
                    {booking.clientName}
                  </h2>
                  {booking.serviceName ? (
                    <p className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-blood">
                      <Timer className="size-4" />
                      {booking.serviceName}
                      {booking.durationMinutes ? (
                        <span className="text-paper-dim font-normal">
                          · {formatDuration(booking.durationMinutes)}
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                  <p className="mt-1 inline-flex items-center gap-2 text-paper-dim">
                    <Clock className="size-4 text-blood" />
                    {formatSlot(booking.requestedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {booking.status !== "CONFIRMED" ? (
                    <form action={updateProBookingStatusAction}>
                      <input name="bookingId" type="hidden" value={booking.id} />
                      <input name="status" type="hidden" value="CONFIRMED" />
                      <Button size="sm" type="submit">Confirmer</Button>
                    </form>
                  ) : null}
                  {booking.status !== "COMPLETED" ? (
                    <form action={updateProBookingStatusAction}>
                      <input name="bookingId" type="hidden" value={booking.id} />
                      <input name="status" type="hidden" value="COMPLETED" />
                      <Button size="sm" type="submit" variant="outline">Terminer</Button>
                    </form>
                  ) : null}
                  {booking.status !== "CANCELLED" ? (
                    <form action={updateProBookingStatusAction}>
                      <input name="bookingId" type="hidden" value={booking.id} />
                      <input name="status" type="hidden" value="CANCELLED" />
                      <Button size="sm" type="submit" variant="outline">Annuler</Button>
                    </form>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid gap-2 text-sm text-paper-dim">
                <p className="inline-flex items-center gap-2">
                  <MessageCircle className="size-4 text-blood" />
                  {booking.clientPhone}
                </p>
                {booking.clientEmail ? (
                  <p className="inline-flex items-center gap-2">
                    <Mail className="size-4 text-blood" />
                    {booking.clientEmail}
                  </p>
                ) : null}
                {booking.note ? (
                  <p className="mt-2 rounded-xl border border-white/10 bg-smoke p-3 text-paper-dim">
                    <User className="mr-2 inline size-4 text-blood" />
                    {booking.note}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
