"use client";

import {
  ArrowRight,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { NeventEvent } from "@/lib/events";
import { localizedHref } from "@/lib/nls";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

export function EventHero({
  events,
  locale,
}: {
  events: NeventEvent[];
  locale: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || events.length < 2 || paused) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % events.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [events.length, paused]);

  const event = events[active];
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : null;
  const dates = end
    ? `${dateFormatter.format(start)} — ${dateFormatter.format(end)}`
    : dateFormatter.format(start);

  function move(delta: number) {
    setActive((current) => (current + delta + events.length) % events.length);
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Événements à la une"
      className="relative isolate min-h-[680px] overflow-hidden bg-black text-white sm:min-h-[720px] lg:min-h-[760px]"
    >
      {events.map((slide, index) => (
        <Image
          alt={index === active ? slide.imageAlt : ""}
          aria-hidden={index !== active}
          className={`object-cover object-center transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"}`}
          fill
          key={slide.slug}
          priority={index === 0}
          sizes="100vw"
          src={slide.image}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.9)_0%,rgba(0,0,0,.62)_42%,rgba(0,0,0,.15)_75%),linear-gradient(0deg,rgba(0,0,0,.85)_0%,transparent_55%)]" />

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-end px-5 pb-12 pt-24 sm:min-h-[720px] sm:px-6 sm:pb-16 lg:min-h-[760px] lg:px-8 lg:pb-20">
        <div aria-live="polite" className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blood px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
              À la une
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              {event.category} · {event.genres.join(" · ")}
            </span>
          </div>
          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-white/85 sm:text-base">
            {event.city} · {event.venue}
          </p>
          <h1 className="mt-3 font-display text-[clamp(4rem,12vw,9.5rem)] uppercase leading-[0.82] tracking-[-0.025em]">
            {event.artist}
          </h1>
          <p className="mt-6 text-base font-semibold capitalize text-white sm:text-xl">
            {dates}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Découvre l’événement. Organise toute ton expérience.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              href={localizedHref(`/evenements/${event.slug}`, locale)}
            >
              Voir l’événement
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/20 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              href={localizedHref(
                `/trajets?destination=${encodeURIComponent(event.city)}&date=${event.startDate.slice(0, 10)}`,
                locale,
              )}
            >
              <CarFront aria-hidden className="size-4" />
              Organiser mon trajet
            </Link>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <button
            aria-label="Événement précédent"
            className="grid size-12 place-items-center rounded-full border border-white/30 bg-black/30 text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => move(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button
            aria-label={
              paused
                ? "Relancer le défilement automatique"
                : "Mettre le défilement automatique en pause"
            }
            className="grid size-12 place-items-center rounded-full border border-white/30 bg-black/30 text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setPaused((value) => !value)}
            type="button"
          >
            {paused ? (
              <Play aria-hidden className="size-4" />
            ) : (
              <Pause aria-hidden className="size-4" />
            )}
          </button>
          <button
            aria-label="Événement suivant"
            className="grid size-12 place-items-center rounded-full border border-white/30 bg-black/30 text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => move(1)}
            type="button"
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
          <p className="ml-2 font-mono text-xs text-white/65">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(events.length).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}
