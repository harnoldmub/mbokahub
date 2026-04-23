"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { getLocale, type Locale, locales } from "@/lib/nls";

const localeOrder: Locale[] = ["fr", "en", "de", "nl"];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = getLocale(searchParams.get("lang"));

  function getLanguageHref(locale: Locale) {
    const params = new URLSearchParams(searchParams.toString());
    if (locale === "fr") {
      params.delete("lang");
    } else {
      params.set("lang", locale);
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <nav aria-label="Langues" className="flex items-center gap-1">
      {localeOrder.map((locale) => {
        const item = locales[locale];
        const isActive = currentLocale === locale;

        return (
          <a
            key={locale}
            aria-label={item.label}
            aria-current={isActive ? "true" : undefined}
            href={getLanguageHref(locale)}
            hrefLang={locale}
            title={item.label}
            className={`
              flex h-9 items-center gap-1.5 rounded-full border px-2.5
              font-mono text-[10px] uppercase tracking-wider
              transition-all duration-200
              ${isActive
                ? "border-blood/60 bg-blood/10 text-paper shadow-[0_0_10px_rgba(230,57,70,0.15)]"
                : "border-white/10 bg-transparent text-paper-dim hover:border-white/30 hover:bg-white/5 hover:text-paper"
              }
            `}
          >
            <span className="text-base leading-none" aria-hidden>
              {item.flag}
            </span>
            <span className="hidden sm:inline">{item.shortLabel}</span>
          </a>
        );
      })}
    </nav>
  );
}
