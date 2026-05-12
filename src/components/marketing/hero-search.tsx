"use client";

import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { localizedHref } from "@/lib/nls";

type Suggestion = {
  services: string[];
  cities: string[];
  pros: {
    id: string;
    slug: string;
    displayName: string;
    city: string;
    category: string;
  }[];
};

const EMPTY: Suggestion = { services: [], cities: [], pros: [] };

function highlight(text: string, q: string) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <strong className="font-semibold text-paper">
        {text.slice(i, i + q.length)}
      </strong>
      {text.slice(i + q.length)}
    </>
  );
}

export function HeroSearch({ locale }: { locale: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [qSug, setQSug] = useState<Suggestion>(EMPTY);
  const [citySug, setCitySug] = useState<Suggestion>(EMPTY);
  const [openWhich, setOpenWhich] = useState<"q" | "city" | null>(null);
  const wrapperRef = useRef<HTMLFormElement>(null);
  const qInputId = useId();
  const cityInputId = useId();

  // Debounced fetch for "q" (services + pros + cities).
  useEffect(() => {
    if (q.trim().length < 3) {
      setQSug(EMPTY);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(q.trim())}`,
          { cache: "no-store", signal: ctrl.signal },
        );
        if (!res.ok) return;
        setQSug((await res.json()) as Suggestion);
      } catch {
        /* aborted or network */
      }
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q]);

  // Debounced fetch for city.
  useEffect(() => {
    if (city.trim().length < 2) {
      setCitySug(EMPTY);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggest?kind=city&q=${encodeURIComponent(city.trim())}`,
          { cache: "no-store", signal: ctrl.signal },
        );
        if (!res.ok) return;
        setCitySug((await res.json()) as Suggestion);
      } catch {
        /* */
      }
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [city]);

  // Close popover on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpenWhich(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(target: { q?: string; city?: string; href?: string }) {
    setOpenWhich(null);
    if (target.href) {
      router.push(target.href);
      return;
    }
    const params = new URLSearchParams();
    if (target.q) params.set("q", target.q);
    if (target.city) params.set("city", target.city);
    if (locale !== "fr") params.set("lang", locale);
    router.push(
      `${localizedHref("/prestataires", locale)}?${params.toString()}`,
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    go({ q: q.trim() || undefined, city: city.trim() || undefined });
  }

  const showQ =
    openWhich === "q" &&
    q.trim().length >= 3 &&
    (qSug.services.length + qSug.pros.length + qSug.cities.length > 0);
  const showCity =
    openWhich === "city" && city.trim().length >= 2 && citySug.cities.length > 0;

  return (
    <form
      ref={wrapperRef}
      onSubmit={handleSubmit}
      className="relative mt-8 grid gap-2 rounded-xl border border-[#d7dbe2] bg-white p-2 shadow-[0_24px_60px_-42px_rgba(20,20,20,0.35)] sm:grid-cols-[1fr_0.8fr_auto]"
    >
      {/* Service / pro / category input */}
      <div className="relative">
        <label htmlFor={qInputId} className="sr-only">
          Que cherchez-vous&nbsp;?
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-paper-mute" />
        <input
          id={qInputId}
          name="q"
          type="search"
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpenWhich("q");
          }}
          onFocus={() => setOpenWhich("q")}
          placeholder="Coiffeur, maquilleuse, photographe..."
          className="h-12 w-full rounded-lg border border-transparent bg-smoke py-3 pl-12 pr-4 text-sm text-paper outline-none transition placeholder:text-paper-mute focus:border-blood/50 focus:bg-white"
        />

        {showQ ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-[0_24px_60px_-20px_rgba(20,20,20,0.25)]">
            {qSug.services.length > 0 ? (
              <div className="px-2 pt-2">
                <p className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute">
                  Prestations
                </p>
                <ul>
                  {qSug.services.map((s) => (
                    <li key={`s-${s}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setQ(s);
                          go({ q: s });
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-paper-dim transition hover:bg-smoke"
                      >
                        <Search className="size-4 text-paper-mute" />
                        <span>{highlight(s, q)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {qSug.pros.length > 0 ? (
              <div className="px-2 pt-2">
                <p className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute">
                  Prestataires
                </p>
                <ul>
                  {qSug.pros.map((p) => (
                    <li key={`p-${p.id}`}>
                      <button
                        type="button"
                        onClick={() =>
                          go({
                            href: localizedHref(`/pro/${p.id}`, locale),
                          })
                        }
                        className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-smoke"
                      >
                        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-smoke text-xs font-semibold uppercase text-blood">
                          {p.displayName.slice(0, 1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-paper">
                            {highlight(p.displayName, q)}
                          </p>
                          <p className="truncate text-xs text-paper-mute">
                            {p.city}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {qSug.cities.length > 0 ? (
              <div className="px-2 pb-2 pt-2">
                <p className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute">
                  Villes
                </p>
                <ul>
                  {qSug.cities.map((c) => (
                    <li key={`c-${c}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setCity(c);
                          go({ city: c });
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-paper-dim transition hover:bg-smoke"
                      >
                        <MapPin className="size-4 text-paper-mute" />
                        <span>{highlight(c, q)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* City input */}
      <div className="relative">
        <label htmlFor={cityInputId} className="sr-only">
          Ville
        </label>
        <MapPin className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-paper-mute" />
        <input
          id={cityInputId}
          name="city"
          type="search"
          autoComplete="off"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setOpenWhich("city");
          }}
          onFocus={() => setOpenWhich("city")}
          placeholder="Ville ou quartier"
          className="h-12 w-full rounded-lg border border-transparent bg-smoke py-3 pl-12 pr-4 text-sm text-paper outline-none transition placeholder:text-paper-mute focus:border-blood/50 focus:bg-white"
        />

        {showCity ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-[0_24px_60px_-20px_rgba(20,20,20,0.25)]">
            <ul className="p-2">
              {citySug.cities.map((c) => (
                <li key={`cc-${c}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setCity(c);
                      go({ q: q.trim() || undefined, city: c });
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-paper-dim transition hover:bg-smoke"
                  >
                    <MapPin className="size-4 text-paper-mute" />
                    <span>{highlight(c, city)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {locale !== "fr" ? (
        <input name="lang" type="hidden" value={locale} />
      ) : null}
      <Button className="h-12 rounded-lg px-6" type="submit">
        Rechercher
      </Button>
    </form>
  );
}
