import { Plus } from "lucide-react";
import Link from "next/link";

import { AftersListClient } from "@/components/afters/afters-list-client";
import { Button } from "@/components/ui/button";
import { demoAfters } from "@/lib/demo-data";

export const dynamic = "force-static";

export default function AftersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
            Soirées post-concert
          </p>
          <h1 className="font-display text-6xl uppercase leading-[0.9] text-paper sm:text-7xl">
            Les <span className="font-serif italic text-ember">Afters</span>
          </h1>
          <p className="mt-4 max-w-md font-body text-paper-dim">
             Toutes les soirées validées par le Hub pour fêter l&apos;Aigle après le concert.
          </p>
        </div>
        <Button
          asChild
          className="h-14 px-8 border-ember/40 text-ember hover:bg-ember hover:text-paper"
          size="lg"
          variant="outline"
        >
          <Link href="/afters/organiser">
            <Plus aria-hidden className="mr-2 size-4" />
            Proposer un after
          </Link>
        </Button>
      </div>

      <AftersListClient afters={demoAfters} />
    </main>
  );
}
