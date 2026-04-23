import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { SapeRunClient } from "@/components/game/sape-run-client";

export const dynamic = "force-static";

export default function JeuPlayPage() {
  return (
    <main className="relative min-h-screen bg-ink overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/2 size-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-blood/8 blur-[150px]" />
        <span className="absolute left-[-5vw] bottom-[5vh] font-display text-[28vw] text-blood opacity-[0.03] uppercase leading-none select-none">
          RUN
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10">
        <Link
          href="/jeu"
          className="mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute transition-colors hover:text-blood"
        >
          <ChevronLeft className="size-3" />
          Retour au jeu
        </Link>

        <div className="mb-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-blood">
            Mboka Hub × Stade de France 2026
          </p>
          <h1 className="mt-3 font-display text-5xl uppercase text-paper leading-tight sm:text-6xl">
            Sape Run
          </h1>
          <p className="mt-3 font-serif italic text-paper-dim">
            Le Sapeur doit traverser Paris — aide-le !
          </p>
        </div>

        <SapeRunClient />
      </div>
    </main>
  );
}
