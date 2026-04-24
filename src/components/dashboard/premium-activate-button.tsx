"use client";

import { Sparkles } from "lucide-react";
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
        body: JSON.stringify({ category }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Erreur paiement");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleClick}
        disabled={loading}
        className="shadow-glow-blood"
      >
        <Sparkles aria-hidden className="size-4" />
        {loading ? "Redirection..." : `Activer ma fiche pro ${formatEuro(PRICE_PRO_EUR)}`}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
