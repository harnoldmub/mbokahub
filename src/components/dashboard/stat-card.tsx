import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  description?: string;
};

export function StatCard({
  description,
  icon: Icon,
  label,
  value,
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-smoke/50 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-paper-mute uppercase tracking-[0.2em]">
          {label}
        </p>
        <Icon aria-hidden className="size-5 text-blood" />
      </div>
      <p className="mt-4 font-display text-4xl text-paper">{value}</p>
      {description ? (
        <p className="mt-2 text-paper-dim text-sm leading-6">{description}</p>
      ) : null}
    </article>
  );
}
