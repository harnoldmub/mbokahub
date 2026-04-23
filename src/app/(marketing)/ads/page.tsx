import Link from "next/link";
import { ArrowRight, BarChart3, Eye, Target, Zap } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";

const FORMATS = [
  {
    name: "Hero Banner",
    placement: "Page d'accueil — au-dessus de la ligne de flottaison",
    impressions: "≈ 80 000 imp / mois",
    price: "à partir de 1 200€ / semaine",
    badge: "PREMIUM",
  },
  {
    name: "Sponsored Trajet",
    placement: "Top de la liste des trajets — épinglé",
    impressions: "≈ 25 000 imp / mois",
    price: "à partir de 350€ / semaine",
    badge: "POPULAIRE",
  },
  {
    name: "Pro Feature",
    placement: "Mise en avant dans /beauté ou /afters",
    impressions: "≈ 15 000 imp / mois",
    price: "à partir de 200€ / semaine",
    badge: null,
  },
  {
    name: "Newsletter Sponsor",
    placement: "Encart dédié dans l'envoi hebdo",
    impressions: "≈ 4 000 ouvertures",
    price: "450€ / envoi",
    badge: null,
  },
];

const STATS = [
  { value: "9 000+", label: "Fans attendus au Stade de France" },
  { value: "65%", label: "Audience 25-44 ans" },
  { value: "70%", label: "Femmes" },
  { value: "FR / BE / LU", label: "Zones géographiques actives" },
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
          title="Capte l'attention de la *diaspora congolaise*."
          description="Une plateforme verticale pour ton événement, ta marque, ton service. Tarifs transparents, pas d'enchères, pas d'algorithme opaque."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/5 bg-coal p-6 text-center"
            >
              <p className="font-display text-3xl text-gold lg:text-4xl">{s.value}</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-paper-mute">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl uppercase text-paper">Formats disponibles</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {FORMATS.map((f) => (
              <div
                key={f.name}
                className="rounded-2xl border border-white/5 bg-coal p-6 transition-colors hover:border-blood/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl uppercase text-paper">{f.name}</h3>
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
            { icon: Target, title: "Ciblage géographique", text: "Bruxelles, Paris, Lille, Lyon — choisis ta zone." },
            { icon: BarChart3, title: "Reporting clair", text: "Stats hebdo : impressions, clics, conversion vers WhatsApp." },
            { icon: Zap, title: "Mise en ligne 48h", text: "On briefe, on crée le visuel, on publie. Vite." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/5 bg-smoke/30 p-6">
              <item.icon className="size-6 text-blood" />
              <h4 className="mt-4 font-display text-sm uppercase text-paper">{item.title}</h4>
              <p className="mt-2 text-sm text-paper-dim">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-blood/30 bg-blood/5 p-10 text-center sm:p-16">
          <h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">
            Réserve ton espace avant que ça parte.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper-dim">
            Inventaire limité. Le concert approche, les meilleurs slots se réservent maintenant.
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
