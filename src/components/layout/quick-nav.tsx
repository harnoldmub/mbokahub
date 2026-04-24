"use client";

import {
  Car,
  Gamepad2,
  Home,
  ListMusic,
  MapPin,
  Package,
  PartyPopper,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type ComponentType } from "react";

import { getLocale, localizedHref, nls } from "@/lib/nls";
import { cn } from "@/lib/utils";

type QuickNavItem = {
  href: string;
  labelKey:
    | "home"
    | "trajets"
    | "afters"
    | "merch"
    | "beaute"
    | "paris"
    | "quiz"
    | "game"
    | "playlists"
    | "community";
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const items: QuickNavItem[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/trajets", labelKey: "trajets", icon: Car },
  { href: "/afters", labelKey: "afters", icon: PartyPopper },
  { href: "/merch", labelKey: "merch", icon: Package },
  { href: "/beaute", labelKey: "beaute", icon: Scissors },
  { href: "/classiques-paris", labelKey: "paris", icon: MapPin },
  { href: "/quiz", labelKey: "quiz", icon: Sparkles },
  { href: "/jeu", labelKey: "game", icon: Gamepad2 },
  { href: "/playlists", labelKey: "playlists", icon: ListMusic },
  { href: "/communaute", labelKey: "community", icon: Users },
];

export function QuickNav() {
  const pathname = usePathname();
  const locale = getLocale(useSearchParams().get("lang"));
  const labels = nls[locale].common.quickNav;

  // Hide on home page (logo already returns there)
  if (pathname === "/" || pathname === "") return null;

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
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li className="shrink-0" key={item.href}>
                <Link
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
                    isActive
                      ? "border-blood/60 bg-blood/15 text-paper"
                      : "border-white/10 bg-coal/40 text-paper-dim hover:border-blood/30 hover:text-paper",
                    item.href === "/" && "border-blood/40 bg-blood/10 text-blood",
                  )}
                  href={localizedHref(item.href, locale)}
                >
                  <Icon aria-hidden className="size-3.5" />
                  {labels[item.labelKey]}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
