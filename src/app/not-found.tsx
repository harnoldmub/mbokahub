import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-20 text-center">
      <div>
        <p className="font-mono text-muted-foreground text-sm">404</p>
        <h1 className="mt-3 font-heading text-3xl text-foreground">
          Page introuvable
        </h1>
        <p className="mt-4 text-muted-foreground">
          Cette page n&apos;est pas encore disponible sur Mboka Hub.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Retour accueil</Link>
        </Button>
      </div>
    </section>
  );
}
