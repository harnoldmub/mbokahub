"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getLocale, type Locale, locales } from "@/lib/nls";

const localeOrder: Locale[] = ["fr", "en", "de", "nl"];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = getLocale(searchParams.get("lang"));

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as Locale;
    const params = new URLSearchParams(searchParams.toString());
    if (next === "fr") {
      params.delete("lang");
    } else {
      params.set("lang", next);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="relative">
      <label htmlFor="lang-select" className="sr-only">
        Langue
      </label>
      <select
        id="lang-select"
        aria-label="Sélectionner la langue"
        value={currentLocale}
        onChange={handleChange}
        className="
          h-9 cursor-pointer appearance-none rounded-full
          border border-white/10 bg-coal/60 pl-3 pr-7
          font-mono text-[10px] uppercase tracking-wider text-paper
          transition-colors hover:border-blood/40 hover:bg-blood/5
          focus:border-blood/60 focus:outline-none focus:ring-2 focus:ring-blood/30
        "
      >
        {localeOrder.map((locale) => {
          const item = locales[locale];
          return (
            <option
              key={locale}
              value={locale}
              className="bg-coal text-paper"
            >
              {item.flag} {item.shortLabel}
            </option>
          );
        })}
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
