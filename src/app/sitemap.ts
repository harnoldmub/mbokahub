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

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/evenements", priority: 0.95, changeFrequency: "daily" },
  { path: "/evenements/londres", priority: 0.8, changeFrequency: "daily" },
  { path: "/evenements/bruxelles", priority: 0.8, changeFrequency: "daily" },
  { path: "/evenements/paris", priority: 0.7, changeFrequency: "daily" },

  // Core verticals
  { path: "/trajets", priority: 0.95, changeFrequency: "daily" },
  { path: "/beaute", priority: 0.9, changeFrequency: "daily" },
  { path: "/beaute/maquilleuses", priority: 0.85, changeFrequency: "weekly" },
  { path: "/beaute/coiffeurs", priority: 0.85, changeFrequency: "weekly" },
  { path: "/afters", priority: 0.9, changeFrequency: "daily" },
  { path: "/merch", priority: 0.8, changeFrequency: "weekly" },
  { path: "/classiques-paris", priority: 0.85, changeFrequency: "weekly" },

  // Conversion
  { path: "/vip", priority: 0.95, changeFrequency: "weekly" },
  { path: "/pro", priority: 0.9, changeFrequency: "weekly" },

  // Engagement
  { path: "/quiz", priority: 0.65, changeFrequency: "monthly" },
  { path: "/jeu", priority: 0.65, changeFrequency: "monthly" },

  // Brand
  { path: "/a-propos", priority: 0.5, changeFrequency: "monthly" },

  // Legal
  { path: "/cgu", priority: 0.3, changeFrequency: "yearly" },
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
    const [pros, trajets, afters] = await Promise.all([
      prisma.proProfile.findMany({
        where: { isVerified: true },
        select: { id: true, updatedAt: true },
        take: 1000,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.trajet.findMany({
        where: { isActive: true, date: { gte: new Date("2026-04-15") } },
        select: { id: true, updatedAt: true },
        take: 1000,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.after.findMany({
        where: { isActive: true },
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
