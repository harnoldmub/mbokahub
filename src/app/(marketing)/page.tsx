import {
  ArrowRight,
  Camera,
  Car,
  CheckCircle2,
  Gamepad2,
  MapPin,
  Music,
  Scissors,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Countdown } from "@/components/marketing/countdown";
import { Button } from "@/components/ui/button";
import { EVENT_CONTEXT } from "@/lib/constants";
import { landingStats } from "@/lib/marketing-data";
import {
  getLocaleFromSearchParams,
  localizedHref,
  nls,
  type SearchParams,
} from "@/lib/nls";
import { cn } from "@/lib/utils";

type HomePageProps = {
  searchParams?: Promise<SearchParams>;
};

const moduleMeta = [
  { href: "/trajets", icon: Car, span: "lg:col-span-2", color: "text-blood" },
  { href: "/beaute", icon: Scissors, span: "col-span-1", color: "text-gold" },
  { href: "/afters", icon: Music, span: "col-span-1", color: "text-ember" },
  {
    href: "/classiques-paris",
    icon: MapPin,
    span: "col-span-1",
    color: "text-paper",
  },
  {
    href: "/merch",
    icon: ShoppingBag,
    span: "col-span-1",
    color: "text-blood",
  },
  {
    href: "/beaute/photographes",
    icon: Camera,
    span: "col-span-1",
    color: "text-violet-400",
  },
] as const;

