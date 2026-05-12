import { CalendarCheck, Clock, Mail, MessageCircle, User } from "lucide-react";
import Link from "next/link";

import { AdminAsProBanner } from "@/components/admin/admin-as-pro-banner";
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
  searchParams?: Promise<{ updated?: string; error?: string; as?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const ctx = await resolveProTarget(sp.as);
  const pro = await prisma.proProfile.findUnique({
    where: { userId: ctx.proUserId },
    include: {
      bookings: {
        orderBy: [{ status: "asc" }, { requestedAt: "asc" }],
        include: {
          service: { select: { name: true, durationMin: true } },
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

  return (
    <div className="grid gap-8">
      {ctx.isAdminActingAs ? (
        <AdminAsProBanner
          proId={pro.id}
          proDisplayName={pro.displayName}
          ownerEmail={ctx.ownerEmail}
        />
      ) : null}

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
          <strong className="text-warning">Règle sur les acomptes :</strong> Si
          tu demandes un acompte pour valider une réservation, celui-ci ne doit{" "}
          <strong>jamais dépasser 20€</strong>. Le paiement se fait directement
          avec le client via PayPal, Paylib, etc. Tout abus (acompte abusif,
          arnaque) entraînera le bannissement de la plateforme.
        </div>
      </div>

      {sp?.updated ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success text-sm">
          Statut mis à jour.
        </div>
      ) : null}
      {sp?.error ? (
        <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-error text-sm">
          Impossible de modifier cette demande.
        </div>
      ) : null}

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
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link
                href={withAs(
                  "/dashboard/profil-pro/prestations",
                  ctx.actingAsProId,
                )}
              >
                Prestations
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link
                href={withAs(
                  "/dashboard/profil-pro/equipe",
                  ctx.actingAsProId,
                )}
              >
                Équipe
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link
                href={withAs(
                  "/dashboard/profil-pro/horaires",
                  ctx.actingAsProId,
                )}
              >
                Horaires
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/pro/${pro.id}`}>Voir la fiche publique</Link>
            </Button>
          </div>
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
                  <p className="mt-1 inline-flex items-center gap-2 text-paper-dim">
                    <Clock className="size-4 text-blood" />
                    {formatSlot(booking.requestedAt)}
                  </p>
                  {booking.service || booking.teamMember ? (
                    <p className="mt-1 text-sm text-paper-dim">
                      {booking.service ? (
                        <span className="text-paper">
                          {booking.service.name}
                          {(() => {
                            const dur =
                              booking.durationMin ??
                              booking.service.durationMin;
                            return dur ? ` · ${dur} min` : "";
                          })()}
                        </span>
                      ) : null}
                      {booking.service && booking.teamMember ? " · " : ""}
                      {booking.teamMember ? (
                        <span>avec {booking.teamMember.displayName}</span>
                      ) : null}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {booking.status !== "CONFIRMED" ? (
                    <form action={updateProBookingStatusAction}>
                      {ctx.actingAsProId ? (
                        <input
                          name="_actingAs"
                          type="hidden"
                          value={ctx.actingAsProId}
                        />
                      ) : null}
                      <input
                        name="bookingId"
                        type="hidden"
                        value={booking.id}
                      />
                      <input name="status" type="hidden" value="CONFIRMED" />
                      <Button size="sm" type="submit">
                        Confirmer
                      </Button>
                    </form>
                  ) : null}
                  {booking.status !== "COMPLETED" ? (
                    <form action={updateProBookingStatusAction}>
                      {ctx.actingAsProId ? (
                        <input
                          name="_actingAs"
                          type="hidden"
                          value={ctx.actingAsProId}
                        />
                      ) : null}
                      <input
                        name="bookingId"
                        type="hidden"
                        value={booking.id}
                      />
                      <input name="status" type="hidden" value="COMPLETED" />
                      <Button size="sm" type="submit" variant="outline">
                        Terminer
                      </Button>
                    </form>
                  ) : null}
                  {booking.status !== "CANCELLED" ? (
                    <form action={updateProBookingStatusAction}>
                      {ctx.actingAsProId ? (
                        <input
                          name="_actingAs"
                          type="hidden"
                          value={ctx.actingAsProId}
                        />
                      ) : null}
                      <input
                        name="bookingId"
                        type="hidden"
                        value={booking.id}
                      />
                      <input name="status" type="hidden" value="CANCELLED" />
                      <Button size="sm" type="submit" variant="outline">
                        Annuler
                      </Button>
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
