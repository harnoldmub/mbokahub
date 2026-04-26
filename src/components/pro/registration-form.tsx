"use client";

import { ArrowRight, AtSign, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import { PhotoUploader } from "@/components/admin/photo-uploader";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { createProProfileAction } from "@/lib/actions/public";
import { PRO_CATEGORIES, PRO_CATEGORY_GROUPS } from "@/lib/pro-categories";
import { cn } from "@/lib/utils";

export function ProRegistrationForm() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [isRequestingCert, setIsRequestingCert] = useState(false);

  const visibleCategories =
    activeGroup === "all"
      ? PRO_CATEGORIES
      : PRO_CATEGORIES.filter((c) => c.group === activeGroup);

  return (
    <div className="space-y-12">
      {/* CATEGORY SELECTION (WOW Interaction) */}
      <div className="space-y-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
          Étape 01 — Choisir ta catégorie
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveGroup("all")}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition",
              activeGroup === "all"
                ? "border-blood bg-blood text-paper"
                : "border-white/10 bg-white/5 text-paper-dim hover:border-white/30",
            )}
          >
            Toutes
          </button>
          {PRO_CATEGORY_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGroup(g.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition",
                activeGroup === g.id
                  ? "border-blood bg-blood text-paper"
                  : "border-white/10 bg-white/5 text-paper-dim hover:border-white/30",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border transition-all duration-500 text-center",
                selectedCategory === cat.id
                  ? "bg-blood/10 border-blood shadow-glow-blood scale-105"
                  : "bg-coal/50 border-white/5 hover:border-paper/20",
              )}
            >
              <span className="text-3xl transition-transform duration-500 group-hover:scale-110">
                {cat.icon}
              </span>
              <span
                className={cn(
                  "font-display text-[11px] uppercase tracking-widest leading-tight",
                  selectedCategory === cat.id
                    ? "text-paper"
                    : "text-paper-mute",
                )}
              >
                {cat.shortLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form action={createProProfileAction} className="space-y-10">
        <input type="hidden" name="category" value={selectedCategory ?? ""} />

        {!selectedCategory && (
          <p className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-3 text-yellow-300 text-sm">
            Choisis d'abord une catégorie ci-dessus.
          </p>
        )}

        {/* BASIC INFO */}
        <div className="grid sm:grid-cols-2 gap-8">
          <FormField
            label="Nom professionnel"
            helperText="Le nom qui apparaîtra sur l'affiche"
          >
            <Input
              name="displayName"
              required
              placeholder="Studio Liputa / Barber XY..."
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField
            label="Ville / Secteur"
            helperText="Où exerces-tu ce week-end là ?"
          >
            <Input
              name="city"
              required
              placeholder="Saint-Denis, Paris 18..."
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField label="Pays" helperText="Pays d'exercice">
            <Input
              name="country"
              defaultValue="France"
              required
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField
            label="WhatsApp"
            helperText="Pour que les clients te contactent"
          >
            <Input
              name="whatsapp"
              required
              placeholder="+33 6 ..."
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField label="TikTok (optionnel)" helperText="@handle">
            <Input
              name="tiktokHandle"
              placeholder="username"
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField
            label="Tarifs (optionnel)"
            helperText="Ex: à partir de 50€"
          >
            <Input
              name="priceRange"
              placeholder="à partir de 50€"
              className="h-12 bg-smoke border-none"
            />
          </FormField>
        </div>

        <FormField
          label="Spécialités (optionnel)"
          helperText="Sépare par des virgules : tresses, lace front, makeup glam..."
        >
          <Input
            name="specialities"
            placeholder="tresses, lace front, makeup glam"
            className="h-12 bg-smoke border-none"
          />
        </FormField>

        <FormField
          label="Présentation (optionnel)"
          helperText="Quelques lignes pour te présenter"
        >
          <textarea
            name="bio"
            rows={4}
            className="w-full rounded-md bg-smoke px-4 py-3 text-paper text-sm placeholder:text-paper-dim focus:outline-none"
            placeholder="Je suis maquilleuse depuis 8 ans, spécialisée en peau noire..."
          />
        </FormField>

        {/* CERTIFICATION SYSTEM (Instagram Based) */}
        <div className="relative group p-8 rounded-3xl border border-gold/20 bg-gold/5 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <ShieldCheck className="size-20 text-gold" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <AtSign className="size-6" />
              </div>
              <h3 className="font-display text-xl uppercase text-paper">
                Certification Instagram
              </h3>
            </div>

            <p className="max-w-xl text-paper-dim text-sm leading-relaxed font-body">
              Améliore ta conversion en faisant certifier ton profil. Une
              vérification manuelle sera effectuée sur ton compte Instagram pour
              garantir l'authenticité de ton service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <FormField label="Ton @Handle Instagram" className="flex-1">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60 font-mono">
                    @
                  </span>
                  <Input
                    placeholder="username"
                    className="h-12 bg-smoke border-none pl-8"
                  />
                </div>
              </FormField>

              <button
                type="button"
                onClick={() => setIsRequestingCert(!isRequestingCert)}
                className={cn(
                  "h-12 px-6 rounded-xl font-display text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center gap-2",
                  isRequestingCert
                    ? "bg-gold text-ink shadow-glow-gold"
                    : "bg-paper/5 text-paper-mute border border-paper/10",
                )}
              >
                {isRequestingCert ? (
                  <ShieldCheck className="size-4" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {isRequestingCert
                  ? "Demande envoyée"
                  : "Demander la certification"}
              </button>
            </div>
          </div>
        </div>

        {/* PHOTOS */}
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-ink/40 p-5">
          <div>
            <h3 className="font-display text-base uppercase text-paper">
              Photo principale & galerie
            </h3>
            <p className="mt-1 text-xs text-paper-mute">
              Ajoute ta photo principale puis ta galerie. La 1ère photo devient
              automatiquement la couverture publique de ton profil.
            </p>
          </div>
          <PhotoUploader
            name="photos"
            multiple
            maxFiles={12}
            enableCoverActions
            helpText="JPG/PNG/WebP/GIF/HEIC · 15 Mo max · jusqu'à 12 photos."
          />
        </div>

        {/* SUBMIT */}
        <div className="pt-8 flex flex-col items-center gap-6">
          <p className="max-w-md text-center text-paper-mute text-[10px] font-mono leading-relaxed uppercase tracking-widest">
            En soumettant ce formulaire, tu acceptes que Mboka Hub vérifie
            manuellement tes informations avant de mettre ton profil en ligne.
          </p>
          <Button
            type="submit"
            disabled={!selectedCategory}
            className="w-full h-16 text-lg shadow-glow-blood group disabled:opacity-50"
            size="lg"
          >
            Inscrire mon service{" "}
            <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
