"use client";

import { useUser } from "@clerk/nextjs";
import { Home, MessageCircle, Search, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { DEFAULT_MARKET, MARKETS, type Market } from "@/lib/markets";
import { localizedHref } from "@/lib/nls";
import { cn } from "@/lib/utils";

const HIDDEN_PREFIXES = [
  "/admin",
  "/sign-in",
  "/sign-up",
  "/checkout",
  "/onboarding",
];

export function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  const { isSignedIn } = useUser();
  const [unread, setUnread] = useState(0);

  const seg = pathname.split("/")[1];
  const market: string = MARKETS.includes(seg as Market) ? seg : DEFAULT_MARKET;
  // Path without locale prefix for active matching.
  const cleanPath = MARKETS.includes(seg as Market)
    ? pathname.replace(`/${seg}`, "") || "/"
    : pathname;

  // Hide on auth/checkout/admin pages.
  const isHidden = HIDDEN_PREFIXES.some((p) => cleanPath.startsWith(p));

  useEffect(() => {
    if (!isSignedIn) {
      setUnread(0);
      return;
    }
    let cancelled = false;
    async function fetchUnread() {
      try {
        const res = await fetch("/api/me/unread", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { unread?: number };
        if (!cancelled) setUnread(Number(data.unread ?? 0));
      } catch {
        /* silent */
      }
    }
    fetchUnread();
    const t = setInterval(fetchUnread, 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [isSignedIn, pathname]);

  if (isHidden) return null;

  // /dashboard, /sign-in, /sign-up, /checkout, /admin, /onboarding are
  // explicitly NOT locale-prefixed (see middleware NO_LOCALE_PREFIXES).
  // Only market content routes get a locale prefix.
  const messagesHref = isSignedIn
    ? "/dashboard/messages"
    : "/sign-in?redirect_url=/dashboard/messages";
  const profileHref = isSignedIn
    ? "/dashboard"
    : "/sign-in?redirect_url=/dashboard";

  const items: {
    href: string;
    label: string;
    icon: typeof Home;
    active: boolean;
    badge?: number;
  }[] = [
    {
      href: localizedHref("/", market),
      label: "Accueil",
      icon: Home,
      active: cleanPath === "/" || cleanPath === "",
    },
    {
      href: localizedHref("/prestataires", market),
      label: "Prestataires",
      icon: Search,
      active: cleanPath.startsWith("/prestataires") || cleanPath.startsWith("/beaute"),
    },
    {
      href: localizedHref("/trajets", market),
      label: "Trajets",
      icon: Sparkles,
      active: cleanPath.startsWith("/trajets"),
    },
    {
      href: messagesHref,
      label: "Messages",
      icon: MessageCircle,
      active: pathname.startsWith("/dashboard/messages"),
      badge: unread,
    },
    {
      href: profileHref,
      label: isSignedIn ? "Profil" : "Connexion",
      icon: UserRound,
      active:
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/parametres") ||
        pathname.startsWith("/dashboard/profil"),
    },
  ];

  return (
    <>
      <nav
        aria-label="Navigation mobile"
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur-md md:hidden",
          "pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]",
        )}
      >
        <ul className="mx-auto grid max-w-screen-sm grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex h-16 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition-colors",
                    item.active
                      ? "text-blood"
                      : "text-paper-mute hover:text-paper",
                  )}
                  aria-current={item.active ? "page" : undefined}
                >
                  <span className="relative">
                    <Icon
                      aria-hidden
                      className={cn(
                        "size-[22px]",
                        item.active ? "text-blood" : "text-paper-dim",
                      )}
                    />
                    {item.badge && item.badge > 0 ? (
                      <span className="absolute -right-2 -top-1 grid min-w-[16px] h-4 place-items-center rounded-full bg-blood px-1 font-mono text-[9px] font-bold text-white">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    ) : null}
                  </span>
                  <span className="leading-none">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Spacer to prevent content being hidden behind the bottom nav on mobile. */}
      <div aria-hidden className="h-16 md:hidden" />
    </>
  );
}
