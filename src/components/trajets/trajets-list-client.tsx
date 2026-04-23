"use client";

import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useMemo, useState } from "react";

import { TrajetCard } from "@/components/trajets/trajet-card";
import { Input } from "@/components/ui/input";
import type { TrajetDemo } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type Props = { trajets: TrajetDemo[] };

export function TrajetsListClient({ trajets }: Props) {
  const villes = useMemo(
    () => ["Tous", ...Array.from(new Set(trajets.map((t) => t.villeDepart)))],
    [trajets],
  );

  const [activeVille, setActiveVille] = useState("Tous");
  const [boostOnly, setBoostOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = trajets.filter((t) => {
    const matchesSearch =
      t.villeDepart.toLowerCase().includes(search.toLowerCase()) ||
      t.vehicule.toLowerCase().includes(search.toLowerCase()) ||
      t.note?.toLowerCase().includes(search.toLowerCase());

    if (activeVille !== "Tous" && t.villeDepart !== activeVille) return false;
    if (boostOnly && !t.isBoosted) return false;
    if (search && !matchesSearch) return false;

    return true;
  });

  const hasActiveFilters = activeVille !== "Tous" || boostOnly || search !== "";

  return (
    <div className="space-y-12">
      {/* Search & Filter Bar */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-paper-mute group-focus-within:text-blood transition-colors" />
          <Input
            placeholder="Rechercher une ville, un message ou un trajet..."
            className="h-16 pl-12 pr-4 bg-coal border-white/10 rounded-2xl text-lg font-body focus:border-blood/50 focus:ring-blood/20 shadow-2xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-paper-mute hover:text-paper"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute pr-2 border-r border-white/10">
              <SlidersHorizontal className="size-3" />
              Départ
            </div>
            {villes.map((ville) => (
              <button
                className={cn(
                  "rounded-xl border px-5 py-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-300",
                  activeVille === ville
                    ? "border-blood bg-blood text-white shadow-glow-blood"
                    : "border-white/5 bg-coal/50 text-paper-mute hover:border-white/20 hover:text-paper",
                )}
                key={ville}
                onClick={() => setActiveVille(ville)}
                type="button"
              >
                {ville}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              className={cn(
                "flex items-center gap-2 rounded-xl border px-5 py-2 font-mono text-[10px] uppercase tracking-wider transition-all",
                boostOnly
                  ? "border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(255,184,0,0.2)]"
                  : "border-white/5 bg-coal/50 text-paper-mute hover:border-white/20 hover:text-paper",
              )}
              onClick={() => setBoostOnly((v) => !v)}
              type="button"
            >
              <Star className={cn("size-3", boostOnly && "fill-current")} />
              Vedettes
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setActiveVille("Tous");
                  setBoostOnly(false);
                  setSearch("");
                }}
                className="font-mono text-[10px] uppercase tracking-widest text-blood hover:underline underline-offset-4 px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count & Atmosphere */}
      <div className="flex items-center gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
          {filtered.length}{" "}
          {filtered.length > 1 ? "Trajets trouvés" : "Trajet trouvé"}
        </p>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-coal/30 py-32 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-blood/5 to-transparent pointer-events-none" />
          <Search className="size-16 text-paper-mute opacity-10 mb-8" />
          <p className="font-display text-4xl uppercase text-paper tracking-tight">
            Aucun trajet trouvé
          </p>
          <p className="mt-4 max-w-sm font-body text-paper-dim leading-relaxed">
            Élargis ta recherche ou publie toi-même un trajet pour aider
            d'autres fans !
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveVille("Tous");
              setSearch("");
              setBoostOnly(false);
            }}
            className="mt-10 font-mono text-xs text-blood uppercase tracking-widest hover:underline"
          >
            Réinitialiser tous les filtres
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-20">
          {filtered.map((trajet) => (
            <TrajetCard key={trajet.id} trajet={trajet} />
          ))}
        </div>
      )}
    </div>
  );
}
