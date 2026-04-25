"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Contact,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const baseItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/contacts", label: "Contacts", icon: Contact },
  { href: "/dashboard/annonces", label: "Annonces", icon: Megaphone },
  { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
  { href: "/dashboard/parametres", label: "Paramètres", icon: Settings },
] as const;

export function DashboardNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = isAdmin
    ? [
        ...baseItems,
        {
          href: "/admin",
          label: "Administration",
          icon: ShieldCheck,
          highlight: true as const,
        },
      ]
    : baseItems;

  return (
    <nav className="mt-6 grid gap-2" aria-label="Navigation dashboard">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        const isHighlight = "highlight" in item && item.highlight;

        return (
          <Link
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300",
              isActive
                ? "bg-blood/10 text-paper border border-blood/20 shadow-[0_0_15px_-5px_theme(colors.blood.DEFAULT)]"
                : isHighlight
                  ? "border border-amber-400/30 bg-amber-400/5 text-paper hover:border-amber-400/50 hover:bg-amber-400/10"
                  : "text-paper-dim hover:bg-smoke hover:text-paper border border-transparent",
            )}
            href={item.href}
            key={item.href}
          >
            <Icon
              aria-hidden
              className={cn(
                "size-4 transition-colors",
                isActive
                  ? "text-blood"
                  : isHighlight
                    ? "text-amber-300"
                    : "text-paper-mute group-hover:text-blood",
              )}
            />
            <span
              className={cn(
                isActive ? "font-display tracking-tight" : "font-body",
              )}
            >
              {item.label}
            </span>

            {isActive && (
              <motion.div
                layoutId="nav-active"
                className="ml-auto size-1.5 rounded-full bg-blood shadow-glow-blood"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
