import { ArrowRight, Camera, Car, CheckCircle2, MapPin, Music, Scissors, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Countdown } from "@/components/marketing/countdown";
import { Button } from "@/components/ui/button";
import { EVENT_CONTEXT } from "@/lib/constants";
import { fanModules, landingStats } from "@/lib/marketing-data";
import { nls } from "@/lib/nls";
import { cn } from "@/lib/utils";

const copy = nls.fr.home;

const modulePreviews = [
  {
    title: "Trajets",
    eyebrow: "Covoiturage",
    description: "Trouve tes places ou propose un trajet vers le stade.",
    href: "/trajets",
    icon: Car,
    span: "lg:col-span-2",
    color: "text-blood"
  },
  {
    title: "Beauté",
    eyebrow: "Services",
    description: "Maquillage, Coiffure et Barbier.",
    href: "/beaute/maquilleuses",
    icon: Scissors,
    span: "col-span-1",
    color: "text-gold"
  },
  {
    title: "Afters",
    eyebrow: "Nightlife",
    description: "Soirées et événements privés post-concert.",
    href: "/afters",
    icon: Music,
    span: "col-span-1",
    color: "text-ember"
  },
  {
    title: "Paris Pratique",
    eyebrow: "Guide",
    description: "Restos, hôtels et parkings utiles à proximité.",
    href: "/classiques-paris",
    icon: MapPin,
    span: "col-span-1",
    color: "text-paper"
  },
  {
    title: "Photographes",
    eyebrow: "Souvenirs",
    description: "Immortalise tes meilleurs moments.",
    href: "/beaute/photographes",
    icon: Camera,
    span: "col-span-1",
    color: "text-blood"
  },
] as const;

