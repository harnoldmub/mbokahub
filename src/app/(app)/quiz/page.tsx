import { ArrowRight, BrainCircuit, Share2, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  getLocaleFromSearchParams,
  localizedHref,
  nls,
  type SearchParams,
} from "@/lib/nls";

type QuizPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].quiz;

  return (
    <main className="relative min-h-[90svh] flex items-center justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-blood/10 blur-[150px] rounded-full" />
        <span className="absolute left-[5%] top-[10%] font-display text-[20vw] text-paper opacity-[0.02] select-none uppercase leading-none">
          WARRIOR
        </span>
      </div>

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <div className="mb-10 inline-flex size-20 items-center justify-center rounded-3xl bg-smoke border border-white/10 text-blood shadow-glow-blood animate-pulse">
          <BrainCircuit className="size-10" />
        </div>

        <h1 className="mb-8 font-display text-7xl text-paper uppercase leading-[0.9] sm:text-9xl">
          {copy.titleLine1} <br />
          <span className="font-serif text-[0.8em] text-blood italic">
            {copy.titleLine2}
          </span>
        </h1>

        <p className="mx-auto mb-12 max-w-xl text-xl text-paper-dim leading-relaxed font-body italic">
          {copy.description}
        </p>

        <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-coal/50 p-6 text-left transition-colors hover:border-blood/30">
            <Sparkles className="mb-4 size-5 text-gold" />
            <p className="mb-2 font-mono text-[10px] text-paper-mute uppercase tracking-widest">
              {copy.rewardLabel}
            </p>
            <p className="text-paper text-sm leading-relaxed">
              {copy.rewardText}
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-coal/50 p-6 text-left transition-colors hover:border-blood/30">
            <Share2 className="mb-4 size-5 text-blood" />
            <p className="mb-2 font-mono text-[10px] text-paper-mute uppercase tracking-widest">
              {copy.communityLabel}
            </p>
            <p className="text-paper text-sm leading-relaxed">
              {copy.communityText}
            </p>
          </div>
        </div>

        <div className="mt-16">
          <Button
            asChild
            className="h-20 px-12 text-2xl shadow-glow-blood bg-blood hover:bg-blood/90 group"
            size="lg"
          >
            <Link href={localizedHref("/quiz/start", locale)}>
              {copy.cta}
              <ArrowRight className="ml-3 size-7 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
          <p className="mt-6 font-mono text-[10px] text-paper-mute uppercase tracking-[0.3em]">
            {copy.duration}
          </p>
        </div>
      </div>
    </main>
  );
}
