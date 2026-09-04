export type EventStatus = "ON_SALE" | "SOLD_OUT" | "CANCELLED";

export type NeventEvent = {
  slug: string;
  title: string;
  artist: string;
  description: string;
  category: "Concert";
  genres: string[];
  image: string;
  imageAlt: string;
  startDate: string;
  endDate?: string;
  venue: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  officialTicketUrl: string;
  sourceUrl: string;
  assetSourceUrl: string;
  featured: boolean;
  status: EventStatus;
};

/**
 * Sélection éditoriale vérifiée le 4 septembre 2026 auprès des salles et
 * billetteries officielles. Ce catalogue sert de fallback public pendant que
 * le modèle Prisma Event est progressivement alimenté via le backoffice.
 */
export const events: NeventEvent[] = [
  {
    slug: "fally-ipupa-london-2026",
    title: "Fally Ipupa à Londres",
    artist: "Fally Ipupa",
    description:
      "Fally Ipupa revient à Londres pour deux soirs à The O2. Une rencontre majeure entre rumba congolaise, ndombolo, R&B et pop urbaine.",
    category: "Concert",
    genres: ["Rumba", "Afro R&B"],
    image: "/images/events/fally-ipupa-london-2026.webp",
    imageAlt: "Visuel officiel de Fally Ipupa à The O2 Londres en 2026",
    startDate: "2026-10-24T18:30:00+01:00",
    endDate: "2026-10-25T18:00:00+00:00",
    venue: "The O2",
    city: "Londres",
    country: "Royaume-Uni",
    countryCode: "GB",
    latitude: 51.503,
    longitude: 0.0032,
    officialTicketUrl: "https://www.theo2.co.uk/events/detail/fally-ipupa",
    sourceUrl: "https://www.theo2.co.uk/events/detail/fally-ipupa",
    assetSourceUrl:
      "https://www.theo2.co.uk/assets/img/FallyIpupa_Roll_Landscape-1920x1080-081536327f.jpg",
    featured: true,
    status: "ON_SALE",
  },
  {
    slug: "omah-lay-bruxelles-2026",
    title: "Omah Lay — Clarity of Mind Tour",
    artist: "Omah Lay",
    description:
      "Omah Lay présente son Clarity of Mind Tour à Forest National, entre afrobeats, R&B et textures électroniques.",
    category: "Concert",
    genres: ["Afrobeats", "Afro R&B"],
    image: "/images/events/omah-lay-2026.webp",
    imageAlt: "Visuel officiel de la tournée Clarity of Mind d’Omah Lay",
    startDate: "2026-11-06T20:00:00+01:00",
    venue: "Forest National",
    city: "Bruxelles",
    country: "Belgique",
    countryCode: "BE",
    latitude: 50.8098,
    longitude: 4.3266,
    officialTicketUrl:
      "https://www.livenation.be/event/omah-lay-clarity-of-mind-tour-brussels-tickets-edp1666899",
    sourceUrl:
      "https://www.livenation.be/event/omah-lay-clarity-of-mind-tour-brussels-tickets-edp1666899",
    assetSourceUrl:
      "https://www.ovoarena.co.uk/assets/img/Omah-Lay-NEW-1440-x-810-1dfbfdeebe.jpg",
    featured: false,
    status: "ON_SALE",
  },
  {
    slug: "omah-lay-london-2026",
    title: "Omah Lay — Clarity of Mind Tour",
    artist: "Omah Lay",
    description:
      "La tournée mondiale Clarity of Mind d’Omah Lay passe par Londres pour une date à l’OVO Arena Wembley.",
    category: "Concert",
    genres: ["Afrobeats", "Afro R&B"],
    image: "/images/events/omah-lay-2026.webp",
    imageAlt: "Visuel officiel de la tournée Clarity of Mind d’Omah Lay",
    startDate: "2026-11-12",
    venue: "OVO Arena Wembley",
    city: "Londres",
    country: "Royaume-Uni",
    countryCode: "GB",
    latitude: 51.5582,
    longitude: -0.2827,
    officialTicketUrl: "https://www.ovoarena.co.uk/events/detail/omah-lay",
    sourceUrl: "https://www.ovoarena.co.uk/events/detail/omah-lay",
    assetSourceUrl:
      "https://www.ovoarena.co.uk/assets/img/Omah-Lay-NEW-1440-x-810-1dfbfdeebe.jpg",
    featured: false,
    status: "ON_SALE",
  },
  {
    slug: "tayc-london-2026",
    title: "Tayc — Joya in London",
    artist: "Tayc",
    description:
      "Tayc présente Joya in London à l’OVO Arena Wembley, une soirée entre afro R&B, soul et pop francophone.",
    category: "Concert",
    genres: ["Afro R&B"],
    image: "/images/events/tayc-london-2026.webp",
    imageAlt: "Visuel officiel de Tayc à l’OVO Arena Wembley",
    startDate: "2026-11-15T18:00:00+00:00",
    venue: "OVO Arena Wembley",
    city: "Londres",
    country: "Royaume-Uni",
    countryCode: "GB",
    latitude: 51.5582,
    longitude: -0.2827,
    officialTicketUrl: "https://www.ovoarena.co.uk/events/detail/tayc",
    sourceUrl: "https://www.ovoarena.co.uk/events/detail/tayc",
    assetSourceUrl:
      "https://www.ovoarena.co.uk/assets/img/1440-x-810-3ee18f5d04.png",
    featured: false,
    status: "ON_SALE",
  },
  {
    slug: "fally-ipupa-bruxelles-11-decembre-2026",
    title: "Fally Ipupa à Bruxelles — 11 décembre",
    artist: "Fally Ipupa",
    description:
      "Première des deux soirées de Fally Ipupa à l’ING Arena pour célébrer vingt ans de carrière.",
    category: "Concert",
    genres: ["Rumba", "Afro R&B"],
    image: "/images/events/fally-ipupa-brussels-2026.webp",
    imageAlt: "Visuel officiel de Fally Ipupa à l’ING Arena Bruxelles",
    startDate: "2026-12-11T20:00:00+01:00",
    venue: "ING Arena",
    city: "Bruxelles",
    country: "Belgique",
    countryCode: "BE",
    latitude: 50.8991,
    longitude: 4.3375,
    officialTicketUrl: "https://ing.arena.brussels/show/fally-ipupa-11-12/",
    sourceUrl: "https://ing.arena.brussels/show/fally-ipupa-11-12/",
    assetSourceUrl:
      "https://ing.arena.brussels/wp-content/uploads/2026/07/IA-Carousel-Background-post-1800x800-2026-Fally.jpg",
    featured: true,
    status: "ON_SALE",
  },
  {
    slug: "fally-ipupa-bruxelles-12-decembre-2026",
    title: "Fally Ipupa à Bruxelles — 12 décembre",
    artist: "Fally Ipupa",
    description:
      "Deuxième soirée de Fally Ipupa à l’ING Arena pour célébrer vingt ans de carrière.",
    category: "Concert",
    genres: ["Rumba", "Afro R&B"],
    image: "/images/events/fally-ipupa-brussels-2026.webp",
    imageAlt: "Visuel officiel de Fally Ipupa à l’ING Arena Bruxelles",
    startDate: "2026-12-12T20:00:00+01:00",
    venue: "ING Arena",
    city: "Bruxelles",
    country: "Belgique",
    countryCode: "BE",
    latitude: 50.8991,
    longitude: 4.3375,
    officialTicketUrl: "https://ing.arena.brussels/show/fally-ipupa/",
    sourceUrl: "https://ing.arena.brussels/show/fally-ipupa/",
    assetSourceUrl:
      "https://ing.arena.brussels/wp-content/uploads/2026/07/IA-Carousel-Background-post-1800x800-2026-Fally.jpg",
    featured: true,
    status: "ON_SALE",
  },
];

export const featuredEvents = events.filter((event) => event.featured);

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getEventsForCity(city: string) {
  return events.filter(
    (event) =>
      event.city.toLocaleLowerCase("fr") === city.toLocaleLowerCase("fr"),
  );
}

export const artists = [
  { name: "Fally Ipupa", genre: "Rumba · Afropop", country: "RD Congo" },
  { name: "Burna Boy", genre: "Afrofusion", country: "Nigeria" },
  { name: "Wizkid", genre: "Afrobeats", country: "Nigeria" },
  { name: "Davido", genre: "Afrobeats", country: "Nigeria" },
  { name: "Rema", genre: "Afrobeats", country: "Nigeria" },
  { name: "Tems", genre: "Afro R&B", country: "Nigeria" },
  { name: "Ayra Starr", genre: "Afropop", country: "Nigeria" },
  { name: "Asake", genre: "Afrobeats", country: "Nigeria" },
  { name: "Omah Lay", genre: "Afrofusion", country: "Nigeria" },
];
