/**
 * Locales de Nevent — source unique du couple langue + marché.
 *
 * Le site portait auparavant deux axes concurrents : le marché dans l'URL
 * (`/fr`, `/fr-be`, `/fr-cod`) et la langue dans un paramètre (`?lang=en`).
 * Le segment `/fr` ressemblait à une langue mais désignait un pays, et le
 * sélecteur proposait quatre langues dont trois n'étaient presque pas servies :
 * choisir « EN » ne changeait quasiment rien à l'écran.
 *
 * Les deux axes sont désormais fondus dans un seul segment d'URL. Une locale
 * porte sa langue et son marché ; le français décliné par pays reste distinct
 * (`fr`, `fr-be`, `fr-cd`) parce que la devise et les villes proposées en
 * dépendent, pas le vocabulaire.
 *
 * `catalogueComplete` est le garde-fou : une locale dont le catalogue de
 * traduction n'est pas terminé n'est ni routable ni proposée. Le site ne peut
 * donc pas promettre une langue qu'il ne sert pas. Passer le drapeau à `true`
 * suffit à la mettre en ligne.
 */

/**
 * Langues servies. L'allemand et le néerlandais avaient été annoncés dans le
 * sélecteur sans jamais être traduits ; ils sont retirés tant qu'aucun
 * catalogue n'existe pour eux. Les rajouter demande un fichier de plus dans
 * src/lib/i18n/ et une entrée ici.
 */
export type Language = "fr" | "en";

export type Locale = "fr" | "fr-be" | "fr-cd" | "en";

export type LocaleMeta = {
  language: Language;
  /** Nom affiché dans le sélecteur. */
  label: string;
  /** Forme courte pour les surfaces compactes. */
  shortLabel: string;
  flag: string;
  /** ISO 3166-1 alpha-2 du marché. */
  country: string;
  /** Pays interrogé par l'autocomplétion de villes. */
  cityApiCountry: string;
  currency: "EUR" | "CDF";
  /**
   * Le catalogue de traduction de cette locale est-il complet ?
   * Voir src/lib/nls.ts — tant qu'il est faux, la locale est hors ligne.
   */
  catalogueComplete: boolean;
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  fr: {
    language: "fr",
    label: "France",
    shortLabel: "FR",
    flag: "🇫🇷",
    country: "FR",
    cityApiCountry: "FR",
    currency: "EUR",
    catalogueComplete: true,
  },
  "fr-be": {
    language: "fr",
    label: "Belgique",
    shortLabel: "BE",
    flag: "🇧🇪",
    country: "BE",
    cityApiCountry: "BE",
    currency: "EUR",
    catalogueComplete: true,
  },
  "fr-cd": {
    language: "fr",
    label: "Congo RDC",
    shortLabel: "RDC",
    flag: "🇨🇩",
    // La RDC est CD ; l'ancien code marché utilisait CG, qui désigne le
    // Congo-Brazzaville.
    country: "CD",
    cityApiCountry: "CD",
    currency: "CDF",
    catalogueComplete: true,
  },
  en: {
    language: "en",
    label: "English",
    shortLabel: "EN",
    flag: "🇬🇧",
    country: "GB",
    cityApiCountry: "GB",
    currency: "EUR",
    // La page d'accueil et les surfaces de navigation sont traduites ; le
    // reste du site ne l'est pas encore. Passer à `true` une fois le catalogue
    // complet — /en sera alors routable et proposé dans le sélecteur.
    catalogueComplete: false,
  },
};

export const ALL_LOCALES = Object.keys(LOCALE_META) as Locale[];

/** Les seules locales servies : celles dont le catalogue est terminé. */
export const LOCALES: Locale[] = ALL_LOCALES.filter(
  (locale) => LOCALE_META[locale].catalogueComplete,
);

export const DEFAULT_LOCALE: Locale = "fr";

/** Anciennes URL à rediriger de façon permanente. */
export const LEGACY_LOCALE_REDIRECTS: Record<string, Locale> = {
  "fr-cod": "fr-cd",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as string[]).includes(value);
}

export function getLocale(value?: string | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** La langue d'une locale — c'est elle qui choisit le catalogue de textes. */
export function getLanguage(locale?: string | null): Language {
  return LOCALE_META[getLocale(locale)].language;
}

/** Première locale servie dans une langue donnée, pour le sélecteur. */
export function localeForLanguage(language: Language): Locale | undefined {
  return LOCALES.find((locale) => LOCALE_META[locale].language === language);
}

/** Préfixe un chemin interne par une locale : ("/trajets", "fr-be") → "/fr-be/trajets" */
export function localeHref(href: string, locale: string): string {
  if (href.startsWith("http") || href.startsWith("#")) return href;
  const path = href === "/" ? "" : href;
  return `/${locale}${path}`;
}

/** Extrait la locale d'un chemin, ou la locale par défaut. */
export function localeFromPathname(pathname: string): Locale {
  return getLocale(pathname.split("/")[1]);
}
