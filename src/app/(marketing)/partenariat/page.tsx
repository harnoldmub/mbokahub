import Link from "next/link";
import { ArrowRight, Handshake, Megaphone, Sparkles, Users } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";

const PARTNERSHIPS = [
  {
    icon: Megaphone,
    title: "Marques & sponsors",
    description:
      "Activation produit auprès de la diaspora. Du rhum à la cosmétique afro, on connecte ta marque à 9 000 fans en route pour le Stade de France.",
    contact: "partenariats@mbokahub.fr",
  },
  {
    icon: Users,
    title: "Médias & créateurs",
    description:
      "Échange de visibilité, contenu co-produit, accès presse aux afters partenaires, interviews backstage avec les pros référencés.",
    contact: "media@mbokahub.fr",
  },
  {
    icon: Sparkles,
    title: "Lieux & organisateurs",
    description:
      "Tu organises un after, un brunch, une expo ? Mets ton événement en avant et capte une audience ultra ciblée pour le 28 mai 2026.",
    contact: "afters@mbokahub.fr",
  },
];

export default function PartenariatPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-10vw] top-[20vh] font-display text-[25vw] text-paper opacity-[0.02] select-none leading-none uppercase -rotate-90">
          PARTENAIRES
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 space-y-20">
        <SectionHeading
          number="01"
          eyebrow="Partenariats"
          title="Travaille avec *Mboka Hub*."
          description="Une audience engagée, congolaise et diasporique, prête à vibrer pour Fally. Tes campagnes, nos canaux."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {PARTNERSHIPS.map((p) => (
            <div
              key={p.title}
              className="group relative rounded-3xl border border-white/5 bg-coal p-8 transition-all hover:border-blood/30"
            >
              <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-blood/10 text-blood">
                <p.icon className="size-6" />
              </div>
              <h3 className="font-display text-xl uppercase text-paper">{p.title}</h3>
              <p className="mt-3 text-sm text-paper-dim leading-relaxed">{p.description}</p>
              <a
                href={`mailto:${p.contact}`}
                className="mt-6 inline-block font-mono text-[10px] uppercase tracking-widest text-gold hover:text-paper"
              >
                {p.contact} →
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-blood/30 bg-gradient-to-br from-blood/10 to-transparent p-10 sm:p-16">
          <div className="flex items-start gap-6">
            <div className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-blood text-paper sm:flex">
              <Handshake className="size-7" />
            </div>
            <div className="space-y-6">
              <h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">
                Construisons quelque chose ensemble.
              </h2>
              <p className="max-w-2xl text-paper-dim">
                Décris-nous ton projet en quelques lignes. On revient vers toi sous 48h
                avec un plan d'activation sur-mesure.
              </p>
              <Button asChild size="lg" className="shadow-glow-blood">
                <Link href="/contact">
                  Démarrer la discussion <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
