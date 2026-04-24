import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AppTileProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  hint?: string;
  accent?: "blood" | "gold" | "ember" | "violet" | "paper" | "emerald";
  emoji?: string;
};

const ACCENT_RING: Record<NonNullable<AppTileProps["accent"]>, string> = {
  blood: "from-blood/30 to-blood/0 group-hover:from-blood/50",
  gold: "from-gold/30 to-gold/0 group-hover:from-gold/50",
  ember: "from-ember/30 to-ember/0 group-hover:from-ember/50",
  violet:
    "from-violet-500/30 to-violet-500/0 group-hover:from-violet-500/50",
  paper: "from-paper/20 to-paper/0 group-hover:from-paper/40",
  emerald:
    "from-emerald-500/30 to-emerald-500/0 group-hover:from-emerald-500/50",
};

const ACCENT_TEXT: Record<NonNullable<AppTileProps["accent"]>, string> = {
  blood: "text-blood",
  gold: "text-gold",
  ember: "text-ember",
  violet: "text-violet-400",
  paper: "text-paper",
  emerald: "text-emerald-400",
};

export function AppTile({
  href,
  icon: Icon,
  label,
  hint,
  accent = "blood",
  emoji,
}: AppTileProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-start gap-3 rounded-3xl border border-white/10 bg-coal/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 active:scale-[0.98] sm:p-6"
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
          ACCENT_RING[accent],
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "flex size-12 items-center justify-center rounded-2xl bg-ink/60 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 sm:size-14",
          ACCENT_TEXT[accent],
        )}
      >
        {emoji ? (
          <span className="text-2xl sm:text-3xl">{emoji}</span>
        ) : (
          <Icon className="size-6 sm:size-7" />
        )}
      </div>
      <div className="mt-1">
        <p className="font-display text-lg uppercase leading-tight tracking-tight text-paper sm:text-xl">
          {label}
        </p>
        {hint && (
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
            {hint}
          </p>
        )}
      </div>
    </Link>
  );
}
