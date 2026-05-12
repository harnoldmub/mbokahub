import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  completeProOnboardingAction,
  createServiceOnboardingAction,
  saveWorkingHoursOnboardingAction,
  skipProOnboardingAction,
} from "@/lib/actions/booking";
import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

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

type Step = 1 | 2 | 3;

export default async function OnboardingProBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const sp = await searchParams;
  const user = await getDashboardUser();
  const pro = await prisma.proProfile.findUnique({
    where: { userId: user.id },
    include: {
      services: { orderBy: { order: "asc" } },
      teamMembers: {
        orderBy: { position: "asc" },
        include: { workingHours: true },
      },
    },
  });

  if (!pro) {
    redirect("/pro/inscrire");
  }

  const requested = Number(sp.step);
  const step: Step =
    requested === 1 || requested === 2 || requested === 3
      ? (requested as Step)
      : pro.services.length === 0
        ? 1
        : (pro.teamMembers[0]?.workingHours.length ?? 0) === 0
          ? 2
          : 3;

  const hasService = pro.services.length > 0;
  const firstMember = pro.teamMembers[0] ?? null;
  const hasHours = (firstMember?.workingHours.length ?? 0) > 0;

  return (
    <div className="grid gap-6">
      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Bienvenue
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">
          Configure tes prestations en ligne
        </h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          En 3 étapes, tes clients pourront réserver un créneau directement sur
          ta fiche. Tu peux aussi passer cette étape et la reprendre plus tard.
        </p>
      </div>

      <ol className="grid gap-2 sm:grid-cols-3">
        {[
          { n: 1 as Step, label: "Ajouter une prestation", done: hasService },
          { n: 2 as Step, label: "Définir tes horaires", done: hasHours },
          { n: 3 as Step, label: "Publier", done: false },
        ].map((s) => {
          const isActive = s.n === step;
          return (
            <li
              key={s.n}
              className={`flex items-center gap-3 rounded-2xl border p-4 ${
                isActive
                  ? "border-blood/40 bg-blood/10"
                  : s.done
                    ? "border-success/30 bg-success/5"
                    : "border-white/10 bg-coal"
              }`}
            >
              {s.done ? (
                <CheckCircle2 className="size-5 text-success" />
              ) : (
                <Circle
                  className={`size-5 ${isActive ? "text-blood" : "text-paper-mute"}`}
                />
              )}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                  Étape {s.n}
                </p>
                <p className="text-sm text-paper">{s.label}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {step === 1 ? (
        <form
          action={createServiceOnboardingAction}
          className="grid gap-4 rounded-3xl border border-white/10 bg-coal p-6"
        >
          <h2 className="font-display text-xl uppercase text-paper">
            1. Ajoute ta première prestation
          </h2>
          <p className="text-sm text-paper-dim">
            Tu pourras en ajouter d&apos;autres après. Indique au moins le nom,
            la durée et le prix.
          </p>
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
          <input type="hidden" name="isOnlineBookable" value="on" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="submit"
              variant="outline"
              formAction={skipProOnboardingAction}
              formNoValidate
            >
              Passer cette étape
            </Button>
            <Button type="submit">Étape suivante →</Button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        firstMember ? (
          <form
            action={saveWorkingHoursOnboardingAction}
            className="grid gap-4 rounded-3xl border border-white/10 bg-coal p-6"
          >
            <input
              type="hidden"
              name="teamMemberId"
              value={firstMember.id}
            />
            <h2 className="font-display text-xl uppercase text-paper">
              2. Tes horaires hebdomadaires
            </h2>
            <p className="text-sm text-paper-dim">
              Coche les jours où tu travailles et indique tes horaires. Tu
              pourras ajuster pour chaque membre de ton équipe ensuite.
            </p>
            <div className="grid gap-2">
              {DOW_INDEX.map((dow, i) => {
                const wh = firstMember.workingHours.find(
                  (w) => w.dayOfWeek === dow,
                );
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
                        defaultChecked={wh ? true : dow >= 2 && dow <= 6}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/dashboard/profil-pro/onboarding?step=1"
                className="text-sm text-paper-dim hover:text-paper"
              >
                ← Retour
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  variant="outline"
                  formAction={skipProOnboardingAction}
                  formNoValidate
                >
                  Passer
                </Button>
                <Button type="submit">Étape suivante →</Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-coal p-6 text-paper-dim">
            <p>
              Ajoute d&apos;abord une prestation pour générer un membre par
              défaut.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/dashboard/profil-pro/onboarding?step=1">
                  ← Étape 1
                </Link>
              </Button>
            </div>
          </div>
        )
      ) : null}

      {step === 3 ? (
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-coal p-6">
          <h2 className="font-display text-xl uppercase text-paper">
            3. Publier ta fiche réservable
          </h2>
          <p className="text-sm text-paper-dim leading-6">
            Récap : <strong className="text-paper">{pro.services.length}</strong>{" "}
            prestation(s) configurée(s),{" "}
            <strong className="text-paper">
              {firstMember?.workingHours.length ?? 0}
            </strong>{" "}
            jour(s) d&apos;ouverture sur ton planning. Confirme pour terminer
            l&apos;onboarding — tes clients verront le bouton « Réserver en
            ligne » sur ta fiche publique.
          </p>
          <ul className="grid gap-2 text-sm text-paper-dim">
            <li>
              Tu peux ajouter d&apos;autres prestations dans{" "}
              <Link
                href="/dashboard/profil-pro/prestations"
                className="text-blood underline"
              >
                Prestations
              </Link>
              .
            </li>
            <li>
              Tu peux ajuster les horaires par membre dans{" "}
              <Link
                href="/dashboard/profil-pro/horaires"
                className="text-blood underline"
              >
                Horaires & congés
              </Link>
              .
            </li>
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
            <Link
              href="/dashboard/profil-pro/onboarding?step=2"
              className="text-sm text-paper-dim hover:text-paper"
            >
              ← Retour
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <form action={skipProOnboardingAction}>
                <Button type="submit" variant="outline">
                  Plus tard
                </Button>
              </form>
              <form action={completeProOnboardingAction}>
                <Button type="submit">Publier ma fiche ✓</Button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
