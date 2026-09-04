import { prisma } from "@/lib/db/prisma";
import { events as curatedEvents, type NeventEvent } from "@/lib/events";

function getCountryCode(country: string) {
  const value = country.toLocaleLowerCase("fr");
  if (value.includes("belg")) return "BE";
  if (value.includes("royaume") || value.includes("united kingdom"))
    return "GB";
  if (value.includes("congo")) return "CD";
  return "FR";
}

export async function getPublicEvents(): Promise<NeventEvent[]> {
  const managed = await prisma.event
    .findMany({
      where: { published: true, status: { not: "CANCELLED" } },
      orderBy: [{ featured: "desc" }, { startDate: "asc" }],
    })
    .catch(() => []);
  const mapped: NeventEvent[] = managed.map((event) => ({
    slug: event.slug,
    title: event.title,
    artist: event.artist,
    description: event.description,
    category: "Concert",
    genres: event.genres,
    image: event.image,
    imageAlt: `Visuel officiel de ${event.artist} à ${event.city}`,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString(),
    venue: event.venue,
    city: event.city,
    country: event.country,
    countryCode: getCountryCode(event.country),
    latitude: event.latitude ?? 0,
    longitude: event.longitude ?? 0,
    officialTicketUrl: event.officialTicketUrl,
    sourceUrl: event.sourceUrl,
    assetSourceUrl: event.sourceUrl,
    featured: event.featured,
    status: event.status === "SOLD_OUT" ? "SOLD_OUT" : "ON_SALE",
  }));
  const managedSlugs = new Set(mapped.map((event) => event.slug));
  return [
    ...mapped,
    ...curatedEvents.filter((event) => !managedSlugs.has(event.slug)),
  ].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
}

export async function getPublicEvent(slug: string) {
  return (await getPublicEvents()).find((event) => event.slug === slug);
}
