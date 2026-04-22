import { type Locale, locales } from "@/lib/nls";

const localeOrder: Locale[] = ["fr", "en", "de", "nl"];

export function LanguageSwitcher() {
  return (
    <nav aria-label="Langues" className="hidden items-center gap-1 lg:flex">
      {localeOrder.map((locale) => {
        const item = locales[locale];

        return (
          <a
            aria-label={item.label}
            className="flex h-8 items-center gap-1 rounded-full border border-white/10 px-2 font-mono text-[10px] text-paper-dim transition hover:border-blood/40 hover:text-paper"
            href={`/?lang=${locale}`}
            hrefLang={locale}
            key={locale}
          >
            <span aria-hidden>{item.flag}</span>
            <span>{item.shortLabel}</span>
          </a>
        );
      })}
    </nav>
  );
}
