"use client";

import { Calculator, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CITIES,
  findCity,
  type PriceSuggestion,
  suggestPrice,
} from "@/lib/data/cities";

export function PriceSuggester() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("Paris");
  const [seats, setSeats] = useState(3);

  const suggestions = useMemo(() => CITIES.map((c) => c.name).sort(), []);

  const result = useMemo<{ ok: PriceSuggestion } | { error: string } | null>(
    () => {
      if (!from.trim() || !to.trim()) return null;
      const a = findCity(from);
      const b = findCity(to);
      if (!a) return { error: `Ville inconnue : « ${from} ». Essaie une ville plus connue (ex: Bruxelles, Lille, Lyon).` };
      if (!b) return { error: `Ville inconnue : « ${to} ». Essaie une ville plus connue (ex: Paris).` };
      if (a.name === b.name) return { error: "Le départ et l'arrivée doivent être différents." };
      return { ok: suggestPrice(a, b, seats) };
    },
    [from, to, seats],
  );

  return (
    <div className="rounded-2xl border border-blood/20 bg-gradient-to-br from-blood/5 to-coal p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-blood/15 flex items-center justify-center text-blood shrink-0">
          <Calculator className="size-5" />
        </div>
        <div>
          <p className="font-display text-sm uppercase text-paper">
            Calculateur de prix
          </p>
          <p className="text-paper-dim text-xs leading-relaxed font-body mt-1">
            Pas sûr du prix à fixer ? Indique ton trajet et le nombre de places, on te suggère un tarif juste basé sur la distance, l'essence et les péages.
          </p>
        </div>
      </div>

      <datalist id="trajet-cities">
        {suggestions.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-[10px] uppercase tracking-wide text-paper-dim">
            Départ
          </span>
          <input
            type="text"
            list="trajet-cities"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Bruxelles"
            className="h-11 w-full rounded-lg border border-white/10 bg-smoke px-3 text-sm text-paper placeholder:text-paper-dim outline-none focus:border-blood/50"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[10px] uppercase tracking-wide text-paper-dim">
            Arrivée
          </span>
          <input
            type="text"
            list="trajet-cities"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Paris"
            className="h-11 w-full rounded-lg border border-white/10 bg-smoke px-3 text-sm text-paper placeholder:text-paper-dim outline-none focus:border-blood/50"
          />
        </label>
        <label className="space-y-1 col-span-2">
          <span className="text-[10px] uppercase tracking-wide text-paper-dim">
            Nombre de passagers : {seats}
          </span>
          <input
            type="range"
            min={1}
            max={6}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full accent-blood"
          />
        </label>
      </div>

      {result && "error" in result && (
        <p className="text-xs text-amber-300/90 leading-relaxed">
          {result.error}
        </p>
      )}

      {result && "ok" in result && (
        <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-blood">
            <Sparkles className="size-4" />
            <span className="font-display text-xs uppercase tracking-wide">
              Prix conseillé
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl text-paper">
              {result.ok.perPlaceFair}€
            </span>
            <span className="text-paper-dim text-xs">par place</span>
          </div>

          <p className="text-paper-dim text-xs">
            Fourchette raisonnable :{" "}
            <span className="text-paper font-mono">
              {result.ok.perPlaceMin}€ – {result.ok.perPlaceMax}€
            </span>
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
            <div>
              <div className="text-[10px] uppercase text-paper-dim">Distance</div>
              <div className="font-mono text-sm text-paper">{result.ok.roadKm} km</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-paper-dim">Coût total estimé</div>
              <div className="font-mono text-sm text-paper">{result.ok.totalCost}€</div>
            </div>
          </div>

          <p className="text-[10px] text-paper-dim/70 leading-relaxed pt-1">
            Estimation basée sur ~8,5c/km d'essence + 4c/km de péages, divisée entre toi et tes passagers. Ajuste selon ton véhicule.
          </p>
        </div>
      )}
    </div>
  );
}
