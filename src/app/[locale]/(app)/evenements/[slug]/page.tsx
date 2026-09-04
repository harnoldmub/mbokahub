import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  CarFront,
  ExternalLink,
  MapPin,
  Scissors,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/events/event-card";
import { prisma } from "@/lib/db/prisma";
import { getPublicEvent, getPublicEvents } from "@/lib/events.server";
import { languageOf, localizedHref, nls } from "@/lib/nls";
import { proCategoryLabel } from "@/lib/pro-display";
import { createPageMetadata, getSiteUrl } from "@/lib/seo";
export const dynamic = "force-dynamic";

const citySlugs: Record<string, string> = {
  londres: "Londres",
  bruxelles: "Bruxelles",
  paris: "Paris",
};
const services = [
  { key: "hair", href: "/beaute/coiffeurs", icon: Scissors },
  { key: "barber", href: "/prestataires?q=barbier", icon: UserRound },
  { key: "makeup", href: "/beaute/maquilleuses", icon: Sparkles },
  { key: "nails", href: "/prestataires?q=ongles", icon: Store },
  { key: "photo", href: "/beaute/photographes", icon: Camera },
  { key: "transport", href: "/trajets", icon: CarFront },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const city = citySlugs[slug];
  if (city)
    return createPageMetadata({
      title: `Événements afro à ${city}`,
      description: `Découvre les événements afro vérifiés à ${city} et organise trajets, beauté, photo et sorties avec Nevent.`,
      path: `/evenements/${slug}`,
      locale,
    });
  const event = await getPublicEvent(slug);
  if (!event) return {};
  const year = new Date(event.startDate).getFullYear();
  return createPageMetadata({
    title: `${event.artist} à ${event.city} ${year} — ${event.venue}`,
    description: event.description,
    path: `/evenements/${event.slug}`,
    locale,
    image: event.image,
    imageAlt: event.imageAlt,
    keywords: [
      `${event.artist} ${event.city} ${year}`,
      `${event.artist} ${event.venue}`,
      ...event.genres,
      "billetterie concert afro",
    ],
  });
}

