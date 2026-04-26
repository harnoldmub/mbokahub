"use client";

import { ArrowRight, LockKeyhole, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PhotoLightbox } from "@/components/pros/photo-lightbox";
import {
  PRO_CATEGORIES,
  PRO_CATEGORY_BY_ID,
  PRO_CATEGORY_GROUPS,
} from "@/lib/pro-categories";
import { formatPriceRange } from "@/lib/pro-display";
import { cn } from "@/lib/utils";
import { SearchableSelect } from "@/components/ui/searchable-select";
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
  instagramHandle: string | null;
  tiktokHandle: string | null;
};

type Props = {
  pros: ProListItem[];
  /**
   * When false, names have already been replaced server-side by a generic
   * label (e.g. "Maquilleuse · Paris 15") and Instagram/TikTok handles are
   * null. We just add the lock UI on top.
   */
  unlocked?: boolean;
};

export function PrestatairesListClient({ pros, unlocked = false }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProCategory | "all">(
    "all",
  );
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [activeCity, setActiveCity] = useState<string>("all");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  );

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
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-12 lg:px-8">
      <div className="relative z-30 rounded-2xl border border-white/10 bg-coal/60 p-4 backdrop-blur-md sm:p-5">
        {/* Search + filters in one compact row */}
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:items-end">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-paper-mute" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, ville, spécialité…"
              aria-label="Rechercher un prestataire"
              className="h-10 w-full rounded-xl border border-white/10 bg-smoke pl-9 pr-9 text-sm text-paper placeholder:text-paper-mute focus:border-blood focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-paper-mute hover:bg-white/10 hover:text-paper"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Dropdown filters: Famille, Catégorie, Ville (with search) */}
          <div className="contents lg:contents">
          <SearchableSelect
            label="Famille"
            value={activeGroup}
            onChange={(v) => {
              setActiveGroup(v);
              setActiveCategory("all");
            }}
            searchPlaceholder="Rechercher une famille…"
            options={[
              { value: "all", label: "Toutes les familles", sticky: true },
              ...PRO_CATEGORY_GROUPS.map((g) => ({
                value: g.id,
                label: g.label,
              })),
            ]}
          />

          <SearchableSelect
            label="Catégorie"
            value={activeCategory}
            onChange={(v) => setActiveCategory(v as ProCategory | "all")}
            searchPlaceholder="Rechercher une catégorie…"
            options={[
              { value: "all", label: "Toutes les catégories", sticky: true },
              ...visibleCategories.map((c) => ({
                value: c.id,
                label: `${c.icon}  ${c.label}`,
              })),
            ]}
          />

          {cities.length > 0 && (
            <SearchableSelect
              label="Ville"
              value={activeCity}
              onChange={setActiveCity}
              searchPlaceholder="Rechercher une ville…"
              options={[
                { value: "all", label: "Toutes les villes", sticky: true },
                ...cities.map((city) => ({ value: city, label: city })),
              ]}
            />
          )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3">
          <button
            type="button"
            onClick={() => setPremiumOnly((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition",
              premiumOnly
                ? "bg-vip text-coal shadow-[0_0_20px_rgba(252,211,77,0.3)]"
                : "border border-white/10 bg-white/5 text-paper-dim hover:border-vip/40 hover:text-vip",
            )}
          >
            <Sparkles className="size-3" />
            Certifiés uniquement
          </button>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
            <span>
              {filtered.length} {filtered.length > 1 ? "résultats" : "résultat"}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-white/10 px-2.5 py-1 text-paper-dim hover:border-blood hover:text-blood"
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
              <article
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-coal/60 transition hover:-translate-y-1 hover:border-blood/40 hover:shadow-[0_30px_60px_-30px_rgba(230,57,70,0.4)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-smoke">
                  {cover ? (
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({ src: cover, alt: p.displayName })
                      }
                      aria-label={`Agrandir la photo de ${p.displayName}`}
                      className="block h-full w-full cursor-zoom-in"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt={p.displayName}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    </button>
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl opacity-40">
                      {meta?.icon ?? "✨"}
                    </div>
                  )}
                  {p.isPremium && (
                    <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-vip px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-coal">
                      ★ Certifié
                    </span>
                  )}
                  {p.isBoosted && (
                    <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-blood/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-paper backdrop-blur">
                      Boost
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blood">
                    <span>{meta?.icon}</span>
                    <span>{meta?.shortLabel}</span>
                  </div>
                  <h3
                    className={cn(
                      "font-display text-2xl text-paper",
                      !unlocked && "italic text-paper-dim",
                    )}
                  >
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
                  {!unlocked && (
                    <div className="flex items-center gap-2 rounded-xl border border-vip/30 bg-vip/5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-vip">
                      <LockKeyhole className="size-3" />
                      Pass VIP Famille pour voir le nom &amp; les contacts
                    </div>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                      {formatPriceRange(p.priceRange)}
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

                  {unlocked ? (
                    <Link
                      href={`/pro/${p.id}`}
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-blood/40 bg-blood/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-blood transition hover:bg-blood/20"
                    >
                      Voir la fiche
                      <ArrowRight className="size-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/vip"
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-vip/40 bg-vip/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-vip transition hover:bg-vip/15"
                    >
                      <LockKeyhole className="size-3.5" />
                      Fiche réservée aux VIP
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {lightbox ? (
        <PhotoLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </section>
  );
}
