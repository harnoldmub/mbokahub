import { ArrowRight, BrainCircuit, Sparkles, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  return (
    <main className="relative min-h-[90svh] flex items-center justify-center overflow-hidden bg-ink">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-blood/10 blur-[150px] rounded-full" />
        <span className="absolute left-[5%] top-[10%] font-display text-[20vw] text-paper opacity-[0.02] select-none uppercase leading-none">
          QUIZ
        </span>
      </div>

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <div className="mb-10 inline-flex size-20 items-center justify-center rounded-3xl bg-smoke border border-white/10 text-blood shadow-glow-blood animate-pulse">
          <BrainCircuit className="size-10" />
        </div>

        <h1 className="font-display text-7xl text-paper uppercase leading-[0.9] sm:text-9xl mb-8">
          Quel fan es-tu <br />
          <span className="text-blood font-serif italic text-[0.8em]">vraiment ?</span>
        </h1>

        <p className="mx-auto max-w-xl text-xl text-paper-dim leading-relaxed mb-12 font-body italic">
          "Réponds à 10 questions sur la culture Congo, la sapologie et l'histoire des grands concerts pour découvrir ton archétype de fan."
        </p>

        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          <div className="rounded-3xl border border-white/5 bg-coal/50 p-6 text-left hover:border-blood/30 transition-colors">
            <Sparkles className="size-5 text-gold mb-4" />
            <p className="font-mono text-[10px] text-paper-mute uppercase tracking-widest mb-2">Récompense</p>
            <p className="text-paper text-sm leading-relaxed">
              Archétype personnalisé et badge VIP digital à partager sur Insta.
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-coal/50 p-6 text-left hover:border-blood/30 transition-colors">
            <Share2 className="size-5 text-blood mb-4" />
            <p className="font-mono text-[10px] text-paper-mute uppercase tracking-widest mb-2">Commu</p>
            <p className="text-paper text-sm leading-relaxed">
              Rejoins les 4 500 fans qui ont déjà trouvé leur profil.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <Button asChild size="lg" className="h-20 px-12 text-2xl shadow-glow-blood bg-blood hover:bg-blood/90 group">
             <Link href="/quiz/start">
               Lancer le Quiz <ArrowRight className="ml-3 size-7 transition-transform group-hover:translate-x-2" />
             </Link>
          </Button>
          <p className="mt-6 font-mono text-[10px] text-paper-mute uppercase tracking-[0.3em]">
            Temps estimé : 2 minutes
          </p>
        </div>
      </div>
    </main>
  );
}
