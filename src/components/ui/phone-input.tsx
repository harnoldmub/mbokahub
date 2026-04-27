"use client";

import { useId, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type Country = {
  code: string;
  flag: string;
  name: string;
};

const COUNTRIES: Country[] = [
  { code: "33", flag: "🇫🇷", name: "France" },
  { code: "32", flag: "🇧🇪", name: "Belgique" },
  { code: "49", flag: "🇩🇪", name: "Allemagne" },
  { code: "34", flag: "🇪🇸", name: "Espagne" },
  { code: "1", flag: "🇨🇦", name: "Canada" },
  { code: "1", flag: "🇺🇸", name: "États-Unis" },
  { code: "44", flag: "🇬🇧", name: "Royaume-Uni" },
  { code: "41", flag: "🇨🇭", name: "Suisse" },
  { code: "31", flag: "🇳🇱", name: "Pays-Bas" },
  { code: "39", flag: "🇮🇹", name: "Italie" },
  { code: "351", flag: "🇵🇹", name: "Portugal" },
  { code: "352", flag: "🇱🇺", name: "Luxembourg" },
  { code: "243", flag: "🇨🇩", name: "RD Congo" },
  { code: "242", flag: "🇨🇬", name: "Congo-Brazzaville" },
  { code: "225", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "237", flag: "🇨🇲", name: "Cameroun" },
  { code: "221", flag: "🇸🇳", name: "Sénégal" },
  { code: "212", flag: "🇲🇦", name: "Maroc" },
  { code: "213", flag: "🇩🇿", name: "Algérie" },
  { code: "216", flag: "🇹🇳", name: "Tunisie" },
  { code: "244", flag: "🇦🇴", name: "Angola" },
  { code: "241", flag: "🇬🇦", name: "Gabon" },
];

const SORTED_PREFIXES = Array.from(new Set(COUNTRIES.map((c) => c.code))).sort(
  (a, b) => b.length - a.length,
);

function optionKey(c: Country): string {
  return `${c.code}-${c.name}`;
}

function parseInitial(value: string | undefined | null): {
  optionKey: string;
  number: string;
} {
  const fallbackKey = optionKey(COUNTRIES[0]!);
  if (!value) return { optionKey: fallbackKey, number: "" };

  const cleaned = value.replace(/[\s\-().]/g, "");

  let normalized = cleaned;
  if (normalized.startsWith("+")) {
    normalized = normalized.slice(1);
  } else if (normalized.startsWith("00")) {
    normalized = normalized.slice(2);
  } else {
    return { optionKey: fallbackKey, number: cleaned.replace(/^0/, "") };
  }

  const matchedPrefix = SORTED_PREFIXES.find((p) => normalized.startsWith(p));
  if (!matchedPrefix) {
    return { optionKey: fallbackKey, number: normalized };
  }

  const matchedCountry =
    COUNTRIES.find((c) => c.code === matchedPrefix) ?? COUNTRIES[0]!;
  return {
    optionKey: optionKey(matchedCountry),
    number: normalized.slice(matchedPrefix.length),
  };
}

type Props = {
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  selectClassName?: string;
  id?: string;
};

export function PhoneInput({
  name,
  defaultValue,
  required,
  placeholder = "6 12 34 56 78",
  className,
  inputClassName,
  selectClassName,
  id,
}: Props) {
  const reactId = useId();
  const inputId = id ?? `${reactId}-phone`;
  const initial = useMemo(() => parseInitial(defaultValue), [defaultValue]);
  const [selectedKey, setSelectedKey] = useState(initial.optionKey);
  const [number, setNumber] = useState(initial.number);

  const selectedCountry =
    COUNTRIES.find((c) => optionKey(c) === selectedKey) ?? COUNTRIES[0]!;

  const cleanedNumber = number.replace(/[^\d]/g, "").replace(/^0+/, "");
  const fullValue = cleanedNumber
    ? `+${selectedCountry.code}${cleanedNumber}`
    : "";

  return (
    <div className={cn("flex w-full items-stretch gap-2", className)}>
      <select
        aria-label="Indicatif pays"
        className={cn(
          "h-12 shrink-0 rounded-lg border border-white/10 bg-smoke px-2 font-mono text-sm text-paper outline-none transition-colors focus:border-blood/50 focus:ring-2 focus:ring-blood/20",
          selectClassName,
        )}
        onChange={(e) => setSelectedKey(e.target.value)}
        value={selectedKey}
      >
        {COUNTRIES.map((c) => (
          <option key={optionKey(c)} value={optionKey(c)}>
            {c.flag} +{c.code} {c.name}
          </option>
        ))}
      </select>

      <input
        aria-label="Numéro de téléphone"
        autoComplete="tel-national"
        className={cn(
          "h-12 w-full min-w-0 flex-1 rounded-lg border border-white/10 bg-smoke px-3 text-base text-paper placeholder:text-paper-mute outline-none transition-colors focus:border-blood/50 focus:ring-2 focus:ring-blood/20",
          inputClassName,
        )}
        id={inputId}
        inputMode="tel"
        onChange={(e) => setNumber(e.target.value)}
        placeholder={placeholder}
        required={required}
        type="tel"
        value={number}
      />

      <input name={name} type="hidden" value={fullValue} />
    </div>
  );
}
