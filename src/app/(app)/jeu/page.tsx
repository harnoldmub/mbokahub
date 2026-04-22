import { ArrowRight, Gamepad2, Trophy, Zap, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GamePage() {
  return (
    <main className="relative min-h-[95svh] flex items-center justify-center overflow-hidden bg-ink">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 right-0 size-[900px] bg-blood/10 blur-[150px] rounded-full translate-x-1/2 translate-y-1/2" />
        <span className="absolute right-[5%] bottom-[10%] font-display text-[25vw] text-blood opacity-[0.05] select-none uppercase leading-none rotate-12">
           GAME
        </span>
      </div>

      <div className="relative z-10 max-w-6xl px-6 grid lg:grid-cols-[1.2fr_0.8fr] items-center gap-16">
        <div>
           <div className="mb-8 inline-flex items-center gap-3">
             <div className="size-12 rounded-xl bg-smoke border border-white/10 flex items-center justify-center text-blood">
               <Gamepad2 className="size-6" />
             </div>
             <span className="font-mono text-xs text-blood uppercase tracking-[0.4em]">Sape Run — v1.0</span>
           </div>

           <h1 className="font-display text-8xl text-paper uppercase leading-[0.85] sm:text-[10rem] mb-10 tracking-tighter">
             Sape <br />
             <span className="text-gold font-serif italic text-[0.9em]">Run.</span>
           </h1>

           <p className="max-w-xl text-xl text-paper-dim leading-relaxed mb-12 font-body italic border-l-2 border-blood/40 pl-6">
             "Saute, collecte les bonus de style (chaussures, vestes, lunettes) et évite les faux-pas de mode pour atteindre le Stade de France au sommet de ton art."
           </p>

           <div className="flex flex-col sm:flex-row gap-6">
              <Button asChild size="lg" className="h-16 px-10 text-xl shadow-glow-blood bg-blood group">
                 <Link href="/jeu/play">
                   Jouer Maintenant <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
                 </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-10 text-xl bg-white/5 border-white/10">
                 Classement
              </Button>
           </div>
        </div>

        <div className="space-y-6">
           <div className="rounded-[2.5rem] border border-white/10 bg-coal/80 p-8 shadow-2xl space-y-6 backdrop-blur-xl">
             <h3 className="font-display text-2xl text-paper uppercase">Leaderboard Hebdo</h3>
             
             <div className="space-y-4">
                {[
                  { user: "DjosonTheKing", score: "142,500", rank: "01", icon: Trophy, color: "text-gold" },
                  { user: "MammySape", score: "98,200", rank: "02", icon: Zap, color: "text-silver" },
                  { user: "FallyFan99", score: "87,150", rank: "03", icon: Users, color: "text-bronze" },
                ].map((item) => (
                  <div key={item.user} className="flex items-center justify-between p-4 rounded-2xl bg-smoke/50 border border-white/5 group hover:border-blood/30 transition-colors">
                    <div className="flex items-center gap-4">
                       <span className="font-mono text-blood text-xs">{item.rank}</span>
                       <div>
                          <p className="font-heading text-paper">{item.user}</p>
                          <p className="font-mono text-[10px] text-paper-mute">{item.score} PTS</p>
                       </div>
                    </div>
                    <item.icon className={cn("size-4", item.color)} />
                  </div>
                ))}
             </div>
             
             <p className="text-center font-mono text-[9px] text-paper-mute uppercase tracking-widest pt-4">
               Dernière mise à jour à 22:50
             </p>
           </div>
        </div>
      </div>
    </main>
  );
}

import { cn } from "@/lib/utils";
