"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Star, UserRound } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { getLocale, localizedHref, nls } from "@/lib/nls";

export function SiteHeader() {
  const locale = getLocale(useSearchParams().get("lang"));
  const copy = nls[locale].common;
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
    locale === "en"
      ? "Dashboard"
      : locale === "de"
        ? "Dashboard"
        : locale === "nl"
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Link
          aria-label="Mboka Hub"
          className="group flex items-center"
          href={localizedHref("/", locale)}
        >
          <span className="text-2xl font-black uppercase tracking-[0.22em] text-paper">
            MbokaHub
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-7 md:flex"
        >
          <MegaMenu label="Services" locale={locale} sections={megaSections} />
          {simpleNavItems.map((item) => (
            <Link
              className="text-sm font-medium text-paper transition-colors hover:text-blood"
              href={localizedHref(item.href, locale)}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
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
                locale,
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
              <Link
                href={localizedHref("/sign-in?redirect_url=/dashboard", locale)}
              >
                <UserRound className="size-4" />
                Mon compte
              </Link>
            </Button>
          )}
          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}