export default async function EventOrCityPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const city = citySlugs[slug];
  if (city) return <CityLanding city={city} locale={locale} />;
  const event = await getPublicEvent(slug);
  if (!event) notFound();
  const dayStart = new Date(event.startDate);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(event.endDate ?? event.startDate);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
  dayEnd.setUTCHours(23, 59, 59, 999);
  const lang = languageOf(locale);
  const t = nls[lang].eventDetail;
  const serviceLabels = nls[lang].search.services;
  const [pros, rides, afters] = await Promise.all([
    prisma.proProfile
      .findMany({
        where: {
          isVerified: true,
          city: { contains: event.city, mode: "insensitive" },
        },
        orderBy: [{ isBoosted: "desc" }, { rating: "desc" }],
        select: { id: true, displayName: true, category: true, city: true },
        take: 6,
      })
      .catch(() => []),
    prisma.trajet
      .findMany({
        where: {
          isApproved: true,
          isActive: true,
          villeArrivee: { contains: event.city, mode: "insensitive" },
          date: { gte: dayStart, lte: dayEnd },
        },
        orderBy: [{ isBoosted: "desc" }, { date: "asc" }],
        select: {
          id: true,
          villeDepart: true,
          villeArrivee: true,
          date: true,
          prix: true,
          placesDispo: true,
        },
        take: 6,
      })
      .catch(() => []),
    prisma.after
      .findMany({
        where: {
          isApproved: true,
          isActive: true,
          city: { contains: event.city, mode: "insensitive" },
          date: { gte: dayStart, lte: dayEnd },
        },
        orderBy: [{ isBoosted: "desc" }, { date: "asc" }],
        select: { slug: true, name: true, date: true, venue: true, city: true },
        take: 6,
      })
      .catch(() => []),
  ]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    url: `${getSiteUrl()}/${locale}/evenements/${event.slug}`,
    description: event.description,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [new URL(event.image, getSiteUrl()).toString()],
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: event.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: event.latitude,
        longitude: event.longitude,
      },
    },
    performer: { "@type": "MusicGroup", name: event.artist },
    offers: {
      "@type": "Offer",
      url: event.officialTicketUrl,
      availability:
        event.status === "SOLD_OUT"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
  };
  return (
    <main className="force-light bg-white text-paper">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <header className="relative isolate min-h-[620px] overflow-hidden bg-black text-white">
        <Image
          alt={event.imageAlt}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={event.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/15" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-end px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link
            className="absolute left-5 top-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 text-sm font-semibold backdrop-blur-md sm:left-6 lg:left-8"
            href={localizedHref("/evenements", locale)}
          >
            <ArrowLeft className="size-4" /> Tous les événements
          </Link>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">
            {event.category} · {event.genres.join(" · ")}
          </p>
          <h1 className="mt-3 max-w-5xl font-display text-[clamp(4rem,11vw,9rem)] uppercase leading-[0.84]">
            {event.artist}
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-base font-semibold sm:text-lg">
            <span className="flex items-center gap-2">
              <MapPin className="size-5 text-blood" />
              {event.city} · {event.venue}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-5 text-blood" />
              {formatDates(event.startDate, event.endDate)}
            </span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black transition hover:bg-white/90"
              href={event.officialTicketUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Billetterie officielle <ExternalLink className="size-4" />
            </a>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/20 px-6 text-sm font-bold backdrop-blur-sm"
              href={localizedHref(
                `/trajets?destination=${encodeURIComponent(event.city)}&date=${event.startDate.slice(0, 10)}`,
                locale,
              )}
            >
              Voir les trajets <CarFront className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Eyebrow>{t.prepareEyebrow}</Eyebrow>
          <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
            {t.prepareTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-paper-dim">{event.description}</p>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {services.map(({ key, href, icon: Icon }) => (
              <Link
                className="flex min-h-40 flex-col justify-between rounded-2xl border border-black/10 bg-[#f4f4f1] p-5 transition hover:-translate-y-1 hover:border-blood/50"
                href={localizedHref(
                  `${href}${href.includes("?") ? "&" : "?"}city=${encodeURIComponent(event.city)}`,
                  locale,
                )}
                key={key}
              >
                <Icon className="size-6 text-blood" />
                <span className="font-semibold">{serviceLabels[key]}</span>
              </Link>
            ))}
          </div>
          {pros.length ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pros.map((pro) => (
                <Link
                  className="rounded-2xl border border-black/10 p-5"
                  href={localizedHref(`/pro/${pro.id}`, locale)}
                  key={pro.id}
                >
                  <strong>{pro.displayName}</strong>
                  <p className="mt-1 text-sm text-paper-dim">
                    {proCategoryLabel(pro.category)} · {pro.city}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-black/10 p-5 text-paper-dim">
              {t.prosEmpty}{" "}
              <Link
                className="font-semibold text-paper underline"
                href={localizedHref(
                  `/prestataires?city=${encodeURIComponent(event.city)}`,
                  locale,
                )}
              >
                {t.prosEmptyCta}
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="bg-black py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Eyebrow>Trajets</Eyebrow>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
            {t.ridesTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-white/60">
            {t.ridesDestination} {event.city}, {t.ridesAround}{" "}
            {new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
              new Date(event.startDate),
            )}
            .
          </p>
          {rides.length ? (
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
              {rides.map((ride) => (
                <Link
                  className="bg-black p-6 hover:bg-white/5"
                  href={localizedHref(`/trajets/${ride.id}`, locale)}
                  key={ride.id}
                >
                  <p className="text-xl font-semibold">
                    {ride.villeDepart} → {ride.villeArrivee}
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    {ride.placesDispo} {t.ridesSeats} · {ride.prix} €
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-white/15 p-6 text-white/65">
              {t.ridesEmpty}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-bold text-black"
              href={localizedHref(
                `/trajets?destination=${encodeURIComponent(event.city)}&date=${event.startDate.slice(0, 10)}`,
                locale,
              )}
            >
              {t.ridesSeeAll}
            </Link>
            <Link
              className="inline-flex min-h-12 items-center rounded-full border border-white/30 px-6 text-sm font-bold"
              href={localizedHref(
                `/trajets/publier?destination=${encodeURIComponent(event.city)}&date=${event.startDate.slice(0, 10)}`,
                locale,
              )}
            >
              {t.ridesPublish}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Eyebrow>Et après ?</Eyebrow>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
            {t.aftersTitle}
          </h2>
          {afters.length ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {afters.map((after) => (
                <Link
                  className="rounded-2xl border border-black/10 p-6"
                  href={localizedHref(`/afters/${after.slug}`, locale)}
                  key={after.slug}
                >
                  <h3 className="text-xl font-semibold">{after.name}</h3>
                  <p className="mt-2 text-paper-dim">
                    {after.venue} · {after.city}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-black/10 bg-[#f4f4f1] p-6 text-paper-dim">
              {t.aftersEmpty}
            </p>
          )}
          <Link
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-black px-6 text-sm font-bold text-white"
            href={localizedHref(
              `/afters/organiser?event=${encodeURIComponent(event.slug)}`,
              locale,
            )}
          >
            Ajouter un after <ArrowRight className="size-4" />
          </Link>
          <p className="mt-10 text-xs text-paper-mute">
            {t.sourceNote}{" "}
            <a
              className="underline hover:text-paper"
              href={event.sourceUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {t.sourceCta}
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

async function CityLanding({ city, locale }: { city: string; locale: string }) {
  const t = nls[languageOf(locale)].eventDetail;
  const cityEvents = (await getPublicEvents()).filter(
    (event) =>
      event.city.toLocaleLowerCase("fr") === city.toLocaleLowerCase("fr"),
  );
  return (
    <main className="force-light min-h-screen bg-white">
      <header className="bg-black px-5 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Guide local</Eyebrow>
          <h1 className="mt-3 font-display text-[clamp(4rem,11vw,9rem)] uppercase leading-[.85]">
            {t.cityTitle} {city}
          </h1>
          <p className="mt-6 max-w-2xl text-white/65">{t.cityBody}</p>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        {cityEvents.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cityEvents.map((event) => (
              <EventCard event={event} key={event.slug} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-[#f4f4f1] p-8">
            <h2 className="text-2xl font-semibold">{t.cityEmpty}</h2>
            <p className="mt-2 text-paper-dim">{t.cityEmptyNote}</p>
          </div>
        )}
      </section>
    </main>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-bold uppercase tracking-[0.18em] text-blood">
      {children}
    </p>
  );
}
function formatDates(startDate: string, endDate?: string) {
  const format = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
  return endDate
    ? `${format.format(new Date(startDate))} — ${format.format(new Date(endDate))}`
    : format.format(new Date(startDate));
}
