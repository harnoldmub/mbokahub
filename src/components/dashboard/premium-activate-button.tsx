"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatEuro, PRICE_PRO_EUR } from "@/lib/marketing-data";

type PremiumActivateButtonProps = {
  category: string;
  alreadyActive?: boolean;
  paymentsEnabled?: boolean;
};

export function PremiumActivateButton({
  category,
  alreadyActive,
  paymentsEnabled = false,
}: PremiumActivateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (alreadyActive) {
    return (
      <Button disabled variant="outline">
        <Sparkles aria-hidden className="size-4 fill-current" />
        Mise en avant active
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
      const data = (await res.json()) as {
        redirect?: string;
        url?: string;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Activation impossible");
      }
      const target = data.redirect ?? data.url;
      const isInternal = !!target && /^\/(?!\/)/.test(target);
      const isStripe =
        !!target && /^https:\/\/(checkout|billing)\.stripe\.com\//.test(target);
      if (!target || (!isInternal && !isStripe)) {
        throw new Error("URL de redirection invalide");
      }
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
          ? "Activation..."
          : paymentsEnabled
            ? `Mettre ma fiche en avant · ${formatEuro(PRICE_PRO_EUR)}`
            : "Mettre ma fiche en avant gratuitement"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
