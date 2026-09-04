"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CityInput } from "@/components/ui/city-input";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { createProProfileAction } from "@/lib/actions/public";
import { PRO_CATEGORIES, PRO_CATEGORY_GROUPS } from "@/lib/pro-categories";
import { cn } from "@/lib/utils";

type Props = {
  defaultCategory?: string;
};

export function ProRegistrationForm({ defaultCategory }: Props = {}) {
  const initialCat =
    defaultCategory && PRO_CATEGORIES.some((c) => c.id === defaultCategory)
      ? defaultCategory
      : null;
  const initialGroup = initialCat
    ? (PRO_CATEGORIES.find((c) => c.id === initialCat)?.group ?? "all")
    : "all";

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCat,
  );
  const [activeGroup, setActiveGroup] = useState<string>(initialGroup);

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
            <CityInput
              name="city"
              required
              placeholder="Saint-Denis, Paris 18…"
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
            helperText="Choisis ton indicatif pays puis tape ton numéro"
          >
            <PhoneInput name="whatsapp" required />
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
          helperText="Parle de ton métier. Pas de numéro, email ni nom de réseau (WhatsApp, Instagram, TikTok…) — ces contacts sont gérés par les champs dédiés."
        >
          <textarea
            name="bio"
            rows={4}
            className="w-full rounded-md bg-smoke px-4 py-3 text-paper text-sm placeholder:text-paper-dim focus:outline-none"
            placeholder="Je suis maquilleuse depuis 8 ans, spécialisée en peau noire..."
          />
        </FormField>

        <div className="flex items-start gap-4 rounded-3xl border border-gold/20 bg-gold/5 p-6">
          <ShieldCheck className="mt-1 size-6 shrink-0 text-gold" aria-hidden />
          <div>
            <h3 className="font-display text-xl uppercase text-paper">
              Certification gratuite
            </h3>
            <p className="mt-2 max-w-xl text-paper-dim text-sm leading-relaxed">
              Une fois ta fiche créée, tu pourras demander sa certification
              depuis ton tableau de bord. L&apos;équipe vérifiera manuellement
              ton identité professionnelle et tes informations publiques.
            </p>
          </div>
        </div>

        {/* PHOTOS */}
        <div className="grid sm:grid-cols-2 gap-8">
          <PhotoUpload
            label="Avatar / Logo"
            description="L'image principale de ton profil"
          />
          <PhotoUpload
            label="Photo de service"
            description="Exemple de ton travail (Maquillage, Coiffure...)"
          />
        </div>

        {/* SUBMIT */}
        <div className="pt-8 flex flex-col items-center gap-6">
          <p className="max-w-md text-center text-paper-mute text-[10px] font-mono leading-relaxed uppercase tracking-widest">
            En soumettant ce formulaire, tu acceptes que Nevent vérifie
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
