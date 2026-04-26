"use client";

import { Sparkles, Tag } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PRICE_PRO_EUR, formatEuro } from "@/lib/marketing-data";

type PremiumActivateButtonProps = {
  category: string;
  alreadyActive?: boolean;
};

export function PremiumActivateButton({
  category,
  alreadyActive,
}: PremiumActivateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  if (alreadyActive) {
    return (
      <Button disabled variant="outline">
        <Sparkles aria-hidden className="size-4 fill-current" />
        Premium actif
      </Button>
    );
  }

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          promoCode: promoCode.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        url?: string;
        redirect?: string;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur paiement");
      }
      const target = data.url ?? data.redirect;
      if (!target) throw new Error("URL manquante");
      window.location.href = target;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleClick}
        disabled={loading}
        className="shadow-glow-blood"
      >
        <Sparkles aria-hidden className="size-4" />
        {loading
          ? "Redirection..."
          : promoCode.trim()
            ? `Activer le code Premium`
            : `Activer ma fiche pro ${formatEuro(PRICE_PRO_EUR)}`}
      </Button>

      {showPromo ? (
        <div className="w-full max-w-xs rounded-xl border border-white/10 bg-white/5 p-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="CODE PRO"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 rounded-md bg-ink/60 px-2 py-1.5 font-mono text-paper text-xs uppercase tracking-widest placeholder:text-paper-mute focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => {
                setPromoCode("");
                setShowPromo(false);
                setError(null);
              }}
              className="rounded-md border border-white/10 px-2 py-1.5 text-paper-mute text-[10px] hover:border-white/30 hover:text-paper"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowPromo(true)}
          className="inline-flex items-center gap-1 font-mono text-[10px] text-paper-mute uppercase tracking-[0.2em] hover:text-paper"
        >
          <Tag className="size-3" /> J&apos;ai un code promo
        </button>
      )}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
