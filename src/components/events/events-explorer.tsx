"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { EventCard } from "@/components/events/event-card";
import type { NeventEvent } from "@/lib/events";

const chips = [
  "Tous",
  "Concerts",
  "Afrobeats",
  "Amapiano",
  "Rumba",
  "Afro R&B",
  "Festivals",
  "Soirées",
  "Culture",
] as const;

export function EventsExplorer({
  events,
  locale,
  initialCity,
  initialArtist,
}: {
  events: NeventEvent[];
  locale: string;
  initialCity?: string;
  initialArtist?: string;
}) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<(typeof chips)[number]>("Tous");
  const [city, setCity] = useState(initialCity ?? "Toutes");
  const [country, setCountry] = useState("Tous");
  const [artist, setArtist] = useState(initialArtist ?? "Tous");
  const [date, setDate] = useState("");

  const cities = ["Toutes", ...new Set(events.map((event) => event.city))];
  const countries = ["Tous", ...new Set(events.map((event) => event.country))];
  const artists = ["Tous", ...new Set(events.map((event) => event.artist))];

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("fr");
    return events.filter((event) => {
      const matchesQuery =
        !needle ||
        [event.artist, event.title, event.city, event.venue]
          .join(" ")
          .toLocaleLowerCase("fr")
          .includes(needle);
      const matchesChip =
        chip === "Tous" ||
        (chip === "Concerts" && event.category === "Concert") ||
        event.genres.includes(chip);
      return (
        matchesQuery &&
        matchesChip &&
        (city === "Toutes" || event.city === city) &&
        (country === "Tous" || event.country === country) &&
        (artist === "Tous" || event.artist === artist) &&
        (!date || event.startDate.slice(0, 10) >= date)
      );
    });
  }, [artist, chip, city, country, date, events, query]);

  function reset() {
    setQuery("");
    setChip("Tous");
    setCity(initialCity ?? "Toutes");
    setCountry("Tous");
    setArtist(initialArtist ?? "Tous");
    setDate("");
  }

  return (
    <div>
      <div className="sticky top-0 z-20 border-y border-black/10 bg-white/95 py-5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <label className="relative block" htmlFor={searchId}>
            <span className="sr-only">
              Rechercher un artiste, événement ou une ville
            </span>
            <Search
              aria-hidden
              className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-paper-mute"
            />
            <input
              className="h-14 w-full rounded-full border border-black/15 bg-smoke pl-14 pr-5 text-base outline-none transition focus:border-blood focus:ring-2 focus:ring-blood/20"
              id={searchId}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Artiste, événement ou ville..."
              type="search"
              value={query}
            />
          </label>
          <fieldset className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <legend className="sr-only">Genres d’événements</legend>
            {chips.map((item) => (
              <button
                className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${chip === item ? "border-black bg-black text-white" : "border-black/15 bg-white text-paper hover:border-black/40"}`}
                key={item}
                onClick={() => setChip(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </fieldset>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Ville"
              onChange={setCity}
              options={cities}
              value={city}
            />
            <FilterSelect
              label="Pays"
              onChange={setCountry}
              options={countries}
              value={country}
            />
            <FilterSelect
              label="Artiste"
              onChange={setArtist}
              options={artists}
              value={artist}
            />
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-paper-dim">
              À partir du
              <input
                className="h-11 rounded-xl border border-black/15 bg-white px-3 text-sm font-normal normal-case tracking-normal text-paper outline-none focus:border-blood focus:ring-2 focus:ring-blood/20"
                min="2026-09-04"
                onChange={(event) => setDate(event.target.value)}
                type="date"
                value={date}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-sm text-paper-dim">
            <SlidersHorizontal aria-hidden className="size-4" />
            {filtered.length} événement{filtered.length === 1 ? "" : "s"}
          </p>
          <button
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-paper hover:text-blood"
            onClick={reset}
            type="button"
          >
            <X aria-hidden className="size-4" /> Réinitialiser
          </button>
        </div>
        {filtered.length ? (
          <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard event={event} key={event.slug} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-smoke px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold">
              Aucun événement ne correspond à ces filtres.
            </h2>
            <p className="mt-2 text-paper-dim">
              Essaie une autre ville, un autre genre ou une date plus proche.
            </p>
            <button
              className="mt-6 min-h-11 rounded-full bg-black px-5 text-sm font-bold text-white"
              onClick={reset}
              type="button"
            >
              Voir tous les événements
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-paper-dim">
      {label}
      <select
        className="h-11 rounded-xl border border-black/15 bg-white px-3 text-sm font-normal normal-case tracking-normal text-paper outline-none focus:border-blood focus:ring-2 focus:ring-blood/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
