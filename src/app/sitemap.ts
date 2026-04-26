import type { MetadataRoute } from "next";

import { prisma } from "@/lib/db/prisma";
import { PRO_CATEGORIES } from "@/lib/pro-categories";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
const LOCALES = ["fr", "en", "de", "nl"] as const;

type Priority = 0.3 | 0.4 | 0.5 | 0.55 | 0.6 | 0.65 | 0.7 | 0.8 | 0.85 | 0.9 | 0.95 | 1;
type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

type StaticRoute = {
  path: string;
  priority: Priority;
  changeFrequency: Freq;
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },

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

function buildAlternates(path: string): MetadataRoute.Sitemap[number]["alternates"] {
  return {
    languages: Object.fromEntries(LOCALES.map((l) => [l, `${appUrl}${path}?lang=${l}`])),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${appUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: buildAlternates(r.path),
  }));

  // One landing per pro category — strong long-tail SEO
  const categoryEntries: MetadataRoute.Sitemap = PRO_CATEGORIES.map((c) => ({
    url: `${appUrl}/beaute?category=${c.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

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
      ...pros.map((p) => ({
        url: `${appUrl}/pro/${p.id}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6 as Priority,
      })),
      ...trajets.map((t) => ({
        url: `${appUrl}/trajets/${t.id}`,
        lastModified: t.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.55 as Priority,
      })),
      ...afters.map((a) => ({
        url: `${appUrl}/afters/${a.slug}`,
        lastModified: a.createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.6 as Priority,
      })),
    ];
  } catch (err) {
    console.error("[sitemap] failed to fetch dynamic content", err);
  }

  return [...staticEntries, ...categoryEntries, ...dynamicEntries];
}
