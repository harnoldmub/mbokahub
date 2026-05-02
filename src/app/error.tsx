"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <section className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-20 text-center">
      <div>
        <p className="font-mono text-muted-foreground text-sm">
          ERREUR{error.digest ? ` · ${error.digest}` : ""}
        </p>
        <h1 className="mt-3 font-heading text-3xl text-foreground">
          Quelque chose a glissé
        </h1>
        <p className="mt-4 text-muted-foreground">
          Cette page n&apos;a pas pu se charger. Tu peux réessayer ou revenir à
          l&apos;accueil — on a noté l&apos;erreur de notre côté.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset}>Réessayer</Button>
          <Button asChild variant="outline">
            <Link href="/">Retour accueil</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
