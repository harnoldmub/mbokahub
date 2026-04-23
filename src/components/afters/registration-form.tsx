"use client";

import { ArrowRight, Calendar, MapPin, Ticket, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PhotoUpload } from "@/components/ui/photo-upload";

export function AfterRegistrationForm() {
  return (
    <div className="relative">
      <div className="absolute -top-40 -right-40 size-[500px] bg-blood/10 blur-[120px] rounded-full pointer-events-none" />

      <form className="relative space-y-12">
        {/* SECTION 1: IDENTITY */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-blood/10 flex items-center justify-center text-blood border border-blood/20">
              <Zap className="size-5" />
            </div>
            <h2 className="font-display text-3xl text-paper uppercase tracking-tight">
              L'Événement
            </h2>
          </div>

          <div className="grid gap-6">
            <FormField
              label="Nom de l'After"
              helperText="Un nom qui claque (ex: Nuit Afro Paris)."
            >
              <Input
                placeholder="Paris Rumba Nights"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>

            <FormField label="Description">
              <textarea
                className="w-full min-h-32 bg-coal border border-white/10 px-4 py-4 rounded-2xl text-paper outline-none focus:ring-1 ring-blood/40 transition-all font-body text-sm"
                placeholder="Décris l'ambiance, le line-up, l'ambiance..."
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
              <Input type="date" className="h-14 bg-coal border-white/10" />
            </FormField>
            <FormField label="Heure de début">
              <Input
                type="time"
                placeholder="23:30"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
            <FormField label="Lieu / Venue">
              <Input
                placeholder="Pavillon Baltard, Salon privé..."
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
            <FormField label="Ville">
              <Input
                placeholder="Saint-Denis, Paris 18..."
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
              label="Prix à partir de"
              helperText="Prix d'entrée minimum."
            >
              <Input
                type="number"
                placeholder="20"
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
            <FormField
              label="Lien Billetterie"
              helperText="Lien Eventbrite, Shotgun, Dice..."
            >
              <Input
                placeholder="https://..."
                className="h-14 bg-coal border-white/10"
              />
            </FormField>
          </div>
        </section>

        {/* SECTION 4: VISUAL */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-3xl text-paper uppercase tracking-tight">
              Le Flyer
            </h2>
          </div>
          <PhotoUpload label="Charger l'affiche de l'événement" />
          <p className="text-paper-mute text-xs font-mono uppercase tracking-widest text-center mt-4">
            Format recommandé : 4:5 ou Carré
          </p>
        </section>

        <div className="pt-10">
          <Button
            className="w-full h-20 text-2xl shadow-glow-blood bg-blood hover:bg-blood/90 group"
            size="lg"
          >
            Publier l'After{" "}
            <ArrowRight className="ml-3 size-7 transition-transform group-hover:translate-x-3" />
          </Button>
          <p className="mt-6 text-center text-paper-dim text-sm italic">
            "Une fois publié, ton after sera visible dans la section dédiée et
            tu pourras le booster."
          </p>
        </div>
      </form>
    </div>
  );
}
