"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type BoostButtonProps = {
  targetType: "TRAJET" | "PRO_PROFILE";
  targetId: string;
  alreadyBoosted?: boolean;
  size?: "sm" | "default";
  variant?: "default" | "outline";
};

export function BoostButton({
  targetType,
  targetId,
  alreadyBoosted,
  size = "sm",
  variant = "outline",
}: BoostButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (alreadyBoosted) {
    return (
      <Button disabled size={size} variant="outline">
        <Star aria-hidden className="size-4 fill-current" />
        Vedette active
      </Button>
    );
  }

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
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
        size={size}
        variant={variant}
      >
        <Star aria-hidden className="size-4" />
        {loading ? "Redirection..." : "Booster 9 €"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