export default async function HomePage({ searchParams }: HomePageProps) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].home;
  const common = nls[locale].common;
  const modulePreviews = moduleMeta.map((meta, index) => ({
    ...meta,
    ...copy.modules[index],
  }));
  const translatedStats = [
    { ...landingStats[0], label: copy.stats.audience },
    { ...landingStats[1], label: copy.stats.city },
    { ...landingStats[2], label: copy.stats.dates },
  ];
  const quickLinks = [
    { href: "/trajets", title: copy.modules[0].title, icon: Car },
    { href: "/beaute", title: copy.modules[1].title, icon: Scissors },
    { href: "/afters", title: copy.modules[2].title, icon: Music },
    { href: "/classiques-paris", title: copy.modules[3].title, icon: MapPin },
    { href: "/merch", title: copy.modules[4].title, icon: ShoppingBag },
    {
      href: "/beaute/photographes",
      title: copy.modules[5].title,
      icon: Camera,
    },
    { href: "/quiz", title: common.nav.quiz, icon: Sparkles },
    { href: "/jeu", title: "Sape Run", icon: Gamepad2 },
  ] as const;

  return (
    <div className="relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <span className="absolute left-[-10vw] top-[20vh] select-none font-display text-[30vw] text-blood opacity-[0.03] leading-none uppercase">
          PARIS
        </span>
      </div>

      <section className="relative flex min-h-[90svh] flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(230,57,70,0.22),transparent_32%),radial-gradient(circle_at_78%_28%,rgba(242,183,5,0.14),transparent_28%),linear-gradient(180deg,rgba(10,10,10,0.72),#0a0a0a)]" />
          <div className="absolute left-1/2 top-1/2 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 bg-coal/30 blur-3xl" />
        </div>

        <div className="z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative space-y-10">
              <span className="inline-block rounded-full border border-blood/20 bg-blood/10 px-4 py-1 font-mono text-[10px] text-blood uppercase tracking-[0.3em]">
                {EVENT_CONTEXT.label}
              </span>

              <h1 className="font-display text-7xl text-paper uppercase leading-[0.9] tracking-normal sm:text-9xl lg:text-[10rem]">
                MBOKA <br />
                <span className="-ml-2 font-serif text-[0.85em] text-blood italic">
                  HUB
                </span>
              </h1>

              <p className="max-w-xl font-body text-lg text-paper-dim leading-relaxed sm:text-xl">
                {copy.heroSubtitle}
              </p>

              <div className="flex flex-col gap-5 pt-4 sm:flex-row">
                <Button
                  asChild
                  className="h-16 px-10 text-lg shadow-glow-blood"
                  size="lg"
                >
                  <Link href="#prestations">
                    {copy.primaryCta}
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-16 border-white/10 bg-white/5 px-10 text-lg hover:bg-white/10"
                  size="lg"
                  variant="outline"
                >
                  <Link href={localizedHref("/pro", locale)}>
                    {copy.proCta}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative space-y-10 lg:translate-x-4">
              <div className="group relative -rotate-1 overflow-hidden rounded-[2rem] border border-white/10 bg-coal shadow-2xl">
                <Image
                  src="/images/fally/affiche-concert.webp"
                  alt="Affiche du concert de Fally Ipupa au Stade de France — 28 mai 2026"
                  width={900}
                  height={1200}
                  priority
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-ink/70 px-4 py-2 backdrop-blur">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-blood">
                    Stade de France
                  </span>
                  <span className="font-display text-xs uppercase text-paper">
                    28.05.2026
                  </span>
                </div>
              </div>

              <div className="relative rotate-1 overflow-hidden rounded-[2.5rem] border border-white/10 bg-coal p-2 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blood/20 via-transparent to-gold/10" />
                <Countdown targetDate={EVENT_CONTEXT.date} />
              </div>

              <div className="grid grid-cols-3 gap-5">
                {translatedStats.map((stat) => (
                  <div
                    className="group flex flex-col items-center rounded-3xl border border-white/5 bg-smoke/50 p-6 text-center transition-all hover:border-blood/30 hover:bg-smoke"
                    key={stat.label}
                  >
                    <span className="font-display text-4xl text-paper leading-none">
                      {stat.value}
                    </span>
                    <span className="mt-2 font-mono text-[9px] text-paper-mute uppercase tracking-[0.2em]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mx-auto flex max-w-xs justify-center opacity-70">
                <Image
                  alt="Mboka Hub"
                  className="h-auto w-28"
                  height={112}
                  src="/logo.svg"
                  width={112}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-ink/50 px-6 py-24 lg:px-8 lg:py-32"
        id="prestations"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-4">
                <span className="font-display text-5xl text-blood">02</span>
                <div className="h-px w-20 bg-blood/30" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                  {copy.prestationsLabel}
                </span>
              </div>
              <h2 className="font-display text-6xl uppercase leading-[0.88] tracking-normal text-paper sm:text-7xl lg:text-8xl">
                {copy.modulesTitleLine1} <br />
                <span className="font-serif italic text-blood text-[0.9em]">
                  {copy.modulesTitleLine2}
                </span>
              </h2>
            </div>
            <p className="max-w-sm font-body text-lg italic leading-relaxed text-paper-dim lg:text-xl">
              {copy.modulesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modulePreviews.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-coal p-8 transition-all duration-500 hover:-translate-y-2 hover:border-blood/40 hover:shadow-[0_40px_80px_-20px_rgba(230,57,70,0.2)]",
                    module.span,
                  )}
                  href={localizedHref(module.href, locale)}
                  key={module.href}
                >
                  <div className="pointer-events-none absolute right-0 top-0 p-8 opacity-[0.03] transition-all duration-700 group-hover:opacity-[0.07] group-hover:scale-125 group-hover:rotate-6">
                    <Icon className="size-48" />
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex size-12 items-center justify-center rounded-2xl bg-smoke transition-all duration-300 group-hover:scale-110 group-hover:bg-blood",
                          module.color,
                        )}
                      >
                        <Icon className="size-6 transition-colors group-hover:text-paper" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                        {module.eyebrow}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-4xl uppercase leading-none tracking-normal text-paper">
                        {module.title}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-paper-mute">
                        {module.description}
                      </p>
                    </div>

                    <ul className="flex-1 space-y-2">
                      {module.features.map((feature) => (
                        <li
                          className="flex items-start gap-2.5 text-sm text-paper-dim"
                          key={feature}
                        >
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-blood/60" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-blood transition-all duration-300 group-hover:gap-3">
                      {module.cta}
                      <ArrowRight className="size-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-white/5 border-y bg-coal py-32">
        <div className="absolute top-0 right-0 size-[800px] translate-x-1/2 -translate-y-1/2 rounded-full bg-blood/10 blur-[150px]" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between gap-16 px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="font-mono text-blood text-xs uppercase tracking-[0.4em]">
                {copy.proEyebrow}
              </span>
              <div className="h-px w-12 bg-blood/40" />
            </div>
            <h2 className="font-display text-6xl text-paper leading-[0.9] uppercase sm:text-8xl">
              {copy.proTitleLine1} <br />
              <span className="font-serif text-gold italic">
                {copy.proTitleLine2}
              </span>
            </h2>
            <p className="mt-8 max-w-xl text-xl text-paper-dim leading-relaxed font-body">
              {copy.proDescription}
            </p>
          </div>
          <Button
            asChild
            className="h-20 px-14 text-xl shadow-glow-blood group"
            size="lg"
          >
            <Link href={localizedHref("/pro", locale)}>
              {copy.proButton}
              <ArrowRight className="ml-3 size-6" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-ink/30 px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-center gap-6">
            <h2 className="font-display text-4xl text-paper uppercase tracking-normal">
              {copy.quickLinks}
            </h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-smoke/20 p-6 text-paper-dim transition-all hover:border-blood/40 hover:bg-smoke hover:text-paper"
                  href={localizedHref(module.href, locale)}
                  key={module.href}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-ink/50 flex items-center justify-center text-blood group-hover:scale-110 transition-transform">
                      <Icon className="size-5" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-widest">
                      {module.title}
                    </span>
                  </div>
                  <ArrowRight className="size-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-blood" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
