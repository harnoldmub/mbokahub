import type { ProCategory } from "@prisma/client";

import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";

export function maskedProLabel(
  category: ProCategory,
  city: string | null | undefined,
): string {
  const meta = PRO_CATEGORY_BY_ID[category];
  const label = meta?.label ?? meta?.shortLabel ?? "Prestataire";
  const trimmedCity = city?.trim();
  return trimmedCity ? `${label} · ${trimmedCity}` : label;
}

export function publicProName(opts: {
  category: ProCategory;
  city: string | null | undefined;
  displayName: string;
  unlocked: boolean;
}): string {
  return opts.unlocked
    ? opts.displayName
    : maskedProLabel(opts.category, opts.city);
}
