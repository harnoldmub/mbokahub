"use client";

import { MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// ─── Supported countries ─────────────────────────────────────────────────────
// FR → geo.api.gouv.fr  (officiel, sans clé, ultra-rapide)
// BE / CG / * → Photon  (OpenStreetMap, mondial, sans clé)

export type SupportedCountry = "FR" | "BE" | "CG" | string;

type CityResult = {
  name: string;
  region?: string;
  country?: string;
};

// ─── API helpers ─────────────────────────────────────────────────────────────

async function searchFR(query: string): Promise<CityResult[]> {
  const url = new URL("https://geo.api.gouv.fr/communes");
  url.searchParams.set("nom", query.trim());
  url.searchParams.set("fields", "nom,codeDepartement,departement");
  url.searchParams.set("boost", "population");
  url.searchParams.set("limit", "8");
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data: { nom: string; departement?: { nom: string } }[] =
    await res.json();
  return data.map((c) => ({
    name: c.nom,
    region: c.departement?.nom,
    country: "France",
  }));
}

// Country bounding boxes for Photon filtering
const BBOX: Record<string, [number, number, number, number]> = {
  BE: [2.5, 49.5, 6.4, 51.5],
  CG: [11.1, -5.1, 18.7, 3.7],
};

async function searchPhoton(
  query: string,
  country: string,
): Promise<CityResult[]> {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query.trim());
  url.searchParams.set("lang", "fr");
  url.searchParams.set("limit", "8");
  url.searchParams.set("osm_tag", "place:city");
  url.searchParams.append("osm_tag", "place:town");
  url.searchParams.append("osm_tag", "place:village");
  const bbox = BBOX[country.toUpperCase()];
  if (bbox) {
    url.searchParams.set(
      "bbox",
      bbox.join(","),
    );
  }
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data: {
    features: {
      properties: { name?: string; state?: string; country?: string };
    }[];
  } = await res.json();
  return data.features
    .filter((f) => f.properties.name)
    .map((f) => ({
      name: f.properties.name!,
      region: f.properties.state,
      country: f.properties.country,
    }));
}

async function searchCities(
  query: string,
  country: SupportedCountry,
): Promise<CityResult[]> {
  if (query.trim().length < 2) return [];
  try {
    if (country === "FR") return await searchFR(query);
    return await searchPhoton(query, country);
  } catch {
    return [];
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  name: string;
  country?: SupportedCountry;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  onChange?: (value: string) => void;
};

export function CityInput({
  name,
  country = "FR",
  defaultValue = "",
  placeholder = "Paris, Lyon, Marseille…",
  required,
  className,
  inputClassName,
  onChange,
}: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [selected, setSelected] = useState(defaultValue);
  const [results, setResults] = useState<CityResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query === selected) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const cities = await searchCities(query, country);
      setResults(cities);
      setOpen(cities.length > 0);
      setLoading(false);
    }, 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, selected, country]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (city: CityResult) => {
    setQuery(city.name);
    setSelected(city.name);
    setOpen(false);
    onChange?.(city.name);
  };

  const clear = () => {
    setQuery("");
    setSelected("");
    setResults([]);
    setOpen(false);
    onChange?.("");
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <input type="hidden" name={name} value={selected} required={required} />

      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-paper-mute" />
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selected && e.target.value !== selected) setSelected("");
          }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-xl border border-white/5 bg-smoke py-3 pl-10 pr-9 text-sm text-paper placeholder:text-paper-mute transition focus:border-blood focus:outline-none",
            inputClassName,
          )}
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label="Effacer"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-paper-mute transition hover:bg-white/10 hover:text-paper"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-coal shadow-2xl">
          {loading ? (
            <li className="px-4 py-3 text-sm text-paper-mute">Recherche…</li>
          ) : (
            results.map((city, i) => (
              <li key={`${city.name}-${i}`}>
                <button
                  type="button"
                  onClick={() => select(city)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-white/5"
                >
                  <MapPin className="size-3.5 shrink-0 text-blood" />
                  <span>
                    <span className="font-medium text-paper">{city.name}</span>
                    {city.region && (
                      <span className="ml-2 text-paper-mute">{city.region}</span>
                    )}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
