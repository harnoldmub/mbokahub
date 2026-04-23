import {
  AlertTriangle,
  BedDouble,
  Car,
  CheckCircle2,
  ExternalLink,
  Info,
  MapPin,
  Phone,
  Train,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { parisClassics } from "@/lib/demo-data";

export const dynamic = "force-static";

const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; color: string; accent: string }
> = {
  Transports: {
    icon: Train,
    color: "text-sky-400",
    accent: "border-sky-500/30 bg-sky-500/5",
  },
  "Restos & marchés africains": {
    icon: UtensilsCrossed,
    color: "text-amber-400",
    accent: "border-amber-500/30 bg-amber-500/5",
  },
  "Hôtels proches stade": {
    icon: BedDouble,
    color: "text-violet-400",
    accent: "border-violet-500/30 bg-violet-500/5",
  },
  Parkings: {
    icon: Car,
    color: "text-emerald-400",
    accent: "border-emerald-500/30 bg-emerald-500/5",
  },
  "Infos stade": {
    icon: Info,
    color: "text-blood",
    accent: "border-blood/30 bg-blood/5",
  },
  "Numéros utiles": {
    icon: Phone,
    color: "text-rose-400",
    accent: "border-rose-500/30 bg-rose-500/5",
  },
};

const CATEGORY_ORDER = [
  "Infos stade",
  "Transports",
  "Restos & marchés africains",
  "Hôtels proches stade",
  "Parkings",
  "Numéros utiles",
];

const categories = CATEGORY_ORDER.filter((cat) =>
  parisClassics.some((c) => c.category === cat),
);

function categorySlug(cat: string) {
  return cat.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
}

export default function ParisClassicsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
          Guide pratique
        </p>
        <h1 className="mt-2 font-display text-6xl uppercase leading-[0.9] text-paper sm:text-7xl">
          Paris <span className="font-serif italic text-blood">pratique</span>
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg leading-relaxed text-paper-dim">
          Toutes les infos utiles pour les Warriors : arriver, manger, dormir et rentrer
          sereinement pour le concert de <span className="text-paper">Fally au Stade de France.</span>
        </p>
      </div>

      {/* Urgency banner */}
      <div className="mb-10 mt-8 flex flex-col gap-3 rounded-2xl border border-blood/20 bg-blood/5 p-5 sm:flex-row sm:items-center sm:gap-6">
        <AlertTriangle className="size-6 shrink-0 text-blood" />
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {[
            "Arriver 2h avant les portiques",
            "RER B ou D recommandé",
            "Hôtels à réserver maintenant",
            "Pas de bouteilles en verre",
          ].map((tip) => (
            <span
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-paper-dim"
              key={tip}
            >
              <CheckCircle2 className="size-3 text-blood" />
              {tip}
            </span>
          ))}
        </div>
      </div>

      {/* Category nav */}
      <nav
        aria-label="Catégories"
        className="sticky top-16 z-20 -mx-4 mb-12 flex gap-2 overflow-x-auto bg-ink/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const Icon = meta?.icon ?? MapPin;
          return (
            <a
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition hover:border-white/20 hover:bg-white/5 ${meta?.accent ?? "border-white/10"}`}
              href={`#${categorySlug(cat)}`}
              key={cat}
            >
              <Icon className={`size-3 ${meta?.color ?? "text-paper-mute"}`} />
              {cat}
            </a>
          );
        })}
      </nav>

      {/* Sections */}
      <div className="space-y-20">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const Icon = meta?.icon ?? MapPin;
          const items = parisClassics.filter((c) => c.category === cat);

          return (
            <section id={categorySlug(cat)} key={cat}>
              <div className="mb-7 flex items-center gap-4">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl border ${meta?.accent ?? "border-white/10 bg-white/5"}`}
                >
                  <Icon
                    className={`size-5 ${meta?.color ?? "text-paper-mute"}`}
                  />
                </div>
                <h2 className="font-display text-4xl uppercase leading-none text-paper">
                  {cat}
                </h2>
                <div className="h-px flex-1 bg-white/5" />
                <span className="font-mono text-[10px] text-paper-mute">
                  {items.length} entrée{items.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <article
                    className={`group relative flex flex-col gap-4 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 ${item.highlight ? `${meta?.accent ?? "border-white/10"} border` : "border-white/5 bg-smoke/20"}`}
                    key={item.id}
                  >
                    {/* Title row */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1">
                        {item.highlight && (
                          <span
                            className={`mb-2 inline-block font-mono text-[9px] uppercase tracking-widest ${meta?.color ?? "text-blood"}`}
                          >
                            ★ Recommandé
                          </span>
                        )}
                        {item.isSponsored && (
                          <span className="mb-2 inline-block font-mono text-[9px] uppercase tracking-widest text-amber-400">
                            Sponsorisé
                          </span>
                        )}
                        <h3 className="font-display text-xl uppercase leading-tight text-paper">
                          {item.name}
                        </h3>
                      </div>

                      {/* Phone badge */}
                      {item.phone && (
                        <a
                          className="flex shrink-0 items-center gap-2 rounded-full bg-blood/10 px-4 py-2 font-display text-xl text-blood transition hover:bg-blood/20"
                          href={`tel:${item.phone}`}
                        >
                          <Phone className="size-4" />
                          {item.phone}
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    <p className="font-body leading-relaxed text-paper-dim">
                      {item.description}
                    </p>

                    {/* Tip */}
                    {item.tip && (
                      <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
                        <p className="font-body text-sm leading-relaxed text-amber-200/80">
                          {item.tip}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex flex-col gap-1.5">
                        <p className="flex items-center gap-2 text-sm text-paper-mute">
                          <MapPin className="size-3.5 text-blood/60" />
                          {item.address}
                        </p>
                        {item.price && (
                          <p className="font-mono text-[11px] text-paper-mute">
                            {item.price}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <Badge
                            className="font-mono text-[9px] uppercase tracking-wider"
                            key={tag}
                            variant="secondary"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* External link */}
                    {item.link && (
                      <Link
                        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blood/60 transition hover:text-blood"
                        href={item.link}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <ExternalLink className="size-3" />
                        Site officiel
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom disclaimer */}
      <p className="mt-20 text-center font-mono text-[9px] uppercase tracking-widest text-paper/20">
        Informations à titre indicatif — vérifier les horaires et disponibilités
        avant le départ
      </p>
    </main>
  );
}
