"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { getLocale, localizedHref, nls } from "@/lib/nls";

export function SiteHeader() {
  const locale = getLocale(useSearchParams().get("lang"));
  const copy = nls[locale].common;
  const { isSignedIn } = useUser();
  const dashboardLabel =
    locale === "en"
      ? "Dashboard"
      : locale === "de"
        ? "Dashboard"
        : locale === "nl"
          ? "Dashboard"
          : "Tableau de bord";
  const signInLabel =
    locale === "en"
      ? "Sign in"
      : locale === "de"
        ? "Anmelden"
        : locale === "nl"
          ? "Inloggen"
          : "Se connecter";
  const m = copy.megaServices;
  const megaSections = [
    {
      title: m.sections.annuaire,
      links: [
        { href: "/prestataires", label: m.links.all, description: m.links.allDesc },
      ],
    },
    {
      title: m.sections.beaute,
      links: [
        { href: "/beaute/maquilleuses", label: m.links.maquilleuses },
        { href: "/beaute/coiffeurs", label: m.links.coiffeurs },
        { href: "/beaute/photographes", label: m.links.photographes },
        { href: "/beaute/babysitting", label: m.links.babysitting },
      ],
    },
    {
      title: m.sections.shopping,
      links: [
        { href: "/merch", label: m.links.merch },
        { href: "/afters", label: m.links.afters },
      ],
    },
    {
      title: m.sections.devenirPro,
      links: [{ href: "/pro/inscrire", label: m.links.becomePro }],
    },
  ];
  const simpleNavItems = [
    { href: "/concert", label: copy.nav.concert },
    { href: "/communaute", label: copy.nav.community },
    { href: "/playlists", label: copy.nav.playlists },
  ] as const;

  return (
    <header className="glass-header">
      {/* Non-official disclaimer bar */}
      <div className="border-b border-white/5 bg-smoke/60 py-1.5 backdrop-blur-sm">
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-paper-mute">
          Site indépendant · Non affilié à Fally Ipupa ou aux organisateurs · À titre informatif uniquement
        </p>
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        {/* Logo */}
        <Link
          aria-label="Mboka Hub"
          className="group flex items-center gap-3"
          href={localizedHref("/", locale)}
        >
          <Image
            alt=""
            aria-hidden
            className="size-11"
            height={44}
            priority
            src="/logo.svg"
            width={44}
          />
          <span className="flex flex-col">
            <span className="font-display text-3xl uppercase leading-none tracking-normal text-paper">
              Mboka <span className="text-blood">Hub</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute">
              Paris 2026
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-8 md:flex"
        >
          <Link
            className="group/link relative font-body text-sm uppercase tracking-widest text-paper-dim transition-colors hover:text-blood"
            href={localizedHref("/concert", locale)}
          >
            {copy.nav.concert}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-blood transition-all group-hover/link:w-full" />
          </Link>
          <MegaMenu label={m.trigger} locale={locale} sections={megaSections} />
          {simpleNavItems
            .filter((it) => it.href !== "/concert")
            .map((item) => (
              <Link
                className="group/link relative font-body text-sm uppercase tracking-widest text-paper-dim transition-colors hover:text-blood"
                href={localizedHref(item.href, locale)}
                key={item.href}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-blood transition-all group-hover/link:w-full" />
              </Link>
            ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {!isSignedIn ? (
            <Button
              asChild
              className="hidden sm:inline-flex"
              size="sm"
              variant="ghost"
            >
              <Link href={localizedHref("/sign-in?redirect_url=/dashboard", locale)}>
                {signInLabel}
              </Link>
            </Button>
          ) : null}
          <Button
            asChild
            className="hidden sm:inline-flex"
            size="sm"
            variant="vip"
          >
            <Link
              href={localizedHref(isSignedIn ? "/dashboard" : "/vip", locale)}
            >
              {isSignedIn ? dashboardLabel : copy.vipCta}
            </Link>
          </Button>
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl={localizedHref("/", locale)}
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 ring-1 ring-blood/40",
                },
              }}
            />
          ) : null}
          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}
