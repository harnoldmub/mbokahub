"use client";

import { ArrowRight, Plus, Search, Star, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { TrajetCard } from "@/components/trajets/trajet-card";
import { Input } from "@/components/ui/input";
import type { TrajetDemo } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type Props = { trajets: TrajetDemo[]; unlocked?: boolean };

type DateFilter = "all" | "may2" | "may3";

const dateFilters: { id: DateFilter; label: string }[] = [
  { id: "all", label: "Toutes dates" },
  { id: "may2", label: "Sam. 2 mai" },
  { id: "may3", label: "Dim. 3 mai" },
];

export function TrajetsListClient({ trajets, unlocked }: Props) {
  const villes = useMemo(
    () => Array.from(new Set(trajets.map((t) => t.villeDepart))).sort(),
    [trajets],
  );

  const [activeVille, setActiveVille] = useState<string>("all");
  const [activeDate, setActiveDate] = useState<DateFilter>("all");
  const [boostOnly, setBoostOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return trajets.filter((t) => {
      if (activeVille !== "all" && t.villeDepart !== activeVille) return false;
      if (boostOnly && !t.isBoosted) return false;

      if (activeDate !== "all") {
        const label = t.dateLabel.toLowerCase();
        if (activeDate === "may2" && !label.includes("2 mai")) return false;
        if (activeDate === "may3" && !label.includes("3 mai")) return false;
      }

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
            place vers le Stade de France — d&apos;autres Warriors te
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

  return (
    <div className="space-y-10">
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

      {/* Filter row 1 — départ */}
      {villes.length > 0 && (
        <div className="space-y-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper-mute">
            Ville de départ
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={activeVille === "all"}
              label="Toutes"
              onClick={() => setActiveVille("all")}
            />
            {villes.map((ville) => (
              <FilterChip
                active={activeVille === ville}
                key={ville}
                label={ville}
                onClick={() => setActiveVille(ville)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filter row 2 — date + vedettes */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper-mute">
            Date du concert
          </p>
          <div className="flex flex-wrap gap-2">
            {dateFilters.map((d) => (
              <FilterChip
                active={activeDate === d.id}
                key={d.id}
                label={d.label}
                onClick={() => setActiveDate(d.id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper-mute">
            Mise en avant
          </p>
          <button
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-all",
              boostOnly
                ? "border-gold bg-gold/15 text-gold"
                : "border-white/10 bg-coal/60 text-paper-mute hover:border-white/25 hover:text-paper",
            )}
            onClick={() => setBoostOnly((v) => !v)}
            type="button"
          >
            <Star className={cn("size-3.5", boostOnly && "fill-current")} />
            Vedettes uniquement
          </button>
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

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-xl border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-all duration-200",
        active
          ? "border-blood bg-blood text-white shadow-glow-blood"
          : "border-white/10 bg-coal/60 text-paper-mute hover:border-white/25 hover:text-paper",
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
