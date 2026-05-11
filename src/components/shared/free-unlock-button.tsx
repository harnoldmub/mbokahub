"use client";

import { Gift, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  targetId: string;
  targetType: "TRAJET" | "PRO_PROFILE";
  isAuthenticated: boolean;
};

export function FreeUnlockButton({ targetId, targetType, isAuthenticated }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlock() {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/unlock/free", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, targetType }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error ?? "Erreur");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <Button
        onClick={handleUnlock}
        disabled={loading}
        variant="outline"
        className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Gift className="size-4" />
        )}
        {loading
          ? "Débloquage..."
          : isAuthenticated
            ? "1er contact gratuit — offre découverte"
            : "Voir le contact — connexion requise"}
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
