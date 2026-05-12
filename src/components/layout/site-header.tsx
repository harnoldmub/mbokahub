"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Star, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { DEFAULT_MARKET, MARKETS, type Market } from "@/lib/markets";
import { getLocale, localizedHref, nls } from "@/lib/nls";

export function SiteHeader() {
  const pathname = usePathname();
  const seg = pathname.split("/")[1];
  const market: string = MARKETS.includes(seg as Market) ? seg : DEFAULT_MARKET;
  const lang = getLocale(useSearchParams().get("lang"));
  const copy = nls[lang].common;
  const { isSignedIn } = useUser();
  // Anciens VIP → badge ⭐ Famille Fondatrice à vie. La route /api/me/vip
  // expose le flag historique `isVip` (qui correspond aux fondateurs).
  const [isFoundingFamily, setIsFoundingFamily] = useState(false);
  useEffect(() => {
    if (!isSignedIn) {
      setIsFoundingFamily(false);
      return;
    }
    let cancelled = false;
    fetch("/api/me/vip", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled) setIsFoundingFamily(Boolean(d?.isFounder));
      })
      .catch(() => {
        if (!cancelled) setIsFoundingFamily(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);
  const dashboardLabel =
    lang === "en"
      ? "Dashboard"
      : lang === "de"
        ? "Dashboard"
        : lang === "nl"
          ? "Dashboard"
          : "Tableau de bord";
  const m = copy.megaServices;
  const megaSections = [
    {
      title: "Découvrir",
      links: [
        {
          href: "/prestataires",
          label: "Tous les prestataires",
          description: "Annuaire gratuit, profils vérifiés",
        },
        {
          href: "/trajets",
          label: "Trajets",
          description: "Transport et covoiturage",
        },
      ],
    },
    {
      title: "Services",
      links: [
        { href: "/beaute/maquilleuses", label: m.links.maquilleuses },
        { href: "/beaute/coiffeurs", label: m.links.coiffeurs },
        { href: "/beaute/photographes", label: m.links.photographes },
        { href: "/beaute/babysitting", label: m.links.babysitting },
      ],
    },
    {
      title: "Visibilité",
      links: [
        { href: "/ads", label: "Boosts & publicité" },
        { href: "/partenariat", label: "Partenariats" },
      ],
    },
    {
      title: "Espace pro",
      links: [
        { href: "/pro", label: "Comprendre l'offre pro" },
        { href: "/pro/inscrire", label: m.links.becomePro },
      ],
    },
  ];
  const simpleNavItems = [
    { href: "/prestataires", label: "Prestataires" },
    { href: "/trajets", label: "Trajets" },
    { href: "/ads", label: "Boost" },
  ] as const;

  return (
    <header className="glass-header">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-3 px-4 sm:h-28 sm:gap-4 sm:px-6 md:h-32 lg:h-36 lg:px-8">
        <Link
          aria-label="Nevent"
          className="group flex items-center"
          href={localizedHref("/", market)}
        >
          <BrandLogo />
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-7 md:flex"
        >
          <MegaMenu label="Services" locale={market} sections={megaSections} />
          {simpleNavItems.map((item) => (
            <Link
              className="text-sm font-medium text-paper transition-colors hover:text-blood"
              href={localizedHref(item.href, market)}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button
            asChild
            className="hidden sm:inline-flex"
            size="sm"
            variant="vip"
          >
            <Link
              href={localizedHref(
                isSignedIn ? "/dashboard" : "/pro/inscrire",
                market,
              )}
            >
              {isSignedIn ? dashboardLabel : "Devenir pro"}
            </Link>
          </Button>
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              {isFoundingFamily ? (
                <span
                  className="hidden items-center gap-1 rounded-full border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200 sm:inline-flex"
                  title="Famille Fondatrice — badge à vie"
                >
                  <Star aria-hidden className="size-3 fill-current" />
                  Fondateur
                </span>
              ) : null}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: isFoundingFamily
                      ? "h-8 w-8 ring-2 ring-amber-400/70"
                      : "h-8 w-8 ring-1 ring-blood/40",
                  },
                }}
              />
            </div>
          ) : (
            <Button asChild className="hidden sm:inline-flex" size="sm">
              <Link href="/sign-in?redirect_url=/dashboard">
                <UserRound className="size-4" />
                Mon compte
              </Link>
            </Button>
          )}
          <MobileMenu lang={lang} market={market} />
        </div>
      </div>
    </header>
  );
}
