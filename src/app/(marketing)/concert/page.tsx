import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Clock,
  ExternalLink,
  Headphones,
  MapPin,
  Music,
  Ticket,
  Train,
  Users,
} from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Countdown } from "@/components/marketing/countdown";
import { Button } from "@/components/ui/button";
import { EVENT_CONTEXT } from "@/lib/constants";

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M21.582 6.186a2.506 2.506 0 0 0-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418A2.506 2.506 0 0 0 2.418 6.186C2 7.746 2 12 2 12s0 4.254.418 5.814a2.506 2.506 0 0 0 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418a2.506 2.506 0 0 0 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

const TICKET_VENDORS = [
  {
    name: "Stade de France — billetterie officielle",
    url: "https://www.stadefrance.com/fr/calendrier/fally-ipupa",
    badge: "OFFICIEL",
    note: "Source primaire — toujours à privilégier",
  },
  {
    name: "Ticketmaster",
    url: "https://www.ticketmaster.fr/fr/recherche?q=fally+ipupa",
    badge: "REVENDEUR",
    note: "Distributeur officiel",
  },
  {
    name: "Fnac Spectacles",
    url: "https://www.fnacspectacles.com/recherche?q=fally+ipupa",
    badge: "REVENDEUR",
    note: "Distributeur officiel",
  },
  {
    name: "See Tickets",
    url: "https://www.seetickets.com/fr/search?q=fally+ipupa",
    badge: "REVENDEUR",
    note: "Distributeur officiel",
  },
];

const PRACTICAL_INFO = [
  {
    icon: CalendarDays,
    title: "Dates",
    value: "2 & 3 mai 2026",
    detail: "Samedi & dimanche",
  },
  {
    icon: Clock,
    title: "Horaires",
    value: "Ouverture 18h",
    detail: "Concert à 20h · fin vers 23h30",
  },
  {
    icon: MapPin,
    title: "Lieu",
    value: "Stade de France",
    detail: "Saint-Denis, 93 — France",
  },
  {
    icon: Users,
    title: "Capacité",
    value: "≈ 80 000 / soir",
    detail: "Plus de 9 000 fans diaspora attendus",
  },
];

const TRANSPORT = [
  {
    line: "RER B",
    detail: "Station « La Plaine — Stade de France » (10 min à pied)",
  },
  {
    line: "RER D",
    detail: "Station « Stade de France — Saint-Denis » (5 min à pied)",
  },
  {
    line: "Métro 13",
    detail: "Station « Saint-Denis — Porte de Paris » (15 min à pied)",
  },
  {
    line: "Voiture",
    detail: "Parkings limités · privilégie les trajets partagés (voir /trajets)",
  },
];

export const metadata = {
  title: "Concert Fally Ipupa — Stade de France 2 & 3 mai 2026 | Mboka Hub",
  description:
    "Toutes les infos pratiques du concert Fally Ipupa au Stade de France les 2 et 3 mai 2026 : billetterie officielle, horaires, transports, FAQ.",
};

