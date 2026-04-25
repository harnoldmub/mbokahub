import { Plus } from "lucide-react";
import Link from "next/link";

import { VipMemberBanner } from "@/components/marketing/vip-member-banner";
import { TrajetsListClient } from "@/components/trajets/trajets-list-client";
import { Button } from "@/components/ui/button";
import type { TrajetDemo } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default function TrajetsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <VipMemberBanner message="Tous les contacts covoiturage WhatsApp sont débloqués." />
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            Covoiturage
          </p>
          <h1 className="font-display text-6xl uppercase leading-[0.9] text-paper sm:text-7xl">
            Trouver <br />
            <span className="font-serif italic text-blood">un trajet</span>
          </h1>
          <p className="mt-4 max-w-md font-body text-paper-dim">
            Fais le trajet avec d&apos;autres fans de la Famille Mboka. Économise, rencontre l&apos;Aigle, et
            arrive en toute sécurité au Stade.
          </p>
        </div>
        <Button
          asChild
          className="h-14 px-8 shadow-[var(--glow-red)]"
          size="lg"
        >
          <Link href="/trajets/publier">
            <Plus aria-hidden className="mr-2 size-4" />
            Publier un trajet
          </Link>
        </Button>
      </div>

      <TrajetsListClient trajets={[] as TrajetDemo[]} />
    </main>
  );
}
