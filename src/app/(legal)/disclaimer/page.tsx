import type { Metadata } from "next";

import { LEGAL_DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Indépendance et limites de responsabilité de Mboka Hub.",
};

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-primary text-sm uppercase">Disclaimer</p>
      <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl">
        Plateforme indépendante
      </h1>
      <div className="mt-8 grid gap-6 text-muted-foreground text-lg leading-8">
        <p className="border border-white/10 bg-card p-5 text-foreground">
          {LEGAL_DISCLAIMER}
        </p>
        <p>
          Mboka Hub référence des annonces, profils, bons plans et événements
          tiers pour faciliter la mise en relation. Les informations affichées
          peuvent évoluer et doivent être confirmées auprès des personnes,
          lieux, services ou billetteries externes concernés.
        </p>
        <p>
          Mboka Hub ne revend aucun billet, ne garantit aucune entrée à un
          événement externe et ne traite aucun paiement entre utilisateurs.
        </p>
      </div>
    </article>
  );
}
