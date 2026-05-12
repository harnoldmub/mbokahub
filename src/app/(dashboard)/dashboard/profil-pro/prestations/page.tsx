import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
} from "@/lib/actions/booking";
import { formatPriceCents } from "@/lib/booking-slots";
import { prisma } from "@/lib/db/prisma";
import { resolveProTarget } from "@/lib/pro-context";
import { ProfilProTabs } from "../_nav";

export default async function PrestationsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; as?: string }>;
}) {
  const sp = await searchParams;
  const ctx = await resolveProTarget(sp.as);
  const pro = await prisma.proProfile.findUnique({
    where: { userId: ctx.proUserId },
    include: {
      onlineServices: {
        orderBy: { position: "asc" },
        include: { members: true },
      },
      teamMembers: { orderBy: { position: "asc" } },
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

  return (
    <div className="grid gap-6">
      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Profil pro
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">Prestations</h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Tes prestations apparaissent dans la section &laquo; Réserver en ligne
          &raquo; de ta fiche publique. Active &laquo; Réservable en ligne
          &raquo; pour que les clients puissent choisir un créneau directement.
        </p>
      </div>

      <ProfilProTabs
        active="/dashboard/profil-pro/prestations"
        actingAs={ctx.actingAsProId}
      />

      {sp.saved ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success text-sm">
          Modifications enregistrées.
        </div>
      ) : null}
      {sp.error ? (
        <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-paper text-sm">
          Vérifie les champs : nom, durée et prix sont obligatoires.
        </div>
      ) : null}

      <form
        action={createServiceAction}
        className="grid gap-4 rounded-3xl border border-white/10 bg-coal p-6"
      >
        {ctx.actingAsProId ? (
          <input type="hidden" name="_actingAs" value={ctx.actingAsProId} />
        ) : null}
        <h2 className="font-display text-xl uppercase text-paper">
          Ajouter une prestation
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Nom">
            <Input
              name="name"
              required
              placeholder="Pose américaine, brushing, makeup glam…"
              className="h-11 bg-smoke border-none"
            />
          </FormField>
          <FormField label="Durée (minutes)">
            <Input
              name="durationMin"
              type="number"
              min={15}
              step={15}
              defaultValue={60}
              required
              className="h-11 bg-smoke border-none"
            />
          </FormField>
          <FormField label="Prix (€)">
            <Input
              name="priceEuros"
              type="number"
              min={0}
              step={1}
              defaultValue={50}
              required
              className="h-11 bg-smoke border-none"
            />
          </FormField>
        </div>
        <FormField label="Description (optionnel)">
          <textarea
            name="description"
            rows={2}
            placeholder="Ce que comprend la prestation…"
            className="w-full rounded-md bg-smoke px-4 py-3 text-paper text-sm placeholder:text-paper-dim focus:outline-none"
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-paper-dim">
          <input
            type="checkbox"
            name="isOnlineBookable"
            defaultChecked
            className="size-4"
          />
          Réservable en ligne
        </label>
        <div>
          <Button type="submit">Ajouter</Button>
        </div>
      </form>

      <div className="grid gap-4">
        {pro.onlineServices.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-coal p-6 text-center text-paper-dim">
            Aucune prestation pour l&apos;instant. Ajoute ta première prestation
            ci-dessus.
          </p>
        ) : (
          pro.onlineServices.map((s) => (
            <form
              action={updateServiceAction}
              key={s.id}
              className="grid gap-4 rounded-3xl border border-white/10 bg-coal p-5"
            >
              {ctx.actingAsProId ? (
                <input
                  type="hidden"
                  name="_actingAs"
                  value={ctx.actingAsProId}
                />
              ) : null}
              <input type="hidden" name="id" value={s.id} />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-paper">{s.name}</p>
                  <p className="text-paper-mute text-xs">
                    {s.durationMin} min · {formatPriceCents(s.priceCents)}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${
                    s.isOnlineBookable
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-white/15 bg-white/5 text-paper-dim"
                  }`}
                >
                  {s.isOnlineBookable ? "En ligne" : "Hors ligne"}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <FormField label="Nom">
                  <Input
                    name="name"
                    required
                    defaultValue={s.name}
                    className="h-11 bg-smoke border-none"
                  />
                </FormField>
                <FormField label="Durée (min)">
                  <Input
                    name="durationMin"
                    type="number"
                    min={15}
                    step={15}
                    required
                    defaultValue={s.durationMin}
                    className="h-11 bg-smoke border-none"
                  />
                </FormField>
                <FormField label="Prix (€)">
                  <Input
                    name="priceEuros"
                    type="number"
                    min={0}
                    step={1}
                    required
                    defaultValue={(s.priceCents / 100).toString()}
                    className="h-11 bg-smoke border-none"
                  />
                </FormField>
              </div>
              <FormField label="Description">
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={s.description ?? ""}
                  className="w-full rounded-md bg-smoke px-4 py-3 text-paper text-sm focus:outline-none"
                />
              </FormField>
              <label className="flex items-center gap-2 text-sm text-paper-dim">
                <input
                  type="checkbox"
                  name="isOnlineBookable"
                  defaultChecked={s.isOnlineBookable}
                  className="size-4"
                />
                Réservable en ligne
              </label>
              {pro.teamMembers.length > 0 ? (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute mb-2">
                    Réalisée par
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pro.teamMembers.map((m) => {
                      const checked = s.members.some(
                        (sm) => sm.teamMemberId === m.id,
                      );
                      return (
                        <label
                          key={m.id}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-smoke px-3 py-1.5 text-xs text-paper"
                        >
                          <input
                            type="checkbox"
                            name="memberIds"
                            value={m.id}
                            defaultChecked={checked}
                            className="size-3.5"
                          />
                          {m.displayName}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button type="submit">Enregistrer</Button>
                <Button
                  formAction={deleteServiceAction}
                  variant="outline"
                  type="submit"
                >
                  Supprimer
                </Button>
              </div>
            </form>
          ))
        )}
      </div>
    </div>
  );
}
