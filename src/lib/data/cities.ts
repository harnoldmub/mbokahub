export type City = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  aliases?: string[];
};

export const CITIES: City[] = [
  { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522, aliases: ["paris", "stade de france", "saint-denis", "saint denis"] },
  { name: "Marseille", country: "France", lat: 43.2965, lon: 5.3698 },
  { name: "Lyon", country: "France", lat: 45.7640, lon: 4.8357 },
  { name: "Toulouse", country: "France", lat: 43.6047, lon: 1.4442 },
  { name: "Nice", country: "France", lat: 43.7102, lon: 7.2620 },
  { name: "Nantes", country: "France", lat: 47.2184, lon: -1.5536 },
  { name: "Strasbourg", country: "France", lat: 48.5734, lon: 7.7521 },
  { name: "Bordeaux", country: "France", lat: 44.8378, lon: -0.5792 },
  { name: "Lille", country: "France", lat: 50.6292, lon: 3.0573 },
  { name: "Rennes", country: "France", lat: 48.1173, lon: -1.6778 },
  { name: "Reims", country: "France", lat: 49.2583, lon: 4.0317 },
  { name: "Le Havre", country: "France", lat: 49.4944, lon: 0.1079, aliases: ["le havre", "havre"] },
  { name: "Saint-Étienne", country: "France", lat: 45.4397, lon: 4.3872, aliases: ["saint-etienne", "saint etienne", "st etienne", "st-etienne"] },
  { name: "Grenoble", country: "France", lat: 45.1885, lon: 5.7245 },
  { name: "Dijon", country: "France", lat: 47.3220, lon: 5.0415 },
  { name: "Angers", country: "France", lat: 47.4784, lon: -0.5632 },
  { name: "Nîmes", country: "France", lat: 43.8367, lon: 4.3601, aliases: ["nimes", "nîmes"] },
  { name: "Le Mans", country: "France", lat: 48.0061, lon: 0.1996, aliases: ["le mans", "mans"] },
  { name: "Aix-en-Provence", country: "France", lat: 43.5297, lon: 5.4474, aliases: ["aix-en-provence", "aix en provence", "aix"] },
  { name: "Brest", country: "France", lat: 48.3904, lon: -4.4861 },
  { name: "Tours", country: "France", lat: 47.3941, lon: 0.6848 },
  { name: "Amiens", country: "France", lat: 49.8941, lon: 2.2958 },
  { name: "Limoges", country: "France", lat: 45.8336, lon: 1.2611 },
  { name: "Annecy", country: "France", lat: 45.8992, lon: 6.1294 },
  { name: "Perpignan", country: "France", lat: 42.6886, lon: 2.8949 },
  { name: "Metz", country: "France", lat: 49.1193, lon: 6.1757 },
  { name: "Besançon", country: "France", lat: 47.2378, lon: 6.0241, aliases: ["besancon", "besançon"] },
  { name: "Orléans", country: "France", lat: 47.9029, lon: 1.9039, aliases: ["orleans", "orléans"] },
  { name: "Mulhouse", country: "France", lat: 47.7508, lon: 7.3359 },
  { name: "Rouen", country: "France", lat: 49.4432, lon: 1.0993 },
  { name: "Caen", country: "France", lat: 49.1829, lon: -0.3707 },
  { name: "Nancy", country: "France", lat: 48.6921, lon: 6.1844 },
  { name: "Montpellier", country: "France", lat: 43.6108, lon: 3.8767 },
  { name: "Clermont-Ferrand", country: "France", lat: 45.7772, lon: 3.0870, aliases: ["clermont-ferrand", "clermont ferrand", "clermont"] },
  { name: "Avignon", country: "France", lat: 43.9493, lon: 4.8055 },
  { name: "Poitiers", country: "France", lat: 46.5802, lon: 0.3404 },

  { name: "Bruxelles", country: "Belgique", lat: 50.8503, lon: 4.3517, aliases: ["bruxelles", "brussel", "brussels"] },
  { name: "Anvers", country: "Belgique", lat: 51.2194, lon: 4.4025, aliases: ["anvers", "antwerp", "antwerpen"] },
  { name: "Gand", country: "Belgique", lat: 51.0543, lon: 3.7174, aliases: ["gand", "gent", "ghent"] },
  { name: "Charleroi", country: "Belgique", lat: 50.4108, lon: 4.4446 },
  { name: "Liège", country: "Belgique", lat: 50.6326, lon: 5.5797, aliases: ["liege", "liège", "luik"] },
  { name: "Bruges", country: "Belgique", lat: 51.2093, lon: 3.2247, aliases: ["bruges", "brugge"] },
  { name: "Namur", country: "Belgique", lat: 50.4674, lon: 4.8720 },
  { name: "Mons", country: "Belgique", lat: 50.4542, lon: 3.9514 },
  { name: "Ostende", country: "Belgique", lat: 51.2300, lon: 2.9211, aliases: ["ostende", "oostende"] },
  { name: "Louvain", country: "Belgique", lat: 50.8798, lon: 4.7005, aliases: ["louvain", "leuven"] },
  { name: "Tournai", country: "Belgique", lat: 50.6056, lon: 3.3878 },
  { name: "Verviers", country: "Belgique", lat: 50.5912, lon: 5.8624 },

  { name: "Amsterdam", country: "Pays-Bas", lat: 52.3676, lon: 4.9041 },
  { name: "Rotterdam", country: "Pays-Bas", lat: 51.9244, lon: 4.4777 },
  { name: "La Haye", country: "Pays-Bas", lat: 52.0705, lon: 4.3007, aliases: ["la haye", "den haag", "the hague"] },
  { name: "Utrecht", country: "Pays-Bas", lat: 52.0907, lon: 5.1214 },
  { name: "Eindhoven", country: "Pays-Bas", lat: 51.4416, lon: 5.4697 },
  { name: "Maastricht", country: "Pays-Bas", lat: 50.8514, lon: 5.6910 },
  { name: "Tilburg", country: "Pays-Bas", lat: 51.5555, lon: 5.0913 },

  { name: "Berlin", country: "Allemagne", lat: 52.5200, lon: 13.4050 },
  { name: "Hambourg", country: "Allemagne", lat: 53.5511, lon: 9.9937, aliases: ["hambourg", "hamburg"] },
  { name: "Munich", country: "Allemagne", lat: 48.1351, lon: 11.5820, aliases: ["munich", "münchen", "muenchen"] },
  { name: "Cologne", country: "Allemagne", lat: 50.9375, lon: 6.9603, aliases: ["cologne", "köln", "koeln"] },
  { name: "Francfort", country: "Allemagne", lat: 50.1109, lon: 8.6821, aliases: ["francfort", "frankfurt"] },
  { name: "Stuttgart", country: "Allemagne", lat: 48.7758, lon: 9.1829 },
  { name: "Düsseldorf", country: "Allemagne", lat: 51.2277, lon: 6.7735, aliases: ["dusseldorf", "düsseldorf", "duesseldorf"] },
  { name: "Bonn", country: "Allemagne", lat: 50.7374, lon: 7.0982 },
  { name: "Aix-la-Chapelle", country: "Allemagne", lat: 50.7753, lon: 6.0839, aliases: ["aix-la-chapelle", "aachen", "aix la chapelle"] },
  { name: "Brême", country: "Allemagne", lat: 53.0793, lon: 8.8017, aliases: ["breme", "bremen", "brême"] },
  { name: "Hanovre", country: "Allemagne", lat: 52.3759, lon: 9.7320, aliases: ["hanovre", "hannover", "hanover"] },

  { name: "Genève", country: "Suisse", lat: 46.2044, lon: 6.1432, aliases: ["geneve", "genève", "geneva"] },
  { name: "Zurich", country: "Suisse", lat: 47.3769, lon: 8.5417, aliases: ["zurich", "zürich", "zuerich"] },
  { name: "Lausanne", country: "Suisse", lat: 46.5197, lon: 6.6323 },
  { name: "Bâle", country: "Suisse", lat: 47.5596, lon: 7.5886, aliases: ["bale", "bâle", "basel"] },
  { name: "Berne", country: "Suisse", lat: 46.9480, lon: 7.4474, aliases: ["berne", "bern"] },

  { name: "Luxembourg", country: "Luxembourg", lat: 49.6116, lon: 6.1319, aliases: ["luxembourg", "luxembourg-ville"] },

  { name: "Londres", country: "Royaume-Uni", lat: 51.5074, lon: -0.1278, aliases: ["londres", "london"] },
  { name: "Manchester", country: "Royaume-Uni", lat: 53.4808, lon: -2.2426 },
  { name: "Birmingham", country: "Royaume-Uni", lat: 52.4862, lon: -1.8904 },

  { name: "Milan", country: "Italie", lat: 45.4642, lon: 9.1900, aliases: ["milan", "milano"] },
  { name: "Turin", country: "Italie", lat: 45.0703, lon: 7.6869, aliases: ["turin", "torino"] },
  { name: "Rome", country: "Italie", lat: 41.9028, lon: 12.4964, aliases: ["rome", "roma"] },

  { name: "Barcelone", country: "Espagne", lat: 41.3851, lon: 2.1734, aliases: ["barcelone", "barcelona"] },
  { name: "Madrid", country: "Espagne", lat: 40.4168, lon: -3.7038 },

  { name: "Lisbonne", country: "Portugal", lat: 38.7223, lon: -9.1393, aliases: ["lisbonne", "lisboa", "lisbon"] },
  { name: "Porto", country: "Portugal", lat: 41.1579, lon: -8.6291 },
];

