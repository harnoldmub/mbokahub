import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  addTimeOffAction,
  deleteTimeOffAction,
  saveWorkingHoursAction,
} from "@/lib/actions/booking";
import { prisma } from "@/lib/db/prisma";
import { resolveProTarget, withAs } from "@/lib/pro-context";
import { ProfilProTabs } from "../_nav";

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const DOW_INDEX = [1, 2, 3, 4, 5, 6, 0];

function fmtMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default async function HorairesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; as?: string }>;
}) {
  const sp = await searchParams;
  const ctx = await resolveProTarget(sp.as);
  const pro = await prisma.proProfile.findUnique({
    where: { userId: ctx.proUserId },
    include: {
      teamMembers: {
        orderBy: { position: "asc" },
        include: {
          workingHours: true,
          timeOffs: { orderBy: { startsAt: "asc" } },
        },
      },
    },
  });
  if (!pro) {
    return (
      <div className="grid gap-6">
        <p className="text-paper-dim">Crée d&apos;abord ta fiche pro.</p>
        <Button asChild>
          <Link href="/pro/inscrire">Inscrire mon service</Link>
        </Button>
      </div>
    );
  }

  const actingAsHidden = ctx.actingAsProId ? (
    <input type="hidden" name="_actingAs" value={ctx.actingAsProId} />
  ) : null;

  return (
    <div className="grid gap-6">

      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Profil pro
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">
          Horaires &amp; congés
        </h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Saisis tes horaires d&apos;ouverture par jour de la semaine pour
          chaque membre. Les créneaux sont générés automatiquement à partir de
          ces horaires et de la durée de chaque prestation.
        </p>
      </div>

      <ProfilProTabs
        active="/dashboard/profil-pro/horaires"
        actingAs={ctx.actingAsProId}
      />

      {sp.saved ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success text-sm">
          Modifications enregistrées.
        </div>
      ) : null}
      {sp.error ? (
        <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-paper text-sm">
          Vérifie les dates / horaires saisis.
        </div>
      ) : null}

      {pro.teamMembers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-coal p-6 text-paper-dim">
          Ajoute d&apos;abord un membre dans l&apos;onglet{" "}
          <Link
            href={withAs("/dashboard/profil-pro/equipe", ctx.actingAsProId)}
            className="text-blood underline"
          >
            Équipe
          </Link>
          .
        </div>
      ) : null}

      {pro.teamMembers.map((m) => (
        <section
          key={m.id}
          className="grid gap-5 rounded-3xl border border-white/10 bg-coal p-6"
        >
          <div>
            <h2 className="font-display text-xl uppercase text-paper">
              {m.displayName}
            </h2>
            <p className="text-paper-mute text-xs">Horaires hebdomadaires</p>
          </div>
          <form action={saveWorkingHoursAction} className="grid gap-3">
            {actingAsHidden}
            <input type="hidden" name="teamMemberId" value={m.id} />
            <div className="grid gap-2">
              {DOW_INDEX.map((dow, i) => {
                const wh = m.workingHours.find((w) => w.dayOfWeek === dow);
                return (
                  <div
                    key={dow}
                    className="grid grid-cols-[110px_auto_1fr_auto_1fr] items-center gap-3 rounded-xl border border-white/5 bg-smoke/40 p-3"
                  >
                    <span className="text-sm text-paper">{DAYS[i]}</span>
                    <label className="flex items-center gap-2 text-xs text-paper-dim">
                      <input
                        type="checkbox"
                        name={`day_${dow}_open`}
                        defaultChecked={Boolean(wh)}
                        className="size-4"
                      />
                      Ouvert
                    </label>
                    <Input
                      name={`day_${dow}_from`}
                      type="time"
                      defaultValue={wh ? fmtMinutes(wh.openMinute) : "09:00"}
                      className="h-10 bg-coal border-none"
                    />
                    <span className="text-paper-mute text-xs">→</span>
                    <Input
                      name={`day_${dow}_to`}
                      type="time"
                      defaultValue={wh ? fmtMinutes(wh.closeMinute) : "19:00"}
                      className="h-10 bg-coal border-none"
                    />
                  </div>
                );
              })}
            </div>
            <div>
              <Button type="submit">Enregistrer les horaires</Button>
            </div>
          </form>

          <div className="border-t border-white/5 pt-4">
            <h3 className="font-display text-base uppercase text-paper">
              Congés / fermetures
            </h3>
            <form
              action={addTimeOffAction}
              className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto]"
            >
              {actingAsHidden}
              <input type="hidden" name="teamMemberId" value={m.id} />
              <FormField label="Début">
                <Input
                  name="startsAt"
                  type="datetime-local"
                  required
                  className="h-10 bg-smoke border-none"
                />
              </FormField>
              <FormField label="Fin">
                <Input
                  name="endsAt"
                  type="datetime-local"
                  required
                  className="h-10 bg-smoke border-none"
                />
              </FormField>
              <FormField label="Motif (optionnel)">
                <Input
                  name="reason"
                  placeholder="Vacances, formation…"
                  className="h-10 bg-smoke border-none"
                />
              </FormField>
              <div className="flex items-end">
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
            <ul className="mt-4 grid gap-2">
              {m.timeOffs.length === 0 ? (
                <li className="text-paper-mute text-sm">
                  Aucun congé planifié.
                </li>
              ) : (
                m.timeOffs.map((off) => (
                  <li
                    key={off.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-smoke/30 p-3 text-sm text-paper-dim"
                  >
                    <span>
                      {new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(off.startsAt)}{" "}
                      →{" "}
                      {new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(off.endsAt)}
                      {off.reason ? ` · ${off.reason}` : ""}
                    </span>
                    <form action={deleteTimeOffAction}>
                      {actingAsHidden}
                      <input type="hidden" name="id" value={off.id} />
                      <Button size="sm" variant="outline" type="submit">
                        Supprimer
                      </Button>
                    </form>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
