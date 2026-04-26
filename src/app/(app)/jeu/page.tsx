import { ArrowRight, Gamepad2, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
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

export const dynamic = "force-dynamic";

const RANK_STYLES = [
  { icon: Trophy, color: "text-gold" },
  { icon: Zap, color: "text-silver" },
  { icon: Users, color: "text-bronze" },
] as const;

function formatScore(n: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(n);
  } catch {
    return n.toLocaleString();
  }
}

function formatUpdatedAt(d: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

export default async function GamePage({ searchParams }: GamePageProps) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].game;

  // Real weekly leaderboard: top 3 unique pseudos in the last 7 days.
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const grouped = await prisma.gameScore.groupBy({
    by: ["pseudo"],
    where: { createdAt: { gte: since } },
    _max: { score: true, createdAt: true },
    orderBy: { _max: { score: "desc" } },
    take: 3,
  });

  const leaderboard = grouped.map((row, i) => {
    const style = RANK_STYLES[i] ?? RANK_STYLES[2];
    return {
      user: row.pseudo,
      score: formatScore(row._max.score ?? 0, locale),
      rank: String(i + 1).padStart(2, "0"),
      icon: style.icon,
      color: style.color,
    };
  });

  const lastUpdate = grouped
    .map((g) => g._max.createdAt)
    .filter((d): d is Date => d instanceof Date)
    .sort((a, b) => b.getTime() - a.getTime())[0];

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

            {leaderboard.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-smoke/30 p-8 text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                  {copy.emptyLeaderboard}
                </p>
                <Button
                  asChild
                  size="sm"
                  className="mt-4 bg-blood text-white hover:bg-blood/90"
                >
                  <Link href={localizedHref("/jeu/play", locale)}>
                    {copy.beFirst}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((item, idx) => (
                  <div
                    className="group flex items-center justify-between rounded-2xl border border-white/5 bg-smoke/50 p-4 transition-colors hover:border-blood/30"
                    key={`${item.user}-${idx}`}
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
            )}

            {lastUpdate && (
              <p className="pt-4 text-center font-mono text-[9px] text-paper-mute uppercase tracking-widest">
                {copy.updatedAt} {formatUpdatedAt(lastUpdate, locale)}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
