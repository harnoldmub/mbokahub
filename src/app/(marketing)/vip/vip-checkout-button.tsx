"use client";

import { Tag } from "lucide-react";
import { useState } from "react";

export function VipCheckoutButton({ priceLabel }: { priceLabel: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode: promoCode.trim() || undefined }),
      });
      const data = (await res.json()) as {
        url?: string;
        redirect?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Erreur paiement");
        setLoading(false);
        return;
      }
      const target = data.url ?? data.redirect;
      if (!target) {
        setError("URL manquante");
        setLoading(false);
        return;
      }
      window.location.href = target;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur réseau";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <button
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 font-mono text-ink text-sm uppercase tracking-[0.2em] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
        onClick={handleClick}
        type="button"
      >
        {loading
          ? "Redirection..."
          : promoCode.trim()
            ? `Activer le code et payer ${priceLabel}`
            : `Payer ${priceLabel} et devenir VIP`}
      </button>

      {showPromo ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <label
            htmlFor="vip-promo"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute"
          >
            Code promo
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="vip-promo"
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="MBKFREE"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 rounded-md bg-ink/60 px-3 py-2 font-mono text-paper text-sm uppercase tracking-widest placeholder:text-paper-mute focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => {
                setPromoCode("");
                setShowPromo(false);
                setError(null);
              }}
              className="rounded-md border border-white/10 px-3 py-2 text-paper-mute text-xs hover:border-white/30 hover:text-paper"
            >
              Annuler
            </button>
          </div>
          <p className="mt-2 text-paper-mute text-[11px]">
            Si tu as un code 100% gratuit, l&apos;accès VIP s&apos;active sans
            paiement.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowPromo(true)}
          className="inline-flex items-center justify-center gap-2 self-center font-mono text-[11px] text-paper-mute uppercase tracking-[0.2em] hover:text-paper"
        >
          <Tag className="size-3" /> J&apos;ai un code promo
        </button>
      )}

      {error ? (
        <p className="text-center text-red-400 text-xs">{error}</p>
      ) : null}
    </div>
  );
}
