"use client";

import { ArrowRight, Plus, Search, Star, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { TrajetCard } from "@/components/trajets/trajet-card";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { TrajetDemo } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type TrajetWithDate = TrajetDemo & { dateIso?: string };

type Props = { trajets: TrajetWithDate[]; unlocked?: boolean };

export function TrajetsListClient({ trajets, unlocked }: Props) {
  const villes = useMemo(
    () => Array.from(new Set(trajets.map((t) => t.villeDepart))).sort(),
    [trajets],
  );

  // Adaptive date list: derive from actual trajets data and sort chronologically.
  const datesOptions = useMemo(() => {
    const map = new Map<string, string>(); // dateIso -> dateLabel
    for (const t of trajets) {
      if (t.dateIso && !map.has(t.dateIso)) {
        map.set(t.dateIso, t.dateLabel);
      }
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([iso, label]) => ({ value: iso, label }));
  }, [trajets]);

  const [activeVille, setActiveVille] = useState<string>("all");
  const [activeDate, setActiveDate] = useState<string>("all");
  const [boostOnly, setBoostOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return trajets.filter((t) => {
      if (activeVille !== "all" && t.villeDepart !== activeVille) return false;
      if (boostOnly && !t.isBoosted) return false;
      if (activeDate !== "all" && t.dateIso !== activeDate) return false;

      if (search) {
        const q = search.toLowerCase();
        const matches =
          t.villeDepart.toLowerCase().includes(q) ||
          t.vehicule.toLowerCase().includes(q) ||
          (t.note?.toLowerCase().includes(q) ?? false);
        if (!matches) return false;
      }

      return true;
    });
  }, [trajets, activeVille, activeDate, boostOnly, search]);

  const hasActiveFilters =
    activeVille !== "all" ||
    activeDate !== "all" ||
    boostOnly ||
    search !== "";

  const resetFilters = () => {
    setActiveVille("all");
    setActiveDate("all");
    setBoostOnly(false);
    setSearch("");
  };

  // Empty catalogue state — no trajets at all
  if (trajets.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-coal/40 px-6 py-20 text-center sm:px-12 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-blood/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-md space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-blood/30 bg-blood/10 px-4 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            <span className="size-1.5 rounded-full bg-blood animate-pulse" />
            Bientôt disponible
          </span>
          <h2 className="font-display text-4xl uppercase text-paper leading-tight sm:text-5xl">
            Sois le premier <br />
            <span className="font-serif italic text-blood">à publier</span>
          </h2>
          <p className="font-body text-paper-dim leading-relaxed">
            Aucun trajet pour le moment. Lance le mouvement et propose une
            place vers le Stade de France — d&apos;autres membres de la Famille te
            rejoindront.
          </p>
          <Link
            href="/trajets/publier"
            className="inline-flex items-center gap-2 rounded-2xl bg-blood px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-white shadow-glow-blood transition-transform hover:-translate-y-0.5"
          >
            <Plus className="size-4" />
            Publier mon trajet
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  const villeOptions = [
    { value: "all", label: "Toutes les villes", sticky: true },
    ...villes.map((v) => ({ value: v, label: v })),
  ];

  const dateSelectOptions = [
    { value: "all", label: "Toutes les dates", sticky: true },
    ...datesOptions,
  ];

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-paper-mute pointer-events-none" />
        <Input
          aria-label="Rechercher un trajet"
          placeholder="Ville, véhicule ou mot-clé…"
          className="h-14 pl-14 pr-12 bg-coal border-white/10 rounded-2xl text-base font-body placeholder:text-paper-mute/70 focus:border-blood/50 focus:ring-2 focus:ring-blood/20 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            aria-label="Effacer la recherche"
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-paper-mute hover:bg-white/5 hover:text-paper transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filters card */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-coal/80 to-coal/40 p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <SearchableSelect
            label="Ville de départ"
            value={activeVille}
            onChange={setActiveVille}
            options={villeOptions}
            placeholder="Toutes les villes"
            searchPlaceholder="Rechercher une ville…"
            emptyLabel="Aucune ville"
          />

          <SearchableSelect
            label="Date du trajet"
            value={activeDate}
            onChange={setActiveDate}
            options={dateSelectOptions}
            placeholder="Toutes les dates"
            searchPlaceholder="Rechercher une date…"
            emptyLabel="Aucune date"
            noSort
          />

          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
              Mise en avant
            </p>
            <button
              className={cn(
                "inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-2xl border px-5 font-mono text-[11px] uppercase tracking-[0.15em] transition-all lg:w-auto",
                boostOnly
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/10 bg-smoke text-paper-mute hover:border-white/25 hover:text-paper",
              )}
              onClick={() => setBoostOnly((v) => !v)}
              type="button"
            >
              <Star
                aria-hidden
                className={cn("size-3.5", boostOnly && "fill-current")}
              />
              Vedettes
            </button>
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
          <span className="text-paper">{filtered.length}</span>{" "}
          {filtered.length > 1 ? "trajets disponibles" : "trajet disponible"}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-coal/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-paper-dim hover:border-blood/40 hover:text-blood transition-colors"
          >
            <X className="size-3" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-coal/30 py-24 text-center">
          <Search className="size-12 text-paper-mute opacity-20 mb-6" />
          <p className="font-display text-3xl uppercase text-paper tracking-tight">
            Aucun trajet ne correspond
          </p>
          <p className="mt-3 max-w-sm font-body text-paper-dim leading-relaxed">
            Essaie une autre ville ou élargis tes filtres.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-coal/50 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-paper-dim hover:border-blood/40 hover:text-blood transition-colors"
          >
            <X className="size-3" />
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-20">
          {filtered.map((trajet) => (
            <TrajetCard key={trajet.id} trajet={trajet} unlocked={unlocked} />
          ))}
        </div>
      )}
    </div>
  );
}
