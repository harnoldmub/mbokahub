import { CalendarCheck, Clock, Mail, MessageCircle, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { updateProBookingStatusAction } from "@/lib/actions/public";
import { prisma } from "@/lib/db/prisma";
import { resolveProTarget, withAs } from "@/lib/pro-context";

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

function formatSlot(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function PlanningPage({
  searchParams,
}: {
  searchParams?: Promise<{
    updated?: string;
    error?: string;
    as?: string;
  }>;
}) {
  const sp = (await searchParams) ?? {};
  const ctx = await resolveProTarget(sp.as);

  // Only request scalar fields that exist in the current DB. The schema still
  // declares legacy columns (`serviceName`, `durationMinutes`) and a relation
  // pointing to the dropped `ProService` table, so we explicitly whitelist
  // here to avoid Prisma generating SQL referencing missing columns/tables.
  const pro = await prisma.proProfile.findUnique({
    where: { userId: ctx.proUserId },
    select: {
      id: true,
      displayName: true,
      bookings: {
        orderBy: [{ status: "asc" }, { requestedAt: "asc" }],
        select: {
          id: true,
          clientName: true,
          clientEmail: true,
          clientPhone: true,
          requestedAt: true,
          note: true,
          status: true,
          serviceId: true,
          teamMemberId: true,
          durationMin: true,
          teamMember: { select: { displayName: true } },
        },
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

  // Resolve service names in a second query (the relation is currently
  // misaligned in the schema — see comment above on the bookings select).
  const serviceIds = Array.from(
    new Set(
      pro.bookings
        .map((b) => b.serviceId)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const services =
    serviceIds.length > 0
      ? await prisma.service.findMany({
          where: { id: { in: serviceIds }, proProfileId: pro.id },
          select: { id: true, name: true, durationMin: true },
        })
      : [];
  const serviceById = new Map(services.map((s) => [s.id, s]));

  type Booking = (typeof pro.bookings)[number];
  const now = new Date();
  const pending = pro.bookings
    .filter((b) => b.status === "PENDING")
    .sort((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime());
  const confirmed = pro.bookings
    .filter((b) => b.status === "CONFIRMED" && b.requestedAt >= now)
    .sort((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime());
  const past = pro.bookings
    .filter(
      (b) =>
        b.status === "CANCELLED" ||
        b.status === "COMPLETED" ||
        (b.status === "CONFIRMED" && b.requestedAt < now),
    )
    .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());

  function BookingCard({ booking }: { booking: Booking }) {
    const svc = booking.serviceId ? serviceById.get(booking.serviceId) : null;
    const duration = booking.durationMin ?? svc?.durationMin ?? null;
    return (
      <article className="rounded-2xl border border-white/10 bg-coal overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass[booking.status]}`}
              >
                {statusLabel[booking.status]}
              </span>
              {svc ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-blood/10 px-2.5 py-0.5 text-xs text-blood font-medium">
                  {svc.name}
                  {duration ? ` · ${duration} min` : ""}
                </span>
              ) : duration ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-blood/10 px-2.5 py-0.5 text-xs text-blood font-medium">
                  {duration} min
                </span>
              ) : null}
              {booking.teamMember ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-paper-dim">
                  avec {booking.teamMember.displayName}
                </span>
              ) : null}
            </div>
            <p className="font-display text-xl uppercase text-paper truncate">
              {booking.clientName}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-paper-dim">
              <Clock className="size-4 text-blood shrink-0" />
              {formatSlot(booking.requestedAt)}
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            {booking.status === "PENDING" ? (
              <form action={updateProBookingStatusAction}>
                {ctx.actingAsProId ? (
                  <input
                    name="_actingAs"
                    type="hidden"
                    value={ctx.actingAsProId}
                  />
                ) : null}
                <input name="bookingId" type="hidden" value={booking.id} />
                <input name="status" type="hidden" value="CONFIRMED" />
                <Button size="sm" type="submit" className="w-full">
                  Confirmer
                </Button>
              </form>
            ) : null}
            {booking.status === "CONFIRMED" && booking.requestedAt >= now ? (
              <form action={updateProBookingStatusAction}>
                {ctx.actingAsProId ? (
                  <input
                    name="_actingAs"
                    type="hidden"
                    value={ctx.actingAsProId}
                  />
                ) : null}
                <input name="bookingId" type="hidden" value={booking.id} />
                <input name="status" type="hidden" value="COMPLETED" />
                <Button
                  size="sm"
                  type="submit"
                  variant="outline"
                  className="w-full"
                >
                  Terminer
                </Button>
              </form>
            ) : null}
            {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" ? (
              <form action={updateProBookingStatusAction}>
                {ctx.actingAsProId ? (
                  <input
                    name="_actingAs"
                    type="hidden"
                    value={ctx.actingAsProId}
                  />
                ) : null}
                <input name="bookingId" type="hidden" value={booking.id} />
                <input name="status" type="hidden" value="CANCELLED" />
                <Button
                  size="sm"
                  type="submit"
                  variant="outline"
                  className="w-full text-error hover:text-error"
                >
                  Annuler
                </Button>
              </form>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 bg-white/5 px-5 py-3 text-sm text-paper-dim">
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="size-3.5 text-blood shrink-0" />
            {booking.clientPhone}
          </span>
          {booking.clientEmail && (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5 text-blood shrink-0" />
              {booking.clientEmail}
            </span>
          )}
          {booking.note && (
            <span className="w-full mt-1 flex items-start gap-1.5">
              <User className="size-3.5 text-blood shrink-0 mt-0.5" />
              <span className="italic">{booking.note}</span>
            </span>
          )}
        </div>
      </article>
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
        <div className="mt-5 max-w-2xl rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-paper-dim">
          <strong className="text-warning">Acomptes :</strong> Tu peux exiger un
          acompte pour confirmer une réservation. Celui-ci ne doit{" "}
          <strong>pas dépasser 20 €</strong> et se règle hors plateforme via le
          moyen convenu avec ton client (PayPal, Paylib, virement…). Tout abus
          entraînera le bannissement de la plateforme.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link
              href={withAs(
                "/dashboard/profil-pro/prestations",
                ctx.actingAsProId,
              )}
            >
              Mes prestations
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              href={withAs("/dashboard/profil-pro/equipe", ctx.actingAsProId)}
            >
              Mon équipe
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              href={withAs(
                "/dashboard/profil-pro/horaires",
                ctx.actingAsProId,
              )}
            >
              Horaires & congés
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/pro/${pro.id}`}>Voir ma fiche publique</Link>
          </Button>
        </div>
      </div>

      {sp?.updated ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success text-sm">
          Statut mis à jour.
        </div>
      ) : null}
      {sp?.error ? (
        <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-error text-sm">
          Impossible d&apos;effectuer cette action.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-coal p-5">
        <div>
          <h2 className="font-display text-2xl uppercase text-paper">
            {pro.displayName}
          </h2>
          <p className="mt-1 text-sm text-paper-dim">
            {pending.length > 0 && (
              <span className="text-warning font-medium">
                {pending.length} en attente ·{" "}
              </span>
            )}
            {confirmed.length} confirmé{confirmed.length > 1 ? "s" : ""} à venir
            · {past.length} passé{past.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {pro.bookings.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-coal p-10 text-center">
          <CalendarCheck className="mx-auto size-8 text-blood" />
          <h2 className="mt-4 font-display text-2xl uppercase text-paper">
            Aucune demande pour le moment
          </h2>
          <p className="mx-auto mt-2 max-w-md text-paper-dim">
            Ajoute une photo et partage ta fiche pour recevoir des demandes.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pending.length > 0 && (
            <div className="grid gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-warning flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-warning animate-pulse" />
                À confirmer ({pending.length})
              </p>
              {pending.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          )}
          {confirmed.length > 0 && (
            <div className="grid gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-success">
                Confirmés à venir ({confirmed.length})
              </p>
              {confirmed.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          )}
          {past.length > 0 && (
            <div className="grid gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                Historique ({past.length})
              </p>
              {past.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
