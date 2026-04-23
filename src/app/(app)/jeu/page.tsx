import { ArrowRight, Gamepad2, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  getLocaleFromSearchParams,
  localizedHref,
  nls,
  type SearchParams,
} from "@/lib/nls";
import { cn } from "@/lib/utils";

type GamePageProps = {
  searchParams?: Promise<SearchParams>;
};

const leaderboard = [
  {
    user: "DjosonTheKing",
    score: "142,500",
    rank: "01",
    icon: Trophy,
    color: "text-gold",
  },
  {
    user: "MammySape",
    score: "98,200",
    rank: "02",
    icon: Zap,
    color: "text-silver",
  },
  {
    user: "MbokaRunner99",
    score: "87,150",
    rank: "03",
    icon: Users,
    color: "text-bronze",
  },
] as const;

export default async function GamePage({ searchParams }: GamePageProps) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].game;

  return (
    <main className="relative min-h-[95svh] flex items-center justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 right-0 size-[900px] bg-blood/10 blur-[150px] rounded-full translate-x-1/2 translate-y-1/2" />
        <span className="absolute right-[5%] bottom-[10%] font-display text-[25vw] text-blood opacity-[0.05] select-none uppercase leading-none rotate-12">
          TOKOOOS
        </span>
      </div>

      <div className="relative z-10 grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-8 inline-flex items-center gap-3">
            <div className="size-12 rounded-xl bg-smoke border border-white/10 flex items-center justify-center text-blood">
              <Gamepad2 className="size-6" />
            </div>
            <span className="font-mono text-xs text-blood uppercase tracking-[0.4em]">
              {copy.version}
            </span>
          </div>

          <h1 className="mb-10 font-display text-8xl text-paper uppercase leading-[0.85] tracking-normal sm:text-[10rem]">
            {copy.titleLine1} <br />
            <span className="font-serif text-[0.9em] text-gold italic">
              {copy.titleLine2}
            </span>
          </h1>

          <p className="mb-12 max-w-xl border-blood/40 border-l-2 pl-6 text-xl text-paper-dim leading-relaxed font-body italic">
            {copy.description}
          </p>

          <div className="flex flex-col gap-6 sm:flex-row">
            <Button
              asChild
              className="h-16 px-10 text-xl shadow-glow-blood bg-blood group"
              size="lg"
            >
              <Link href={localizedHref("/jeu/play", locale)}>
                {copy.play}
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
            <Button
              className="h-16 px-10 text-xl bg-white/5 border-white/10"
              size="lg"
              variant="outline"
            >
              {copy.leaderboard}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-coal/80 p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="font-display text-2xl text-paper uppercase">
              {copy.weeklyLeaderboard}
            </h3>

            <div className="space-y-4">
              {leaderboard.map((item) => (
                <div
                  className="group flex items-center justify-between rounded-2xl border border-white/5 bg-smoke/50 p-4 transition-colors hover:border-blood/30"
                  key={item.user}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-blood text-xs">
                      {item.rank}
                    </span>
                    <div>
                      <p className="font-heading text-paper">{item.user}</p>
                      <p className="font-mono text-[10px] text-paper-mute">
                        {item.score} {copy.points}
                      </p>
                    </div>
                  </div>
                  <item.icon className={cn("size-4", item.color)} />
                </div>
              ))}
            </div>

            <p className="pt-4 text-center font-mono text-[9px] text-paper-mute uppercase tracking-widest">
              {copy.updated}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
