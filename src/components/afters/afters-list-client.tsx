"use client";

import {
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AfterDemo } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type Props = { afters: AfterDemo[] };

export function AftersListClient({ afters }: Props) {
  const villes = ["Toutes", ...Array.from(new Set(afters.map((a) => a.city)))];
  const nuits = Array.from(
    new Set(
      afters
        .map((a) => {
          const match = a.dateLabel.match(/^(vendredi|samedi)/i);
          return match
            ? match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase()
            : null;
        })
        .filter(Boolean),
    ),
  );
  const nuitOptions = ["Toutes", ...nuits] as string[];

  const [activeVille, setActiveVille] = useState("Toutes");
  const [activeNuit, setActiveNuit] = useState("Toutes");

  const filtered = afters.filter((a) => {
    if (activeVille !== "Toutes" && a.city !== activeVille) return false;
    if (activeNuit !== "Toutes") {
      const match = a.dateLabel.match(/^(vendredi|samedi)/i);
      const nuit = match
        ? match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase()
        : "";
      if (nuit !== activeNuit) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
            <SlidersHorizontal className="size-3" />
            Ville
          </span>
          <div className="flex flex-wrap gap-2">
            {villes.map((v) => (
              <button
                className={cn(
                  "rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all",
                  activeVille === v
                    ? "border-blood bg-blood text-paper shadow-[0_0_20px_rgba(230,57,70,0.3)]"
                    : "border-white/10 text-paper-mute hover:border-blood/40 hover:text-paper",
                )}
                key={v}
                onClick={() => setActiveVille(v)}
                type="button"
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
            Nuit
          </span>
          <div className="flex flex-wrap gap-2">
            {nuitOptions.map((n) => (
              <button
                className={cn(
                  "rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all",
                  activeNuit === n
                    ? "border-ember bg-ember text-paper shadow-[0_0_20px_rgba(255,120,50,0.3)]"
                    : "border-white/10 text-paper-mute hover:border-ember/40 hover:text-paper",
                )}
                key={n}
                onClick={() => setActiveNuit(n)}
                type="button"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
        {filtered.length} soirée{filtered.length !== 1 ? "s" : ""} trouvée
        {filtered.length !== 1 ? "s" : ""}
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
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((after) => (
            <article
              className="group flex flex-col gap-5 rounded-3xl border border-white/10 bg-coal p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ember/30"
              key={after.slug}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {after.isBoosted && (
                    <Badge className="border-none bg-ember/20 font-mono text-[9px] uppercase tracking-wider text-ember">
                      <Star className="mr-1 size-2.5 fill-current" />
                      Vedette
                    </Badge>
                  )}
                  <Badge
                    className="border-white/10 font-mono text-[9px] uppercase"
                    variant="outline"
                  >
                    {after.city}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-display text-2xl uppercase leading-tight text-paper">
                  {after.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-blood">
                  {after.dateLabel}
                </p>
              </div>

              <div className="space-y-1 text-sm text-paper-dim">
                <p>{after.venue}</p>
                <p className="font-display text-xl text-paper">
                  À partir de{" "}
                  <span className="text-ember">{after.priceFrom} EUR</span>
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="flex-1 h-11 bg-smoke border-white/5 hover:bg-ember hover:border-ember hover:text-paper transition-all"
                  variant="outline"
                >
                  <Link href={`/afters/${after.slug}`}>
                    Détails <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild className="flex-1 h-11" variant="outline">
                  <a href={after.ticketUrl} rel="noreferrer" target="_blank">
                    Billetterie <ExternalLink className="ml-2 size-4" />
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
