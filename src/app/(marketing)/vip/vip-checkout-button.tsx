"use client";

import { useState } from "react";

export function VipCheckoutButton({ priceLabel }: { priceLabel: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/vip", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Erreur paiement");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur réseau";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 font-mono text-ink text-sm uppercase tracking-[0.2em] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
        onClick={handleClick}
        type="button"
      >
        {loading ? "Redirection..." : `Payer ${priceLabel} et devenir VIP`}
      </button>
      {error ? (
        <p className="text-center text-red-400 text-xs">{error}</p>
      ) : null}
    </div>
  );
}
