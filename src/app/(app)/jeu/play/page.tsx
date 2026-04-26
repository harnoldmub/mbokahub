import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { SapeRunClient } from "@/components/game/sape-run-client";
import {
  getLocaleFromSearchParams,
  localizedHref,
  nls,
  type SearchParams,
} from "@/lib/nls";

export const dynamic = "force-dynamic";

type JeuPlayPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function JeuPlayPage({ searchParams }: JeuPlayPageProps) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].game;

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
          href={localizedHref("/jeu", locale)}
          className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute transition-colors hover:text-blood"
        >
          <ChevronLeft className="size-3" />
          {copy.back}
        </Link>

        <SapeRunClient
          copy={{
            idleEyebrow: copy.idleEyebrow,
            idleTitle: `${copy.titleLine1} ${copy.titleLine2}`,
            idleTagline: copy.idleTagline,
            start: copy.start,
            controlsHint: copy.controlsHint,
            gameOver: copy.gameOver,
            fallen: copy.fallen,
            score: copy.score,
            record: copy.record,
            newRecord: copy.newRecord,
            retry: copy.retry,
            jumpHint: copy.jumpHint,
            recordLabel: copy.recordLabel,
            speed: copy.speed,
            goal: copy.goal,
            namePrompt: copy.namePrompt,
            namePlaceholder: copy.namePlaceholder,
            nameRequired: copy.nameRequired,
            playerLabel: copy.playerLabel,
          }}
        />
      </div>
    </main>
  );
}
