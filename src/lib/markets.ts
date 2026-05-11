export const MARKETS = ["fr", "fr-be", "fr-cod"] as const;
export type Market = (typeof MARKETS)[number];
export const DEFAULT_MARKET: Market = "fr";

export const MARKET_META: Record<
  Market,
  {
    label: string;
    flag: string;
    country: string; // ISO 3166-1 alpha-2
    cityApiCountry: string; // for CityInput
    currency: "EUR" | "CDF";
  }
> = {
  fr: {
    label: "France",
    flag: "🇫🇷",
    country: "FR",
    cityApiCountry: "FR",
    currency: "EUR",
  },
  "fr-be": {
    label: "Belgique",
    flag: "🇧🇪",
    country: "BE",
    cityApiCountry: "BE",
    currency: "EUR",
  },
  "fr-cod": {
    label: "Congo RDC",
    flag: "🇨🇩",
    country: "CG",
    cityApiCountry: "CG",
    currency: "CDF",
  },
};

export function isMarket(value: unknown): value is Market {
  return typeof value === "string" && (MARKETS as readonly string[]).includes(value);
}

export function getMarket(value?: string | null): Market {
  return isMarket(value) ? value : DEFAULT_MARKET;
}

/** Build a locale-prefixed href.
 *  marketHref("/prestataires", "fr-be") → "/fr-be/prestataires"
 */
export function marketHref(href: string, market: Market): string {
  if (href.startsWith("http")) return href;
  return `/${market}${href}`;
}
