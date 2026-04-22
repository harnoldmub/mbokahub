"use client";

import { ArrowRight, Info } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PhotoUpload } from "@/components/ui/photo-upload";

export default function PublishTrajetPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      {/* Background watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-5vw] top-[10vh] font-display text-[25vw] text-blood opacity-[0.03] select-none leading-none uppercase">
          DRIVER
        </span>
      </div>

      <div className="mx-auto grid max-w-7xl px-6 py-20 lg:grid-cols-[1fr_1.2fr] gap-16 relative z-10">
        {/* LEFT: Branding & Context */}
        <div className="space-y-12">
          <SectionHeading
            number="01"
            eyebrow="Publication"
            title="Partage un trajet vers *le concert*."
            description="Aide la diaspora à se regrouper. Moins de frais, plus de sécurité, un voyage mémorable."
          />

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-smoke/50 border border-white/5 rounded-2xl">
              <div className="size-10 rounded-xl bg-blood/10 flex items-center justify-center text-blood shrink-0">
                <Info className="size-5" />
              </div>
              <div className="space-y-2">
                <p className="font-display text-sm uppercase text-paper">
                  Validation manuelle
                </p>
                <p className="text-paper-dim text-xs leading-relaxed font-body">
                  Ton annonce sera vérifiée par Mboka Hub. Les passagers voient
                  ta voiture, ton modèle et ton prix avant de te contacter via
                  WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4 border border-gold/10 bg-gold/5 rounded-2xl">
              <span className="font-mono text-[10px] text-gold uppercase tracking-tighter">
                Accès VIP Uniquement pour les contacts
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: THE FORM */}
        <div className="relative">
          <div className="absolute -top-10 -right-10 size-40 bg-blood/10 blur-[80px] rounded-full hidden lg:block" />

          <form className="relative bg-coal border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-10">
            <div className="space-y-8">
              {/* SECTION: ITINÉRAIRE */}
              <div className="space-y-6">
                <h3 className="font-display text-xl uppercase text-paper/80 tracking-tight flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-smoke flex items-center justify-center text-blood text-sm">
                    01
                  </span>
                  L'itinéraire
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    label="Ville de départ"
                    helperText="D'où pars-tu ?"
                  >
                    <Input
                      placeholder="Bruxelles, Mons, Charleroi..."
                      className="h-12 bg-smoke border-none"
                    />
                  </FormField>
                  <FormField
                    label="Heure de départ"
                    helperText="Précise l'heure"
                  >
                    <Input
                      type="time"
                      className="h-12 bg-smoke border-none text-paper-dim"
                    />
                  </FormField>
                </div>
              </div>

              {/* SECTION: VÉHICULE & PHOTOS */}
              <div className="space-y-6">
                <h3 className="font-display text-xl uppercase text-paper/80 tracking-tight flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-smoke flex items-center justify-center text-blood text-sm">
                    02
                  </span>
                  Le véhicule
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    label="Modèle de voiture"
                    error=""
                    helperText="Ex: Audi A3, Peugeot 3008"
                  >
                    <Input
                      placeholder="Audi A3"
                      className="h-12 bg-smoke border-none"
                    />
                  </FormField>
                  <FormField
                    label="Couleur"
                    helperText="Pour te repérer plus facilement"
                  >
                    <Input
                      placeholder="Noir, Blanc, Gris..."
                      className="h-12 bg-smoke border-none"
                    />
                  </FormField>
                </div>

                <PhotoUpload
                  label="Photo de ta voiture"
                  description="Montre ton véhicule pour rassurer les passagers (Max 5MB)"
                />
              </div>

              {/* SECTION: INFOS PRATIQUES */}
              <div className="space-y-6">
                <h3 className="font-display text-xl uppercase text-paper/80 tracking-tight flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-smoke flex items-center justify-center text-blood text-sm">
                    03
                  </span>
                  Détails du voyage
                </h3>

                <div className="grid sm:grid-cols-3 gap-6">
                  <FormField label="Places" helperText="Places libres">
                    <Input
                      type="number"
                      min="1"
                      max="8"
                      placeholder="4"
                      className="h-12 bg-smoke border-none"
                    />
                  </FormField>
                  <FormField label="Prix / place" helperText="En Euros (€)">
                    <Input
                      type="number"
                      placeholder="25"
                      className="h-12 bg-smoke border-none"
                    />
                  </FormField>
                  <FormField label="WhatsApp" helperText="Contact direct">
                    <Input
                      placeholder="+32 ..."
                      className="h-12 bg-smoke border-none"
                    />
                  </FormField>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-16 text-lg shadow-glow-blood group"
              size="lg"
            >
              Publier mon annonce{" "}
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
