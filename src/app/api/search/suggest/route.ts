import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type Suggestion = {
  services: string[];
  cities: string[];
  pros: { id: string; slug: string; displayName: string; city: string; category: string }[];
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const qRaw = (url.searchParams.get("q") ?? "").trim();
  const kind = url.searchParams.get("kind") ?? "all"; // "all" | "city"

  if (qRaw.length < 2) {
    return NextResponse.json(
      { services: [], cities: [], pros: [] } satisfies Suggestion,
      { headers: { "cache-control": "public, max-age=10" } },
    );
  }

  const q = qRaw.slice(0, 60);

  if (kind === "city") {
    // City-only suggestion: distinct ProProfile.city matching q.
    const rows = await prisma.proProfile.findMany({
      where: {
        isVerified: true,
        city: { contains: q, mode: "insensitive" },
      },
      select: { city: true },
      distinct: ["city"],
      take: 8,
      orderBy: { city: "asc" },
    });
    return NextResponse.json(
      {
        services: [],
        cities: rows.map((r) => r.city).filter(Boolean),
        pros: [],
      } satisfies Suggestion,
      { headers: { "cache-control": "public, max-age=15" } },
    );
  }

  const [services, cityRows, pros] = await Promise.all([
    prisma.service.findMany({
      where: {
        isOnlineBookable: true,
        name: { contains: q, mode: "insensitive" },
      },
      select: { name: true },
      distinct: ["name"],
      take: 5,
      orderBy: { name: "asc" },
    }),
    prisma.proProfile.findMany({
      where: {
        isVerified: true,
        city: { contains: q, mode: "insensitive" },
      },
      select: { city: true },
      distinct: ["city"],
      take: 5,
      orderBy: { city: "asc" },
    }),
    prisma.proProfile.findMany({
      where: {
        isVerified: true,
        OR: [
          { displayName: { contains: q, mode: "insensitive" } },
          { specialities: { has: q.toLowerCase() } },
        ],
      },
      select: {
        id: true,
        slug: true,
        displayName: true,
        city: true,
        category: true,
      },
      take: 5,
      orderBy: [
        { isBoosted: "desc" },
        { isPremium: "desc" },
        { rating: "desc" },
      ],
    }),
  ]);

  const out: Suggestion = {
    services: services.map((s) => s.name),
    cities: cityRows.map((c) => c.city).filter(Boolean),
    pros: pros.map((p) => ({
      id: p.id,
      slug: p.slug,
      displayName: p.displayName,
      city: p.city,
      category: String(p.category),
    })),
  };

  return NextResponse.json(out, {
    headers: { "cache-control": "public, max-age=15" },
  });
}
