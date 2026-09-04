import type { Metadata } from "next";

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_META,
  LOCALES,
  type Locale,
} from "@/lib/locales";

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

function marketPath(market: Locale, path: string): string {
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
  const market = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const canonical = marketPath(market, path);
  const languages = Object.fromEntries([
    ...LOCALES.map((entry) => [entry, marketPath(entry, path)]),
    ["x-default", marketPath(DEFAULT_LOCALE, path)],
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
      // Balise OG : langue_PAYS, dérivée de la table des locales plutôt que
      // d'une liste de cas particuliers.
      locale: `${LOCALE_META[market].language}_${LOCALE_META[market].country}`,
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
