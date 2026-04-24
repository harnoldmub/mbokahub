"use client";

import { Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  PRO_CATEGORIES,
  PRO_CATEGORY_BY_ID,
  PRO_CATEGORY_GROUPS,
} from "@/lib/pro-categories";
import { cn } from "@/lib/utils";
import type { ProCategory } from "@prisma/client";

type ProListItem = {
  id: string;
  slug: string;
  displayName: string;
  category: ProCategory;
  city: string;
  country: string;
  bio: string | null;
  photos: string[];
  priceRange: string | null;
  isPremium: boolean;
  isBoosted: boolean;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  whatsapp: string;
  instagramHandle: string | null;
  tiktokHandle: string | null;
};

type Props = {
  pros: ProListItem[];
};

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition",
        active
          ? "border-blood bg-blood text-paper shadow-glow-blood"
          : "border-white/10 bg-white/5 text-paper-dim hover:border-white/30 hover:text-paper",
      )}
    >
      {children}
    </button>
  );
}

export function PrestatairesListClient({ pros }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProCategory | "all">(
    "all",
  );
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [activeCity, setActiveCity] = useState<string>("all");
  const [premiumOnly, setPremiumOnly] = useState(false);

  const cities = useMemo(
    () =>
      Array.from(new Set(pros.map((p) => p.city.trim()).filter(Boolean))).sort(),
    [pros],
  );

  const visibleCategories = useMemo(() => {
    if (activeGroup === "all") return PRO_CATEGORIES;
    return PRO_CATEGORIES.filter((c) => c.group === activeGroup);
  }, [activeGroup]);

  const filtered = useMemo(() => {
    return pros.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory)
        return false;
      if (
        activeGroup !== "all" &&
        PRO_CATEGORY_BY_ID[p.category]?.group !== activeGroup
      )
        return false;
      if (activeCity !== "all" && p.city !== activeCity) return false;
      if (premiumOnly && !p.isPremium) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const meta = PRO_CATEGORY_BY_ID[p.category];
        if (
          !p.displayName.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q) &&
          !meta?.label.toLowerCase().includes(q) &&
          !(p.bio?.toLowerCase().includes(q) ?? false)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [pros, search, activeCategory, activeGroup, activeCity, premiumOnly]);

  const hasActiveFilters =
    !!search ||
    activeCategory !== "all" ||
    activeGroup !== "all" ||
    activeCity !== "all" ||
    premiumOnly;

  const reset = () => {
    setSearch("");
    setActiveCategory("all");
    setActiveGroup("all");
    setActiveCity("all");
    setPremiumOnly(false);
  };

  if (pros.length === 0) {
    return (
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-32 lg:px-8">
        <div className="rounded-[3rem] border border-blood/20 bg-blood/5 p-12 text-center">
          <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-blood" />
          <h2 className="mt-6 font-display text-3xl uppercase text-paper sm:text-4xl">
            Bientôt disponible
          </h2>
          <p className="mt-4 text-paper-dim">
            Les premiers prestataires sont en cours de validation. Inscris-toi
            si tu veux être visible dès l'ouverture.
          </p>
          <Link
            href="/pro/inscrire"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blood px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition hover:bg-blood/90"
          >
            Devenir prestataire
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-coal/60 p-6 backdrop-blur-md sm:p-8">
        {/* Search */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
            Rechercher
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-paper-mute" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, ville, spécialité…"
              className="w-full rounded-2xl border border-white/10 bg-smoke py-3 pl-11 pr-10 text-paper placeholder:text-paper-mute focus:border-blood focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-paper-mute hover:bg-white/10 hover:text-paper"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Group selector */}
        <div className="mt-6 space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
            Famille
          </label>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={activeGroup === "all"}
              onClick={() => {
                setActiveGroup("all");
                setActiveCategory("all");
              }}
            >
              Toutes
            </FilterChip>
            {PRO_CATEGORY_GROUPS.map((g) => (
              <FilterChip
                key={g.id}
                active={activeGroup === g.id}
                onClick={() => {
                  setActiveGroup(g.id);
                  setActiveCategory("all");
                }}
              >
                {g.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-6 space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
            Catégorie
          </label>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            >
              Toutes
            </FilterChip>
            {visibleCategories.map((c) => (
              <FilterChip
                key={c.id}
                active={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
              >
                <span className="mr-1.5">{c.icon}</span>
                {c.shortLabel}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* City + premium */}
        {cities.length > 0 && (
          <div className="mt-6 space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
              Ville
            </label>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={activeCity === "all"}
                onClick={() => setActiveCity("all")}
              >
                Toutes
              </FilterChip>
              {cities.map((city) => (
                <FilterChip
                  key={city}
                  active={activeCity === city}
                  onClick={() => setActiveCity(city)}
                >
                  {city}
                </FilterChip>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
          <button
            type="button"
            onClick={() => setPremiumOnly((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition",
              premiumOnly
                ? "bg-vip text-coal shadow-[0_0_30px_rgba(252,211,77,0.4)]"
                : "border border-white/10 bg-white/5 text-paper-dim hover:border-vip/40 hover:text-vip",
            )}
          >
            <Sparkles className="size-3.5" />
            Certifiés uniquement
          </button>

          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-paper-mute">
            <span>
              {filtered.length} {filtered.length > 1 ? "résultats" : "résultat"}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-white/10 px-3 py-1 text-paper-dim hover:border-blood hover:text-blood"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-white/10 bg-coal/40 p-12 text-center">
          <p className="font-display text-2xl uppercase text-paper">
            Aucun prestataire ne correspond
          </p>
          <p className="mt-3 text-paper-dim">
            Essaie d'élargir tes filtres ou de changer de famille.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full border border-blood/40 bg-blood/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-blood hover:bg-blood/20"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const meta = PRO_CATEGORY_BY_ID[p.category];
            const cover = p.photos?.[0];
            return (
              <Link
                key={p.id}
                href={`/pro/${p.id}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-coal/60 transition hover:-translate-y-1 hover:border-blood/40 hover:shadow-[0_30px_60px_-30px_rgba(230,57,70,0.4)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-smoke">
                  {cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cover}
                      alt={p.displayName}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl opacity-40">
                      {meta?.icon ?? "✨"}
                    </div>
                  )}
                  {p.isPremium && (
                    <span className="absolute right-3 top-3 rounded-full bg-vip px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-coal">
                      ★ Certifié
                    </span>
                  )}
                  {p.isBoosted && (
                    <span className="absolute left-3 top-3 rounded-full bg-blood/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-paper backdrop-blur">
                      Boost
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blood">
                    <span>{meta?.icon}</span>
                    <span>{meta?.shortLabel}</span>
                  </div>
                  <h3 className="font-display text-2xl text-paper">
                    {p.displayName}
                  </h3>
                  <p className="text-sm text-paper-dim">
                    {p.city}, {p.country}
                  </p>
                  {p.bio && (
                    <p className="line-clamp-2 text-sm text-paper-mute">
                      {p.bio}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                      {p.priceRange ?? "Sur devis"}
                    </span>
                    {p.rating > 0 && (
                      <span className="flex items-center gap-1 font-mono text-xs text-vip">
                        ★ {p.rating.toFixed(1)}
                        <span className="text-paper-mute">
                          ({p.reviewsCount})
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
