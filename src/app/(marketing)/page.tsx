import {
  ArrowRight,
  Camera,
  Car,
  Gamepad2,
  MapPin,
  MessageCircle,
  Music,
  PartyPopper,
  Scissors,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AppTile } from "@/components/marketing/app-tile";
import { Countdown } from "@/components/marketing/countdown";
import { Button } from "@/components/ui/button";
import { EVENT_CONTEXT } from "@/lib/constants";
import {
  getLocaleFromSearchParams,
  localizedHref,
  nls,
  type SearchParams,
} from "@/lib/nls";

type HomePageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].appHome;
  const qg = nls[locale].quizGame;

  const tiles = [
    {
      key: "trajets",
      href: "/trajets",
      icon: Car,
      accent: "blood" as const,
      ...copy.tiles.trajets,
    },
    {
      key: "prestataires",
      href: "/prestataires",
      icon: Scissors,
      accent: "gold" as const,
      ...copy.tiles.prestataires,
    },
    {
      key: "communaute",
      href: "/communaute",
      icon: MessageCircle,
      accent: "emerald" as const,
      ...copy.tiles.communaute,
    },
    {
      key: "afters",
      href: "/afters",
      icon: PartyPopper,
      accent: "ember" as const,
      ...copy.tiles.afters,
    },
    {
      key: "concert",
      href: "/concert",
      icon: Ticket,
      accent: "blood" as const,
      ...copy.tiles.concert,
    },
    {
      key: "paris",
      href: "/classiques-paris",
      icon: MapPin,
      accent: "paper" as const,
      ...copy.tiles.paris,
    },
    {
      key: "playlists",
      href: "/playlists",
      icon: Music,
      accent: "violet" as const,
      ...copy.tiles.playlists,
    },
    {
      key: "jeu",
      href: "/jeu",
      icon: Gamepad2,
      accent: "gold" as const,
      ...copy.tiles.jeu,
    },
  ];

  return (
    <div className="relative">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[80vh] bg-[radial-gradient(circle_at_25%_15%,rgba(229,9,20,0.18),transparent_45%),radial-gradient(circle_at_75%_25%,rgba(242,183,5,0.10),transparent_45%)]" />
        <span className="absolute -left-[5vw] top-[40vh] hidden select-none font-display text-[28vw] uppercase leading-none text-blood/[0.025] sm:block">
          PARIS
        </span>
      </div>

      {/* HERO — compact mobile-first */}
      <section className="relative z-10 px-5 pb-10 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blood/30 bg-blood/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-blood">
            <span className="size-1.5 animate-pulse rounded-full bg-blood" />
            {copy.hero.eyebrow}
          </span>

          <h1 className="mt-6 font-display text-6xl uppercase leading-[0.9] tracking-tight text-paper sm:text-7xl lg:text-8xl">
            Mboka <span className="font-serif italic text-blood">Hub</span>
          </h1>

          <p className="mt-5 max-w-xl font-body text-base text-paper-dim sm:text-lg">
            {copy.hero.subtitle}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-14 px-8 shadow-glow-blood">
              <Link href="#tiles">
                {copy.hero.primaryCta}
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 border-white/15 bg-white/5 px-8 hover:bg-white/10"
            >
              <Link href={localizedHref("/pro", locale)}>
                {copy.hero.proCta}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN strip — minimal */}
      <section className="relative z-10 px-5 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-coal/70 p-4 backdrop-blur sm:p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute">
              {copy.hero.countdown}
            </p>
            <Countdown targetDate={EVENT_CONTEXT.date} />
          </div>
        </div>
      </section>

      {/* TILES GRID — the mobile-app heart */}
      <section
        id="tiles"
        className="relative z-10 scroll-mt-24 px-5 pb-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
                {copy.tilesEyebrow}
              </p>
              <h2 className="mt-2 font-display text-3xl uppercase leading-tight tracking-tight text-paper sm:text-4xl lg:text-5xl">
                {copy.tilesTitle}
              </h2>
              <p className="mt-3 max-w-md text-sm text-paper-dim sm:text-base">
                {copy.tilesDescription}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {tiles.map((t) => (
              <AppTile
                key={t.key}
                href={localizedHref(t.href, locale)}
                icon={t.icon}
                label={t.label}
                hint={t.hint}
                accent={t.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONCERT card — affiche + CTAs, compact */}
      <section className="relative z-10 px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-coal via-coal to-blood/10">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative aspect-[4/5] w-full lg:aspect-auto">
                <Image
                  src="/images/fally/affiche-concert.webp"
                  alt="Fally Ipupa au Stade de France"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" />
              </div>

              <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
                  {EVENT_CONTEXT.label}
                </p>
                <h2 className="font-display text-3xl uppercase leading-tight text-paper sm:text-4xl">
                  Fally Ipupa
                  <br />
                  <span className="font-serif italic text-blood">
                    Stade de France
                  </span>
                </h2>
                <ul className="space-y-1.5 text-sm text-paper-dim">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blood" />
                    Sam. 02 & dim. 03 mai 2026
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blood" />
                    Saint-Denis · 18h ouverture
                  </li>
                </ul>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <Button asChild className="shadow-glow-blood">
                    <Link href={localizedHref("/concert", locale)}>
                      Infos & billetterie
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href="https://www.stadefrance.com/fr/calendrier/fally-ipupa"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Site officiel
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ + JEU compact */}
      <section className="relative z-10 px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2">
          <Link
            href={localizedHref("/jeu", locale)}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blood/15 via-coal to-coal p-6 transition hover:-translate-y-1 hover:border-blood/40 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-4 -top-4 text-7xl opacity-10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 sm:text-8xl">
              🎮
            </div>
            <span className="rounded-full bg-blood/20 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-blood">
              {qg.gameBadge}
            </span>
            <h3 className="mt-4 font-display text-2xl uppercase leading-none text-paper sm:text-3xl">
              {qg.gameTitle}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-paper-dim">
              {qg.gameDescription}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-blood transition-transform group-hover:translate-x-1">
              {qg.gameCta} <ArrowRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href={localizedHref("/quiz", locale)}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gold/15 via-coal to-coal p-6 transition hover:-translate-y-1 hover:border-gold/40 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-4 -top-4 text-7xl opacity-10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 sm:text-8xl">
              🧠
            </div>
            <span className="rounded-full bg-gold/20 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-gold">
              {qg.quizBadge}
            </span>
            <h3 className="mt-4 font-display text-2xl uppercase leading-none text-paper sm:text-3xl">
              {qg.quizTitle}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-paper-dim">
              {qg.quizDescription}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-gold transition-transform group-hover:translate-x-1">
              {qg.quizCta} <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* PRO banner — single horizontal card */}
      <section className="relative z-10 px-5 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-blood/20 bg-gradient-to-br from-coal via-coal to-blood/15 p-7 sm:p-10">
            <div className="absolute -right-12 -top-12 size-64 rounded-full bg-blood/10 blur-3xl" />
            <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
                  {copy.proSection.eyebrow}
                </p>
                <h2 className="font-display text-3xl uppercase leading-tight text-paper sm:text-4xl">
                  {copy.proSection.title}
                </h2>
                <p className="text-sm text-paper-dim sm:text-base">
                  {copy.proSection.subtitle}
                </p>
              </div>
              <Button asChild size="lg" className="h-14 px-8 shadow-glow-blood">
                <Link href={localizedHref("/pro", locale)}>
                  {copy.proSection.cta}
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
