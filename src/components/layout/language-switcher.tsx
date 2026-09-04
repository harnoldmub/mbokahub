"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ALL_LOCALES,
  isLocale,
  LOCALE_META,
  LOCALES,
  type Locale,
  localeFromPathname,
} from "@/lib/locales";

/**
 * Sélecteur de locale.
 *
 * Il ne propose que les locales réellement servies — celles dont le catalogue
 * de traduction est complet (`catalogueComplete` dans src/lib/locales.ts).
 * Auparavant quatre langues étaient offertes alors que trois n'étaient
 * quasiment pas traduites : choisir « EN » ne changeait presque rien à
 * l'écran. Une locale dont le catalogue se termine apparaît ici d'elle-même.
 */
export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = localeFromPathname(pathname);

  // Rien à choisir tant qu'une seule locale est servie.
  if (LOCALES.length < 2) return null;

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as Locale;
    const segment = pathname.split("/")[1] ?? "";
    const rest = isLocale(segment)
      ? pathname.slice(`/${segment}`.length)
      : pathname;
    const query = searchParams.toString();
    router.push(`/${next}${rest}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="locale-select">
        Pays et langue
      </label>
      <select
        aria-label="Choisir le pays et la langue"
        className="
          h-9 cursor-pointer appearance-none rounded-full
          border border-white/10 bg-coal/60 pl-3 pr-7
          font-mono text-[10px] uppercase tracking-wider text-paper
          transition-colors hover:border-blood/40 hover:bg-blood/5
          focus:border-blood/60 focus:outline-none focus:ring-2 focus:ring-blood/30
        "
        id="locale-select"
        onChange={handleChange}
        value={current}
      >
        {ALL_LOCALES.filter((locale) => LOCALES.includes(locale)).map(
          (locale) => {
            const meta = LOCALE_META[locale];
            return (
              <option
                className="bg-coal text-paper"
                key={locale}
                value={locale}
              >
                {meta.flag} {meta.shortLabel}
              </option>
            );
          },
        )}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-mute text-xs"
      >
        ▾
      </span>
    </div>
  );
}
