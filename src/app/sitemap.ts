import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

const routes = [
  { path: "/", priority: 1 },
  { path: "/trajets", priority: 0.9 },
  { path: "/beaute/maquilleuses", priority: 0.85 },
  { path: "/beaute/coiffeurs", priority: 0.85 },
  { path: "/afters", priority: 0.8 },
  { path: "/classiques-paris", priority: 0.95 },
  { path: "/merch", priority: 0.7 },
  { path: "/quiz", priority: 0.65 },
  { path: "/jeu", priority: 0.65 },
  { path: "/pro", priority: 0.8 },
  { path: "/a-propos", priority: 0.5 },
  { path: "/cgu", priority: 0.3 },
  { path: "/confidentialite", priority: 0.3 },
  { path: "/mentions-legales", priority: 0.3 },
  { path: "/disclaimer", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    lastModified: new Date(),
    priority: route.priority,
    url: `${appUrl}${route.path}`,
  }));
}
