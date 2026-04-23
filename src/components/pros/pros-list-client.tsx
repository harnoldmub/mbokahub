"use client";

import { Search, ShieldCheck, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProCard } from "@/components/pros/pro-card";
import { Input } from "@/components/ui/input";
import type { ProDemo } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type Props = {
  pros: ProDemo[];
  categoryTitle?: string;
};

export function ProsListClient({ pros, categoryTitle }: Props) {
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);

  const filtered = useMemo(() => {
    return pros.filter((pro) => {
      const matchesSearch =
        pro.displayName.toLowerCase().includes(search.toLowerCase()) ||
        pro.city.toLowerCase().includes(search.toLowerCase()) ||
        pro.specialities.some((s) =>
          s.toLowerCase().includes(search.toLowerCase()),
        );

      if (verifiedOnly && !pro.isVerified) return false;
      if (premiumOnly && !pro.isPremium) return false;
      if (search && !matchesSearch) return false;

      return true;
    });
  }, [pros, search, verifiedOnly, premiumOnly]);

  const hasActiveFilters = verifiedOnly || premiumOnly || search !== "";

  return (
    <div className="space-y-12">
      {/* Search & Filter Bar */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-paper-mute group-focus-within:text-gold transition-colors" />
          <Input
            placeholder={`Rechercher ${categoryTitle ? categoryTitle.toLowerCase() : "un prestataire"}, une ville, une spécialité...`}
            className="h-16 pl-14 pr-4 bg-coal border-white/10 rounded-3xl text-lg font-body focus:border-gold/50 focus:ring-gold/20 shadow-2xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-paper-mute hover:text-paper"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              className={cn(
                "flex items-center gap-2 rounded-xl border px-6 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-300",
                verifiedOnly
                  ? "border-gold bg-gold/10 text-gold shadow-glow-gold"
                  : "border-white/5 bg-coal/50 text-paper-mute hover:border-white/20 hover:text-paper",
              )}
              onClick={() => setVerifiedOnly((v) => !v)}
              type="button"
            >
              <ShieldCheck className="size-3.5" />
              Certifiés
            </button>

            <button
              className={cn(
                "flex items-center gap-2 rounded-xl border px-6 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-300",
                premiumOnly
                  ? "border-gold bg-gold/10 text-gold shadow-glow-gold"
                  : "border-white/5 bg-coal/50 text-paper-mute hover:border-white/20 hover:text-paper",
              )}
              onClick={() => setPremiumOnly((v) => !v)}
              type="button"
            >
              <Star className={cn("size-3.5", premiumOnly && "fill-current")} />
              Premium
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setVerifiedOnly(false);
                setPremiumOnly(false);
                setSearch("");
              }}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-blood hover:bg-blood/10 px-4 py-2 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-mute">
          {filtered.length} Résultat{filtered.length > 1 ? "s" : ""}
        </p>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-coal/20 py-40 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
          <p className="font-display text-4xl uppercase text-paper tracking-tighter mb-4">
            Aucun prestataire trouvé
          </p>
          <p className="max-w-xs mx-auto text-paper-dim font-body italic">
            Réduisez les filtres ou cherchez une autre ville.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setVerifiedOnly(false);
              setPremiumOnly(false);
            }}
            className="mt-10 px-8 py-3 rounded-xl bg-smoke border border-white/10 font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-smoke/60 transition-colors"
          >
            Voir tout le catalogue
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pro) => (
            <ProCard key={pro.id} pro={pro} />
          ))}
        </div>
      )}
    </div>
  );
}
