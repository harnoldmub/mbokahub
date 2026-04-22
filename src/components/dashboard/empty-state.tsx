import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  actionHref,
  actionLabel,
  description,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-coal p-8 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blood/10 text-blood">
        <Icon aria-hidden className="size-7" />
      </div>
      <h2 className="mt-5 font-heading text-2xl text-paper">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-paper-dim leading-7">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
