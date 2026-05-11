import { ArrowRight, BarChart3, Eye, Target, Zap } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";

const FORMATS = [
  {
    name: "Top recherche",
    placement: "Prestataires — première rangée sponsorisée",
    impressions: "Selon ville + catégorie",
    price: "à partir de 49€ / semaine",
    badge: "PREMIUM",
  },
  {
    name: "Boost prestataire",
    placement: "Annuaire — remontée locale et badge sponsorisé",
    impressions: "Ciblage métier",
    price: "à partir de 8,99€",
    badge: "POPULAIRE",
  },
  {
    name: "Bannière locale",
    placement: "Ville, catégorie ou page service",
    impressions: "Ciblage géographique",
    price: "sur devis",
    badge: null,
  },
  {
    name: "Campagne partenaire",
    placement: "Newsletter, social, push événement",
    impressions: "Pack multi-canal",
    price: "sur devis",
    badge: null,
  },
];

const STATS = [
  { value: "0€", label: "Accès client et fiche pro" },
  { value: "20+", label: "Catégories de services" },
  { value: "Local", label: "Ciblage par ville et métier" },
  { value: "Boost", label: "Monétisation principale" },
];

export default function AdsPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-5vw] top-[15vh] font-display text-[28vw] text-blood opacity-[0.03] select-none leading-none uppercase">
          ADS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 space-y-20">
        <SectionHeading
          number="02"
          eyebrow="Espaces publicitaires"
          title="Achète de la visibilité utile."
          description="Les clients et prestataires utilisent Mboka Hub gratuitement. Les revenus viennent des boosts, placements sponsorisés et campagnes partenaires."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/5 bg-coal p-6 text-center"
            >
              <p className="font-display text-3xl text-gold lg:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-paper-mute">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl uppercase text-paper">
            Formats disponibles
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {FORMATS.map((f) => (
              <div
                key={f.name}
                className="rounded-2xl border border-white/5 bg-coal p-6 transition-colors hover:border-blood/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl uppercase text-paper">
                      {f.name}
                    </h3>
                    <p className="mt-1 text-sm text-paper-dim">{f.placement}</p>
                  </div>
                  {f.badge && (
                    <span className="rounded-full bg-blood/20 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-blood">
                      {f.badge}
                    </span>
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="flex items-center gap-2 text-xs text-paper-mute">
                    <Eye className="size-4" /> {f.impressions}
                  </span>
                  <span className="font-mono text-xs text-gold">{f.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Ciblage précis",
              text: "Ville, catégorie, métier, période et intention de réservation.",
            },
            {
              icon: BarChart3,
              title: "Reporting clair",
              text: "Impressions, clics, vues profil et conversion vers contact.",
            },
            {
              icon: Zap,
              title: "Mise en ligne rapide",
              text: "Boost immédiat pour les pros, campagne briefée pour les marques.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/5 bg-smoke/30 p-6"
            >
              <item.icon className="size-6 text-blood" />
              <h4 className="mt-4 font-display text-sm uppercase text-paper">
                {item.title}
              </h4>
              <p className="mt-2 text-sm text-paper-dim">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-blood/30 bg-blood/5 p-10 text-center sm:p-16">
          <h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">
            Lance ta visibilité sans bloquer l'accès gratuit.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper-dim">
            Les emplacements sont limités par ville et catégorie pour garder la
            plateforme lisible.
          </p>
          <Button asChild size="lg" className="mt-8 shadow-glow-blood">
            <Link href="/contact">
              Demander un devis <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
