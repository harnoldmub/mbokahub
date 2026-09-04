import { en } from "@/lib/i18n/en";
import { fr } from "@/lib/i18n/fr";
import {
  getLanguage,
  type Language,
  type Locale,
  localeHref,
} from "@/lib/locales";

/**
 * Catalogue de textes, indexé par langue.
 *
 * La langue n'est plus lue dans `?lang=` : elle se déduit de la locale portée
 * par l'URL (voir src/lib/locales.ts). Les pages reçoivent donc leur locale
 * en paramètre de route et la convertissent ici.
 */

/** @deprecated Utiliser `Language` : ce type désignait la langue, pas la locale. */
export type { Language };

/** Langue déduite d'une locale d'URL (« fr-be » → « fr »). */
export function languageOf(locale?: string | null): Language {
  return getLanguage(locale);
}

/**
 * Dictionnaire de textes propre à une page ou à un composant.
 *
 * Le français et l'anglais sont obligatoires — ce sont les deux langues que le
 * produit sert. Les autres restent facultatives et retombent sur le français ;
 * elles ne sont de toute façon pas routables tant que leur catalogue n'est pas
 * complet (voir `catalogueComplete` dans src/lib/locales.ts).
 */
export type PageCopy<T> = Record<Language, T>;

/** Choisit la variante de langue, français par défaut. */
export function pickCopy<T>(copy: PageCopy<T>, language: Language): T {
  return copy[language] ?? copy.fr;
}

/** @deprecated Le paramètre `?lang=` est redirigé vers le chemin par le middleware. */
export type SearchParams = Record<string, string | string[] | undefined>;

/** Préfixe un chemin par la locale courante. */
export function localizedHref(href: string, locale: Locale | string): string {
  return localeHref(href, locale);
}
export const nls = { fr, en } as const;

export type Dictionary = typeof fr;

/** Garde-fou de compilation : l'anglais doit couvrir exactement les mêmes clés
 *  que le français. Une traduction manquante casse le build. */
const _enCoversFr: Dictionary = en;
void _enCoversFr;
