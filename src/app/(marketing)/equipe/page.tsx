import Link from "next/link";
import { ArrowRight, AtSign, Mail, MessageCircle } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";

const TEAM = [
  {
    name: "Mboka Hub Studio",
    role: "Direction artistique & produit",
    bio: "Le collectif derrière la plateforme. Designers, devs et passionnés de musique congolaise basés à Bruxelles et Paris.",
    initials: "MH",
    color: "bg-blood",
  },
  {
    name: "Communauté",
    role: "Pros, drivers, organisateurs",
    bio: "Sans vous, pas de plateforme. Plus de 200 contributeurs vérifiés font vivre Mboka Hub au quotidien.",
    initials: "CO",
    color: "bg-gold",
  },
  {
    name: "Modération",
    role: "Vérification & sécurité",
    bio: "Une équipe dédiée vérifie chaque trajet, chaque profil pro, et traite les signalements en moins de 24h.",
    initials: "MO",
    color: "bg-emerald-600",
  },
];

const VALUES = [
  {
    title: "Transparence",
    text: "Pas de commission cachée. On affiche les prix, les contacts, les avis. Le client choisit.",
  },
  {
    title: "Diaspora first",
    text: "On parle votre langue, on connaît vos quartiers. Conçu par et pour la communauté congolaise d'Europe.",
  },
  {
    title: "Sécurité",
    text: "Vérification manuelle des annonces. Système de signalement rapide. Pas de tolérance pour les arnaques.",
  },
  {
    title: "Indépendance",
    text: "Site non-affilié à Fally Ipupa ou ses producteurs. Plateforme communautaire, libre, sans agenda caché.",
  },
];

export default function EquipePage() {
  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-10vw] top-[20vh] font-display text-[25vw] text-paper opacity-[0.02] select-none leading-none uppercase -rotate-90">
          ÉQUIPE
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 space-y-20">
        <SectionHeading
          number="03"
          eyebrow="Qui on est"
          title="Une équipe qui *vibre* pour la culture."
          description="Un projet né d'un constat : la diaspora congolaise méritait un outil propre pour préparer l'événement musical de l'année."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border border-white/5 bg-coal p-8 transition-colors hover:border-blood/30"
            >
              <div
                className={`flex size-20 items-center justify-center rounded-2xl ${member.color} font-display text-2xl text-paper`}
              >
                {member.initials}
              </div>
              <h3 className="mt-6 font-display text-xl uppercase text-paper">{member.name}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gold">
                {member.role}
              </p>
              <p className="mt-4 text-sm text-paper-dim leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/5 bg-smoke/30 p-10 sm:p-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            Nos valeurs
          </p>
          <h2 className="mt-3 font-display text-3xl uppercase text-paper sm:text-4xl">
            Ce qui nous fait avancer.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="border-l-2 border-blood/40 pl-5">
                <h4 className="font-display text-sm uppercase text-paper">{v.title}</h4>
                <p className="mt-2 text-sm text-paper-dim leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <a
            href="mailto:hello@mbokahub.fr"
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-coal p-5 hover:border-blood/30"
          >
            <Mail className="size-5 text-blood" />
            <span className="text-sm text-paper">hello@mbokahub.fr</span>
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-coal p-5 hover:border-blood/30"
          >
            <AtSign className="size-5 text-blood" />
            <span className="text-sm text-paper">@mbokahub</span>
          </a>
          <a
            href="https://wa.me/32000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-coal p-5 hover:border-blood/30"
          >
            <MessageCircle className="size-5 text-blood" />
            <span className="text-sm text-paper">WhatsApp</span>
          </a>
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">
              Nous contacter <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
