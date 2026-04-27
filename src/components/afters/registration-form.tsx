"use client";

import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  MapPin,
  Ticket,
  Zap,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { createAfterAction } from "@/lib/actions/public";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

const ERROR_LABELS: Record<string, string> = {
  missing: "Tous les champs obligatoires (nom, description, date, lieu, ville, billetterie) doivent être remplis.",
  ticketurl: "Le lien billetterie doit commencer par http:// ou https://",
  date: "La date n'est pas valide.",
};

export function AfterRegistrationForm() {
  const params = useSearchParams();
  const error = params.get("error");
  const published = params.get("published");
  const isPending = params.get("pending") === "1";

  return (
    <div className="relative">
      <div className="absolute -top-40 -right-40 size-[500px] bg-blood/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Status banners */}
      {published === "after" && isPending && (
        <div className="relative mb-8 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5">
          <div className="flex items-start gap-3">
            <Check className="mt-0.5 size-5 shrink-0 text-emerald-300" />
            <div className="space-y-1">
              <p className="font-heading text-paper">After envoyé pour modération</p>
              <p className="text-sm text-paper-dim">
                Merci ! Notre équipe valide ton after dans les heures qui
                viennent. Une fois approuvé, il apparaîtra dans la liste
                publique.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && ERROR_LABELS[error] && (
        <div className="relative mb-8 rounded-2xl border border-blood/40 bg-blood/10 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-blood" />
            <p className="text-sm text-paper">{ERROR_LABELS[error]}</p>
          </div>
        </div>
      )}

      <form
        action={createAfterAction}
        className="relative space-y-12"
      >
        {/* SECTION 1: IDENTITY */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-blood/10 flex items-center justify-center text-blood border border-blood/20">
              <Zap className="size-5" />
            </div>
            <h2 className="font-display text-3xl text-paper uppercase tracking-tight">
              L&apos;Événement
            </h2>
          </div>

          <div className="grid gap-6">
            <FormField
              label="Nom de l'After"
              helperText="Un nom qui claque (ex: Nuit Afro Paris)."
            >
              <Input
                name="name"
                required
                maxLength={100}
                placeholder="Paris Rumba Nights"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>

            <FormField label="Description">
              <textarea
                name="description"
                required
                minLength={20}
                maxLength={2000}
                className="w-full min-h-32 bg-coal border border-white/10 px-4 py-4 rounded-2xl text-paper outline-none focus:ring-1 ring-blood/40 transition-all font-body text-sm"
                placeholder="Décris l'ambiance, le line-up, les DJs, le dress-code…"
              />
            </FormField>
          </div>
        </section>

        {/* SECTION 2: LOGISTICS */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
              <MapPin className="size-5" />
            </div>
            <h2 className="font-display text-3xl text-paper uppercase tracking-tight">
              Où & Quand
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <FormField label="Date" icon={<Calendar className="size-4" />}>
              <Input
                name="date"
                type="date"
                required
                min="2026-04-27"
                max="2026-05-10"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
            <FormField label="Heure de début">
              <Input
                name="heureDepart"
                type="time"
                placeholder="23:30"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
            <FormField label="Lieu / Venue">
              <Input
                name="venue"
                required
                placeholder="Pavillon Baltard, Salon privé…"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
            <FormField label="Ville">
              <Input
                name="city"
                required
                defaultValue="Saint-Denis"
                placeholder="Saint-Denis, Paris 18…"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
            <FormField
              label="Adresse (optionnel)"
              helperText="Adresse exacte si tu veux la rendre publique."
            >
              <Input
                name="address"
                placeholder="12 rue de la République"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
            <FormField
              label="Capacité (optionnel)"
              helperText="Nombre de places maximum."
            >
              <Input
                name="capacity"
                type="number"
                min={0}
                placeholder="300"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
          </div>
        </section>

        {/* SECTION 3: TICKETING */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-ember/10 flex items-center justify-center text-ember border border-ember/20">
              <Ticket className="size-5" />
            </div>
            <h2 className="font-display text-3xl text-paper uppercase tracking-tight">
              Billetterie
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <FormField
              label="Prix à partir de (€)"
              helperText="Prix d'entrée minimum."
            >
              <Input
                name="priceFrom"
                type="number"
                min={0}
                step="0.5"
                required
                placeholder="20"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
            <FormField
              label="Lien Billetterie"
              helperText="Eventbrite, Shotgun, Dice, Weezevent…"
            >
              <Input
                name="ticketUrl"
                type="url"
                required
                placeholder="https://www.eventbrite.com/e/…"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
          </div>
        </section>

        {/* SUBMIT */}
        <div className="pt-10">
          <Button
            type="submit"
            className="w-full h-20 text-2xl shadow-glow-blood bg-blood hover:bg-blood/90 group"
            size="lg"
          >
            Envoyer pour validation{" "}
            <ArrowRight className="ml-3 size-7 transition-transform group-hover:translate-x-3" />
          </Button>
          <p className="mt-6 text-center text-paper-dim text-sm italic">
            Ton after sera vérifié par notre équipe avant d&apos;apparaître
            publiquement. Tu pourras le booster une fois publié.
          </p>
        </div>
      </form>
    </div>
  );
}
