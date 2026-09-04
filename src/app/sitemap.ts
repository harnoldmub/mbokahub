import type { MetadataRoute } from "next";

import { prisma } from "@/lib/db/prisma";
import { getPublicEvents } from "@/lib/events.server";
import { MARKETS } from "@/lib/markets";
import { getSiteUrl } from "@/lib/seo";

const appUrl = getSiteUrl();

type Priority =
  | 0.3
  | 0.4
  | 0.5
  | 0.55
  | 0.6
  | 0.65
  | 0.7
  | 0.8
  | 0.85
  | 0.9
  | 0.95
  | 1;
type Freq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

type StaticRoute = {
  path: string;
  priority: Priority;
  changeFrequency: Freq;
};

// Aligné sur l'arborescence de src/lib/navigation.ts. Une page hors navigation
// parce qu'elle est vide (/merch, /communaute) n'est pas non plus déclarée ici :
// l'exposer au référencement reviendrait à proposer une page vide.
const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },

  // Découvrir
  { path: "/evenements", priority: 0.95, changeFrequency: "daily" },
  { path: "/evenements/londres", priority: 0.8, changeFrequency: "daily" },
  { path: "/evenements/bruxelles", priority: 0.8, changeFrequency: "daily" },
  { path: "/evenements/paris", priority: 0.7, changeFrequency: "daily" },
  { path: "/classiques-paris", priority: 0.85, changeFrequency: "weekly" },
  { path: "/jeu", priority: 0.5, changeFrequency: "monthly" },

  // Organiser
  { path: "/prestataires", priority: 0.95, changeFrequency: "daily" },
  { path: "/trajets", priority: 0.95, changeFrequency: "daily" },
  { path: "/afters", priority: 0.9, changeFrequency: "daily" },
  { path: "/beaute", priority: 0.9, changeFrequency: "daily" },
  { path: "/beaute/maquilleuses", priority: 0.85, changeFrequency: "weekly" },
  { path: "/beaute/coiffeurs", priority: 0.85, changeFrequency: "weekly" },
  { path: "/beaute/photographes", priority: 0.85, changeFrequency: "weekly" },
  { path: "/beaute/babysitting", priority: 0.8, changeFrequency: "weekly" },

  // Prestataires
  { path: "/pro/inscrire", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pro", priority: 0.9, changeFrequency: "weekly" },
  { path: "/ads", priority: 0.6, changeFrequency: "monthly" },
  { path: "/partenariat", priority: 0.6, changeFrequency: "monthly" },

  // Nevent
  { path: "/a-propos", priority: 0.5, changeFrequency: "monthly" },
  { path: "/vip", priority: 0.6, changeFrequency: "monthly" },
  { path: "/equipe", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },

  // Légal
  { path: "/cgu", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cgv", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
];

function buildAlternates(
  path: string,
): MetadataRoute.Sitemap[number]["alternates"] {
  return {
    languages: Object.fromEntries([
      ...MARKETS.map((market) => [
        market,
        `${appUrl}/${market}${path === "/" ? "" : path}`,
      ]),
      ["x-default", `${appUrl}/fr${path === "/" ? "" : path}`],
    ]),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((r) =>
    MARKETS.map((market) => ({
      url: `${appUrl}/${market}${r.path === "/" ? "" : r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: buildAlternates(r.path),
    })),
  );

  const eventEntries: MetadataRoute.Sitemap = (await getPublicEvents()).flatMap(
    (event) =>
      MARKETS.map((market) => ({
        url: `${appUrl}/${market}/evenements/${event.slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.85 as Priority,
        alternates: buildAlternates(`/evenements/${event.slug}`),
      })),
  );

  // Dynamic content — fail open if DB is unreachable so the sitemap still builds
  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const [pros, trajets, afters] = await Promise.all([
      prisma.proProfile.findMany({
        where: { isVerified: true },
        select: { id: true, updatedAt: true },
        take: 1000,
        orderBy: { updatedAt: "desc" },
      }),
      // Les fiches datées passées sont servies en noindex (voir
      // src/lib/content-lifecycle.ts) : les déclarer ici demanderait à Google
      // d'explorer des pages qui refusent d'être indexées. La date plancher
      // n'est donc pas une constante, c'est aujourd'hui.
      prisma.trajet.findMany({
        where: { isActive: true, date: { gte: startOfToday } },
        select: { id: true, updatedAt: true },
        take: 1000,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.after.findMany({
        where: { isActive: true, date: { gte: startOfToday } },
        select: { slug: true, createdAt: true },
        take: 500,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    dynamicEntries = [
      ...pros.flatMap((p) =>
        MARKETS.map((market) => ({
          url: `${appUrl}/${market}/pro/${p.id}`,
          lastModified: p.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.6 as Priority,
          alternates: buildAlternates(`/pro/${p.id}`),
        })),
      ),
      ...trajets.flatMap((t) =>
        MARKETS.map((market) => ({
          url: `${appUrl}/${market}/trajets/${t.id}`,
          lastModified: t.updatedAt,
          changeFrequency: "daily" as const,
          priority: 0.55 as Priority,
          alternates: buildAlternates(`/trajets/${t.id}`),
        })),
      ),
      ...afters.flatMap((a) =>
        MARKETS.map((market) => ({
          url: `${appUrl}/${market}/afters/${a.slug}`,
          lastModified: a.createdAt,
          changeFrequency: "weekly" as const,
          priority: 0.6 as Priority,
          alternates: buildAlternates(`/afters/${a.slug}`),
        })),
      ),
    ];
  } catch (err) {
    console.error("[sitemap] failed to fetch dynamic content", err);
  }

  return [...staticEntries, ...eventEntries, ...dynamicEntries];
}