export default function HomePage() {
  return (
    <div className="relative">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <span className="absolute left-[-10vw] top-[20vh] select-none font-display text-[30vw] text-blood opacity-[0.03] leading-none uppercase">
          PARIS
        </span>
      </div>

      {/* HERO SECTION */}
      <section className="relative flex min-h-[90svh] flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/fally/fally-global-citizen.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-[0.12]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/60 to-ink/95" />
          <div className="absolute top-1/4 left-1/4 size-[500px] rounded-full bg-blood/10 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 size-[400px] rounded-full bg-ember/5 blur-[100px]" />
        </div>

        <div className="z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative">
              <div className="-top-24 -left-12 absolute hidden select-none font-display text-[15rem] text-blood opacity-[0.08] pointer-events-none sm:block">
                01
              </div>

              <div className="relative space-y-10">
                <span className="inline-block px-4 py-1 rounded-full border border-blood/20 bg-blood/10 font-mono text-[10px] text-blood uppercase tracking-[0.3em]">
                  {EVENT_CONTEXT.label}
                </span>

                <h1 className="font-display text-7xl text-paper uppercase leading-[0.9] tracking-normal sm:text-9xl lg:text-[10rem]">
                  MBOKA <br />
                  <span className="text-blood font-serif italic text-[0.85em] -ml-2">HUB</span>
                </h1>

                <p className="max-w-xl font-body text-lg text-paper-dim leading-relaxed sm:text-xl">
                  {copy.heroSubtitle}
                </p>

                <div className="flex flex-col gap-5 pt-4 sm:flex-row">
                  <Button asChild className="shadow-glow-blood h-16 px-10 text-lg" size="lg">
                    <Link href="/trajets">
                      {copy.primaryCta}
                      <ArrowRight className="ml-2 size-5 transition-transform group-hover/button:translate-x-2" />
                    </Link>
                  </Button>
                  <Button asChild className="h-16 px-10 text-lg bg-white/5 border-white/10 hover:bg-white/10" size="lg" variant="outline">
                    <Link href="/pro">{copy.proCta}</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative space-y-10 lg:translate-x-4">
              <div className="relative rotate-1 rounded-[2.5rem] border border-white/10 bg-coal p-2 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blood/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
                <Countdown targetDate={EVENT_CONTEXT.date} />
              </div>

              <div className="grid grid-cols-3 gap-5">
                {landingStats.map((stat) => (
                  <div
                    className="flex flex-col items-center rounded-3xl border border-white/5 bg-smoke/50 p-6 text-center group transition-all hover:bg-smoke hover:border-blood/30"
                    key={stat.label}
                  >
                    <span className="font-display text-4xl text-paper leading-none transition-transform group-hover:scale-110">
                      {stat.value}
                    </span>
                    <span className="mt-2 font-mono text-[9px] text-paper-mute uppercase tracking-[0.2em]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FALLY EN IMAGES — masqué temporairement */}
      {false && <section className="relative overflow-hidden px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end gap-6">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
                Fally Ipupa
              </p>
              <h2 className="font-display text-5xl uppercase tracking-tight text-paper sm:text-6xl">
                L&apos;artiste en images
              </h2>
            </div>
            <div className="mb-3 hidden h-px flex-1 bg-white/5 lg:block" />
          </div>

          <div className="grid gap-3">
            {/* Top row: main large image + portrait */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
              <div className="group relative h-[380px] overflow-hidden rounded-3xl lg:h-[480px]">
                <Image
                  src="/images/fally/fally-cameroun-2021.jpg"
                  alt="Fally Ipupa au Cameroun 2021"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <p className="absolute bottom-5 left-6 font-mono text-[9px] uppercase tracking-widest text-paper/50">
                  Cameroun 2021
                </p>
              </div>
              <div className="group relative h-[320px] overflow-hidden rounded-3xl lg:h-[480px]">
                <Image
                  src="/images/fally/fally-paris.jpg"
                  alt="Fally Ipupa à Paris"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <p className="absolute bottom-5 left-6 font-mono text-[9px] uppercase tracking-widest text-paper/50">
                  Paris
                </p>
              </div>
            </div>

            {/* Bottom row: three landscape images */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="group relative h-[240px] overflow-hidden rounded-3xl">
                <Image
                  src="/images/fally/fally-performance.jpg"
                  alt="Fally Ipupa en performance"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <p className="absolute bottom-5 left-6 font-mono text-[9px] uppercase tracking-widest text-paper/50">
                  En scène
                </p>
              </div>
              <div className="group relative h-[240px] overflow-hidden rounded-3xl">
                <Image
                  src="/images/fally/fally-afcon.jpg"
                  alt="Fally Ipupa AFCON 2021"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <p className="absolute bottom-5 left-6 font-mono text-[9px] uppercase tracking-widest text-paper/50">
                  AFCON 2021
                </p>
              </div>
              <div className="group relative h-[240px] overflow-hidden rounded-3xl">
                <Image
                  src="/images/fally/fally-2014.jpg"
                  alt="Fally Ipupa 2014"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <p className="absolute bottom-5 left-6 font-mono text-[9px] uppercase tracking-widest text-paper/50">
                  2014
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-right font-mono text-[8px] uppercase tracking-widest text-paper/20">
            Photos: Wikimedia Commons — CC BY-SA 4.0
          </p>
        </div>
      </section>}

      {/* MODULES BENTO GRID */}
      <section className="relative overflow-hidden bg-ink/50 px-6 py-40 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-blood text-5xl">02</span>
                <div className="h-px w-24 bg-blood/30" />
                <span className="font-mono text-[10px] text-paper-mute uppercase tracking-[0.3em]">Module Center</span>
              </div>
              <h2 className="font-display text-7xl text-paper uppercase leading-[0.85] tracking-tight sm:text-8xl">
                Tout est au <br />
                <span className="text-blood font-serif italic text-[0.9em]">même endroit.</span>
              </h2>
            </div>
            <p className="font-body text-paper-dim text-xl max-w-sm leading-relaxed italic">
              "L'écosystème ultime pour vivre l'événement sans stress, avec la force de la communauté."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {modulePreviews.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  href={module.href}
                  key={module.title}
                  className={cn(
                    "group relative overflow-hidden rounded-[3rem] bg-coal border border-white/10 p-10 transition-all duration-700 hover:border-blood/50 hover:-translate-y-3 hover:shadow-[0_50px_100px_-30px_rgba(230,57,70,0.25)]",
                    module.span
                  )}
                >
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] transition-all duration-1000 group-hover:opacity-10 group-hover:scale-150 group-hover:rotate-[15deg]">
                    <Icon className="size-56" />
                  </div>

                  <div className="relative z-10 space-y-8">
                    <div className={cn("size-14 rounded-2xl bg-smoke flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-blood shadow-glow-blood group-hover:shadow-glow-blood opacity-100", module.color)}>
                      <Icon className="size-7 group-hover:text-paper transition-colors" />
                    </div>
                    
                    <div>
                      <p className="font-mono text-[10px] text-paper-mute uppercase tracking-[0.3em] mb-3">
                        {module.eyebrow}
                      </p>
                      <h3 className="font-display text-5xl text-paper uppercase tracking-tighter">
                        {module.title}
                      </h3>
                    </div>

                    <p className="text-paper-dim text-lg leading-relaxed max-w-[280px] font-body">
                      {module.description}
                    </p>

                    <div className="flex items-center gap-3 font-mono text-[10px] text-blood uppercase tracking-widest opacity-0 -translate-x-6 transition-all duration-700 group-hover:opacity-100 group-hover:translate-x-0">
                      Explorer <ArrowRight className="size-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROS CALLOUT */}
      <section className="relative overflow-hidden border-white/5 border-y bg-coal py-32">
        <div className="absolute top-0 right-0 size-[800px] translate-x-1/2 -translate-y-1/2 rounded-full bg-blood/10 blur-[150px]" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between gap-16 px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-blood text-xs uppercase tracking-[0.4em]">Section Pros</span>
              <div className="h-px w-12 bg-blood/40" />
            </div>
            <h2 className="font-display text-6xl text-paper leading-[0.9] uppercase sm:text-8xl">
              Tu proposes <br />
              <span className="text-gold font-serif italic">un service ?</span>
            </h2>
            <p className="mt-8 text-xl text-paper-dim leading-relaxed max-w-xl font-body">
              Maquillage, Tresses, Covoiturage Pro ou Logistique... <br />
              Réserve ta place et sois visible auprès de 9 000 fans.
            </p>
          </div>
          <Button asChild className="h-20 px-14 text-xl shadow-glow-blood group" size="lg">
            <Link href="/pro">
              Devenir Partenaire <ArrowRight className="ml-3 size-6 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* QUICK LINKS SECTION */}
      <section className="px-6 py-32 lg:px-8 bg-ink/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="font-display text-4xl text-paper uppercase tracking-tight">Accès Rapide</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fanModules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-smoke/20 p-6 text-paper-dim transition-all hover:bg-smoke hover:border-blood/40 hover:text-paper"
                  href={module.href}
                  key={module.href}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-ink/50 flex items-center justify-center text-blood group-hover:scale-110 transition-transform">
                      <Icon className="size-5" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-widest">{module.title}</span>
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
