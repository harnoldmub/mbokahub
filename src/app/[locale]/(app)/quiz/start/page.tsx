import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { QuizClient } from "@/components/quiz/quiz-client";

export const dynamic = "force-static";

export default function QuizStartPage() {
  return (
    <main className="relative min-h-screen bg-ink overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood/10 blur-[120px]" />
        <span className="absolute right-[-5vw] top-[15vh] font-display text-[30vw] text-blood opacity-[0.03] uppercase leading-none select-none">
          QUIZ
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/quiz"
          className="mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute transition-colors hover:text-blood"
        >
          <ChevronLeft className="size-3" />
          Retour au quiz
        </Link>

        <div className="mb-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-blood">
            Mboka Hub × Stade de France 2026
          </p>
          <h1 className="mt-3 font-display text-5xl uppercase text-paper leading-tight sm:text-6xl">
            Quiz Fally & Stade
          </h1>
          <p className="mt-3 font-serif italic text-paper-dim">
            10 questions sur le concert, les accès et les règles utiles
          </p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-smoke/30 px-5 py-4">
          <span className="mt-0.5 shrink-0 font-mono text-[10px] text-paper-mute">ℹ</span>
          <p className="font-mono text-[9px] uppercase leading-relaxed tracking-wider text-paper-mute">
            Informations non contractuelles — certaines réponses sont basées sur des sources publiques qui peuvent évoluer. Vérifiez sur les sites officiels du Stade de France et de la billetterie avant le concert.
          </p>
        </div>

        <QuizClient />
      </div>
    </main>
  );
}
