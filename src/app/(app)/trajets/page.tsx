import { Plus } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { TrajetCard } from "@/components/trajets/trajet-card";
import { Button } from "@/components/ui/button";
import { demoTrajets } from "@/lib/demo-data";

export default function TrajetsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          number="01"
          description="Fais le trajet avec d'autres fans. Économise, rencontre, et arrive en toute sécurité."
          eyebrow="Covoiturage"
          title="Trouver un trajet"
        />
        <Button asChild className="shadow-[var(--glow-red)]">
          <Link href="/trajets/publier">
            <Plus aria-hidden /> Publier un trajet
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {demoTrajets.map((trajet) => (
          <TrajetCard key={trajet.id} trajet={trajet} />
        ))}
      </div>
    </main>
  );
}
