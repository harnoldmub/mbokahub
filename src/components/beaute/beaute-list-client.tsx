"use client";

import { SlidersHorizontal, Star } from "lucide-react";
import { useState } from "react";

import { ProCard } from "@/components/pros/pro-card";
import type { ProDemo } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type Category = ProDemo["category"] | "TOUS";

type Props = {
  pros: ProDemo[];
  defaultCategory?: Category;
};

const CATEGORY_LABELS: Record<string, string> = {
  TOUS: "Tous",
  MAQUILLEUSE: "Maquilleuses",
  COIFFEUR: "Coiffeurs",
  BARBIER: "Barbiers",
  PHOTOGRAPHE: "Photographes",
};

export function BeauteListClient({ pros, defaultCategory = "TOUS" }: Props) {
  const availableCategories: Category[] = [
    "TOUS",
    ...Array.from(new Set(pros.map((p) => p.category))),
  ];

  const [activeCategory, setActiveCategory] =
    useState<Category>(defaultCategory);
  const [premiumOnly, setPremiumOnly] = useState(false);

  const filtered = pros.filter((p) => {
    if (activeCategory !== "TOUS" && p.category !== activeCategory)
      return false;
    if (premiumOnly && !p.isPremium) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
          <SlidersHorizontal className="size-3" />
          Catégorie
        </div>

        <div className="flex flex-wrap gap-2">
          {availableCategories.map((cat) => (
            <button
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all",
                activeCategory === cat
                  ? "border-gold bg-gold text-ink shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  : "border-white/10 text-paper-mute hover:border-gold/40 hover:text-paper",
              )}
              key={cat}
              onClick={() => setActiveCategory(cat)}
              type="button"
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <button
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all",
              premiumOnly
                ? "border-gold bg-gold text-ink"
                : "border-white/10 text-paper-mute hover:border-gold/40 hover:text-paper",
            )}
            onClick={() => setPremiumOnly((v) => !v)}
            type="button"
          >
            <Star className="size-3" />
            Premium
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
        {filtered.length} prestataire{filtered.length !== 1 ? "s" : ""} trouvé
        {filtered.length !== 1 ? "s" : ""}
        {activeCategory !== "TOUS"
          ? ` · ${CATEGORY_LABELS[activeCategory]}`
          : ""}
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-smoke/10 py-20 text-center">
          <p className="font-display text-3xl uppercase text-paper-mute">
            Aucun résultat
          </p>
          <p className="mt-2 font-body text-sm text-paper-mute">
            Essaie un autre filtre
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {filtered.map((pro) => (
            <ProCard key={pro.id} pro={pro} />
          ))}
        </div>
      )}
    </div>
  );
}