const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s-]/g, "")
    .trim();

export function findCity(input: string): City | null {
  const q = normalize(input);
  if (!q) return null;

  for (const c of CITIES) {
    if (normalize(c.name) === q) return c;
    if (c.aliases?.some((a) => normalize(a) === q)) return c;
  }
  for (const c of CITIES) {
    if (normalize(c.name).startsWith(q) && q.length >= 3) return c;
    if (c.aliases?.some((a) => normalize(a).startsWith(q)) && q.length >= 3) return c;
  }
  return null;
}

export function distanceKm(a: City, b: City): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const ROAD_DETOUR = 1.25;
const FUEL_PER_KM = 0.085;
const TOLLS_PER_KM = 0.04;

export type PriceSuggestion = {
  distanceKm: number;
  roadKm: number;
  totalCost: number;
  perPlaceMin: number;
  perPlaceFair: number;
  perPlaceMax: number;
};

export function suggestPrice(
  from: City,
  to: City,
  passengers: number,
): PriceSuggestion {
  const d = distanceKm(from, to);
  const road = d * ROAD_DETOUR;
  const totalCost = road * (FUEL_PER_KM + TOLLS_PER_KM);
  const seats = Math.max(1, passengers);
  const fair = totalCost / (seats + 1);
  const min = fair * 0.8;
  const max = fair * 1.25;

  const round = (v: number) => Math.max(2, Math.round(v));
  return {
    distanceKm: Math.round(d),
    roadKm: Math.round(road),
    totalCost: Math.round(totalCost),
    perPlaceMin: round(min),
    perPlaceFair: round(fair),
    perPlaceMax: round(max),
  };
}