export default function ConcertPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-10vw] top-[15vh] font-display text-[28vw] text-blood opacity-[0.03] select-none leading-none uppercase">
          CONCERT
        </span>
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <SectionHeading
              number="00"
              eyebrow="Évènement"
              title="Fally Ipupa au *Stade de France*."
              description="L'évènement de l'année pour la diaspora congolaise. Deux soirs, un seul stade, une histoire à écrire ensemble."
            />

            <div className="rounded-2xl border border-blood/30 bg-blood/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-blood" />
                <div>
                  <p className="font-display text-sm uppercase text-paper">
                    Important — site indépendant
                  </p>
                  <p className="mt-1 text-xs text-paper-dim leading-relaxed">
                    Mboka Hub n'est pas affilié à Fally Ipupa, à Gérard Drouot
                    Productions ou au Stade de France. Vérifie toujours les infos
                    officielles avant tout achat.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-coal p-2 shadow-2xl">
              <Countdown targetDate={EVENT_CONTEXT.date} />
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-coal shadow-2xl">
              <Image
                src="/images/fally/affiche-concert.webp"
                alt="Affiche officielle du concert Fally Ipupa au Stade de France"
                width={900}
                height={1200}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 space-y-12">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            Infos pratiques
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase text-paper sm:text-4xl">
            Tout ce qu'il faut savoir.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRACTICAL_INFO.map((info) => (
            <div
              key={info.title}
              className="rounded-2xl border border-white/5 bg-coal p-6"
            >
              <info.icon className="size-6 text-blood" />
              <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-paper-mute">
                {info.title}
              </p>
              <p className="mt-1 font-display text-xl uppercase text-paper">
                {info.value}
              </p>
              <p className="mt-1 text-xs text-paper-dim">{info.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 space-y-8">
        <div className="flex items-center gap-3">
          <Ticket className="size-7 text-blood" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
              Billetterie
            </p>
            <h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">
              Où acheter ton billet
            </h2>
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5">
          <p className="text-sm text-yellow-200">
            ⚠️ N'achète <strong>jamais</strong> ton billet sur les réseaux sociaux ou en
            main propre à un inconnu. Les arnaques se multiplient — passe uniquement
            par les sites officiels ci-dessous.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TICKET_VENDORS.map((vendor) => (
            <a
              key={vendor.url}
              href={vendor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-4 rounded-2xl border border-white/5 bg-coal p-6 transition-colors hover:border-blood/30"
            >
              <div className="space-y-2">
                <span
                  className={`inline-block rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest ${
                    vendor.badge === "OFFICIEL"
                      ? "bg-blood/20 text-blood"
                      : "bg-white/5 text-paper-mute"
                  }`}
                >
                  {vendor.badge}
                </span>
                <p className="font-display text-lg text-paper">{vendor.name}</p>
                <p className="text-xs text-paper-dim">{vendor.note}</p>
              </div>
              <ExternalLink className="mt-1 size-5 shrink-0 text-paper-mute transition-transform group-hover:translate-x-1 group-hover:text-blood" />
            </a>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 space-y-8">
        <div className="flex items-center gap-3">
          <Train className="size-7 text-blood" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
              Y aller
            </p>
            <h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">
              Comment se rendre au stade
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TRANSPORT.map((t) => (
            <div
              key={t.line}
              className="flex items-start gap-4 rounded-2xl border border-white/5 bg-coal p-5"
            >
              <span className="font-display text-lg uppercase text-blood shrink-0">
                {t.line}
              </span>
              <span className="text-sm text-paper-dim">{t.detail}</span>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blood/10 to-transparent p-8 sm:p-12">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-2xl uppercase text-paper sm:text-3xl">
                Pas de voiture ? Voyage en covoit'
              </h3>
              <p className="mt-2 max-w-lg text-paper-dim">
                Plus de 200 trajets depuis Bruxelles, Lille, Lyon et toute l'Europe.
                Diaspora qui se serre les coudes.
              </p>
            </div>
            <Button asChild size="lg" className="shadow-glow-blood">
              <Link href="/trajets">
                Voir les trajets <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 space-y-8">
        <div className="flex items-center gap-3">
          <Music className="size-7 text-blood" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
              L'artiste
            </p>
            <h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">
              Fally Ipupa, en quelques chiffres
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: "20+", l: "Années de carrière solo" },
            { v: "10", l: "Albums studio" },
            { v: "1B+", l: "Streams cumulés" },
            { v: "Bercy x2", l: "Stades remplis avant SDF" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-white/5 bg-smoke/30 p-6 text-center"
            >
              <p className="font-display text-3xl text-gold lg:text-4xl">{s.v}</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-paper-mute">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 space-y-8">
        <div className="flex items-center gap-3">
          <Headphones className="size-7 text-blood" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
              Vibe avec lui
            </p>
            <h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">
              Écoute Fally en attendant
            </h2>
            <p className="mt-2 max-w-2xl text-paper-dim">
              Chauffe l'ambiance avec la playlist officielle Spotify et abonne-toi à
              sa chaîne YouTube pour ne rien rater des derniers clips.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-coal shadow-2xl">
            <iframe
              title="Playlist Spotify Fally Ipupa"
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO3XZfhO?utm_source=generator&theme=0"
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
              loading="lazy"
              className="block"
            />
          </div>

          <a
            href="https://www.youtube.com/channel/UCBFYkrVI8OfHm9PzbAGFqlA"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blood/15 via-coal to-coal p-8 transition-colors hover:border-blood/40"
          >
            <div className="flex items-center gap-3">
              <YoutubeIcon className="size-10 text-blood" />
              <span className="rounded-full bg-blood/20 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-blood">
                Officiel
              </span>
            </div>

            <div className="space-y-3">
              <p className="font-display text-2xl uppercase text-paper sm:text-3xl">
                Chaîne YouTube de Fally Ipupa
              </p>
              <p className="text-sm text-paper-dim">
                Clips, lives, coulisses & dernières sorties. Abonne-toi pour
                vivre la route vers le Stade de France.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-paper transition-transform group-hover:translate-x-1">
              S'abonner <ArrowRight className="size-4 text-blood" />
            </div>
          </a>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-blood/30 bg-blood/5 p-10 text-center sm:p-16">
          <h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">
            Prépare ton week-end avec Mboka Hub
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-paper-dim">
            Trajets, beauté, photographes, afters : tout ce qu'il faut pour vivre les
            2 & 3 mai à fond.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="shadow-glow-blood">
              <Link href="/#prestations">
                Découvrir les prestations <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/faq">FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
