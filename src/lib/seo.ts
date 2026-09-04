import type { Metadata } from "next";

import { DEFAULT_MARKET, isMarket, MARKETS, type Market } from "@/lib/markets";

export const SITE_NAME = "Nevent";
export const SITE_DESCRIPTION =
  "Découvre les événements afro en Europe et organise toute ton expérience : trajets, beauté, photo, services et afters.";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured && !/localhost|0\.0\.0\.0|127\.0\.0\.1/.test(configured)) {
    return configured.replace(/\/$/, "");
  }
  return "https://nevent.co";
}

function marketPath(market: Market, path: string): string {
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${market}${suffix}`;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  locale,
  image = "/opengraph-image",
  imageAlt = "Nevent — événements afro, trajets et services",
  keywords,
  type = "website",
  noIndex = false,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const market = isMarket(locale) ? locale : DEFAULT_MARKET;
  const canonical = marketPath(market, path);
  const languages = Object.fromEntries([
    ...MARKETS.map((entry) => [entry, marketPath(entry, path)]),
    ["x-default", marketPath(DEFAULT_MARKET, path)],
  ]);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: market === "fr-be" ? "fr_BE" : market === "fr-cod" ? "fr_CD" : "fr_FR",
      type,
      images: [{ url: image, alt: imageAlt, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false, noarchive: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
