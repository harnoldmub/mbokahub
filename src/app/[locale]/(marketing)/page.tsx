import {
  ArrowRight,
  Camera,
  CarFront,
  MapPin,
  Plus,
  Scissors,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { EventHero } from "@/components/events/event-hero";
import { HeroSearch } from "@/components/marketing/hero-search";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { artists } from "@/lib/events";
import { getPublicEvents } from "@/lib/events.server";
import { localizedHref, type SearchParams } from "@/lib/nls";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Nevent — Découvre l’événement, organise toute ton expérience",
  description:
    "Concerts afro vérifiés en Europe, trajets, coiffure, beauté, photographes, services et afters : prépare toute ton expérience événementielle avec Nevent.",
  alternates: { canonical: "/fr" },
  openGraph: {
    title: "Nevent — Plus qu’un événement",
    description:
      "Découvre les événements afro à ne pas manquer et organise tout ce qui se passe autour.",
    images: ["/images/events/fally-ipupa-london-2026.webp"],
    url: "/fr",
  },
};

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<SearchParams>;
};
const services = [
  { label: "Coiffure", href: "/beaute/coiffeurs", icon: Scissors },
  { label: "Barbier", href: "/prestataires?q=barbier", icon: UserRound },
  { label: "Maquillage", href: "/beaute/maquilleuses", icon: Sparkles },
  { label: "Manucure", href: "/prestataires?q=ongles", icon: Store },
  { label: "Photographe", href: "/beaute/photographes", icon: Camera },
  { label: "Transport", href: "/trajets", icon: CarFront },
];

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [allEvents, pros, rides, afters] = await Promise.all([
    getPublicEvents(),
    prisma.proProfile
      .findMany({
        where: { isVerified: true },
        orderBy: [{ isBoosted: "desc" }, { rating: "desc" }],
        select: {
          id: true,
          displayName: true,
          category: true,
          city: true,
          photos: true,
        },
        take: 4,
      })
      .catch(() => []),
    prisma.trajet
      .findMany({
        where: { isApproved: true, isActive: true, date: { gte: new Date() } },
        orderBy: [{ isBoosted: "desc" }, { date: "asc" }],
        select: {
          id: true,
          villeDepart: true,
          villeArrivee: true,
          date: true,
          prix: true,
          placesDispo: true,
        },
        take: 3,
      })
      .catch(() => []),
    prisma.after
      .findMany({
        where: { isApproved: true, isActive: true, date: { gte: new Date() } },
        orderBy: [{ isBoosted: "desc" }, { date: "asc" }],
        select: { slug: true, name: true, city: true, venue: true },
        take: 3,
      })
      .catch(() => []),
  ]);
  const events = allEvents;
  const londonHero = allEvents.find(
    (event) => event.slug === "fally-ipupa-london-2026",
  );
  const brusselsHero = allEvents.find(
    (event) => event.slug === "fally-ipupa-bruxelles-11-decembre-2026",
  );
  const heroEvents = [
    londonHero,
    brusselsHero
      ? { ...brusselsHero, endDate: "2026-12-12T20:00:00+01:00" }
      : undefined,
  ].filter((event): event is NonNullable<typeof event> => Boolean(event));
  const spotlightEvents = [
    londonHero,
    brusselsHero,
    allEvents.find((event) => event.slug === "omah-lay-bruxelles-2026"),
  ].filter((event): event is NonNullable<typeof event> => Boolean(event));
  return (
    <main className="force-light min-h-screen overflow-hidden bg-white text-paper">
      <EventHero events={heroEvents} locale={locale} />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="À la une"
            title="Les événements à ne pas manquer."
            href={localizedHref("/evenements", locale)}
          />
          <div className="mt-10 flex snap-x gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
            {spotlightEvents.map((event, index) => (
              <div
                className="w-[86vw] shrink-0 snap-start sm:w-auto"
                key={event.slug}
              >
                <EventCard event={event} locale={locale} priority={index < 2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#f4f4f1] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blood">
            Que veux-tu faire ?
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Trouve ce qu’il te faut, là où tu vas.
          </h2>
          <div className="mt-2 max-w-4xl">
            <HeroSearch locale={locale} />
          </div>
          <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
            {services.map(({ label, href, icon: Icon }) => (
              <Link
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-black/15 bg-white px-4 text-sm font-semibold transition hover:border-blood hover:text-blood"
                href={localizedHref(href, locale)}
                key={label}
              >
                <Icon aria-hidden className="size-4" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionIntro
            dark
            eyebrow="Prochains événements"
            title="La scène afro, ville après ville."
            href={localizedHref("/evenements", locale)}
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(3).map((event) => (
              <Link
                className="group bg-black p-6 transition hover:bg-white/5"
                href={localizedHref(`/evenements/${event.slug}`, locale)}
                key={event.slug}
              >
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-blood">
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "short",
                  }).format(new Date(event.startDate))}
                </p>
                <h3 className="mt-8 text-3xl font-semibold">{event.artist}</h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-white/60">
                  <MapPin aria-hidden className="size-4" />
                  {event.city} · {event.venue}
                </p>
                <ArrowRight
                  aria-hidden
                  className="mt-8 size-5 transition-transform group-hover:translate-x-2"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="Prépare ton événement"
            title="Tout ce qu’il te faut avant le concert."
          />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {services.map(({ label, href, icon: Icon }) => (
              <Link
                className="group flex min-h-40 flex-col justify-between rounded-2xl border border-black/10 bg-[#f4f4f1] p-5 transition hover:-translate-y-1 hover:border-blood/50"
                href={localizedHref(href, locale)}
                key={label}
              >
                <Icon aria-hidden className="size-6 text-blood" />
                <span className="font-semibold">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#f4f4f1] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="Prestataires populaires"
            title="Des talents pour compléter ton expérience."
            href={localizedHref("/prestataires", locale)}
          />
          {pros.length ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pros.map((pro) => (
                <Link
                  className="group overflow-hidden rounded-2xl bg-white"
                  href={localizedHref(`/pro/${pro.id}`, locale)}
                  key={pro.id}
                >
                  <div className="relative aspect-square bg-neutral-200">
                    {pro.photos[0] ? (
                      <Image
                        alt={pro.displayName}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        src={pro.photos[0]}
                        unoptimized
                      />
                    ) : (
                      <div className="grid h-full place-items-center">
                        <Sparkles className="size-10 text-black/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold">{pro.displayName}</h3>
                    <p className="mt-1 text-sm text-paper-dim">
                      {pro.category.toLowerCase()} · {pro.city}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyInline
              text="Les prestataires vérifiés apparaîtront ici dès leur publication."
              href={localizedHref("/prestataires", locale)}
              cta="Explorer l’annuaire"
            />
          )}
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionIntro
                eyebrow="Trajets vers les événements"
                title="Tu vas au concert ? Pars avec la communauté."
                href={localizedHref("/trajets", locale)}
              />
              {rides.length ? (
                <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
                  {rides.map((ride) => (
                    <Link
                      className="flex min-h-24 items-center justify-between gap-4 py-4"
                      href={localizedHref(`/trajets/${ride.id}`, locale)}
                      key={ride.id}
                    >
                      <div>
                        <p className="font-semibold">
                          {ride.villeDepart} → {ride.villeArrivee}
                        </p>
                        <p className="mt-1 text-sm text-paper-dim">
                          {new Intl.DateTimeFormat("fr-FR", {
                            dateStyle: "medium",
                          }).format(ride.date)}{" "}
                          · {ride.placesDispo} places
                        </p>
                      </div>
                      <strong>{ride.prix} €</strong>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyInline
                  text="Aucun trajet événementiel disponible pour le moment."
                  href={localizedHref("/trajets/publier", locale)}
                  cta="Proposer un trajet"
                />
              )}
            </div>
            <div>
              <SectionIntro
                eyebrow="Afters & sorties"
                title="Et après ? Continue la soirée."
                href={localizedHref("/afters", locale)}
              />
              {afters.length ? (
                <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
                  {afters.map((after) => (
                    <Link
                      className="block py-5"
                      href={localizedHref(`/afters/${after.slug}`, locale)}
                      key={after.slug}
                    >
                      <p className="font-semibold">{after.name}</p>
                      <p className="mt-1 text-sm text-paper-dim">
                        {after.city} · {after.venue}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyInline
                  text="Aucun after référencé pour le moment."
                  href={localizedHref("/afters/organiser", locale)}
                  cta="Ajouter un after"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#f4f4f1] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="Artistes à suivre"
            title="Les artistes qui font vibrer la scène afro."
          />
          <div className="mt-10 flex snap-x gap-3 overflow-x-auto pb-4">
            {artists.map((artist, index) => {
              const hasEvent = events.some(
                (event) => event.artist === artist.name,
              );
              return (
                <article
                  className="flex min-h-64 w-64 shrink-0 snap-start flex-col justify-between rounded-2xl bg-black p-6 text-white"
                  key={artist.name}
                >
                  <span className="font-mono text-xs text-white/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-3xl font-semibold">{artist.name}</h3>
                    <p className="mt-2 text-sm text-white/60">
                      {artist.genre} · {artist.country}
                    </p>
                    <p className="mt-5 text-xs text-white/50">
                      {hasEvent
                        ? "Dates disponibles"
                        : "Pas de date disponible actuellement."}
                    </p>
                    {hasEvent ? (
                      <Link
                        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white"
                        href={localizedHref(
                          `/evenements?artiste=${encodeURIComponent(artist.name)}`,
                          locale,
                        )}
                      >
                        Voir les événements <ArrowRight className="size-4" />
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-blood py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 sm:px-6 lg:flex-row lg:items-end lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em]">
              Professionnels
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
              Ton savoir-faire fait partie de l’événement.
            </h2>
            <p className="mt-4 max-w-xl text-white/80">
              Crée gratuitement ta fiche, reçois des demandes et rends-toi
              visible auprès d’une communauté qui prépare ses sorties.
            </p>
          </div>
          <Button
            asChild
            className="min-h-12 shrink-0 bg-white text-black hover:bg-white/90"
            size="lg"
          >
            <Link href={localizedHref("/pro/inscrire", locale)}>
              Référencer mon activité <Plus className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function SectionIntro({
  eyebrow,
  title,
  href,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blood">
          {eyebrow}
        </p>
        <h2
          className={`mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl ${dark ? "text-white" : "text-paper"}`}
        >
          {title}
        </h2>
      </div>
      {href ? (
        <Link
          className={`inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold ${dark ? "text-white" : "text-paper"}`}
          href={href}
        >
          Tout voir <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
function EmptyInline({
  text,
  href,
  cta,
}: {
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
      <p className="text-paper-dim">{text}</p>
      <Link
        className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-paper hover:text-blood"
        href={href}
      >
        {cta}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
