"use client";

import {
  BadgePlus,
  Car,
  Home,
  Megaphone,
  PartyPopper,
  Scissors,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ComponentType } from "react";

import { DEFAULT_MARKET, MARKETS, type Market } from "@/lib/markets";
import { getLocale, localizedHref, nls } from "@/lib/nls";
import { cn } from "@/lib/utils";

type QuickNavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const items: QuickNavItem[] = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/prestataires", label: "Prestataires", icon: Search },
  { href: "/beaute", label: "Beauté", icon: Scissors },
  { href: "/trajets", label: "Trajets", icon: Car },
  { href: "/afters", label: "Events", icon: PartyPopper },
  { href: "/pro", label: "Espace pro", icon: BadgePlus },
  { href: "/ads", label: "Boost", icon: Megaphone },
];

export function QuickNav() {
  const pathname = usePathname();
  const lang = getLocale(useSearchParams().get("lang"));
  const labels = nls[lang].common.quickNav;

  // Extract market prefix from path for URL building and active-state matching
  const seg = pathname.split("/")[1];
  const market: string = MARKETS.includes(seg as Market) ? seg : DEFAULT_MARKET;
  const localPath = market ? pathname.slice(market.length + 1) || "/" : pathname;

  // Hide on home page (logo already returns there)
  if (localPath === "/" || localPath === "") return null;

  return (
    <nav
      aria-label={labels.aria}
      className="relative z-20 border-b border-white/5 bg-smoke/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ul className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? false
                : localPath === item.href ||
                  localPath.startsWith(`${item.href}/`);
            return (
              <li className="shrink-0" key={item.href}>
                <Link
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
                    isActive
                      ? "border-blood/60 bg-blood/15 text-paper"
                      : "border-white/10 bg-coal/40 text-paper-dim hover:border-blood/30 hover:text-paper",
                    item.href === "/" &&
                      "border-blood/40 bg-blood/10 text-blood",
                  )}
                  href={localizedHref(item.href, market)}
                >
                  <Icon aria-hidden className="size-3.5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
