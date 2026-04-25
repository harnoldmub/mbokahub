"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Home, LayoutDashboard, LogIn, LogOut, Menu, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type Locale, localizedHref, nls } from "@/lib/nls";

type MobileMenuProps = {
  locale: Locale;
};

export function MobileMenu({ locale }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const copy = nls[locale].common;
  const { isSignedIn, user } = useUser();
  const signInLabel =
    locale === "en" ? "Sign in" : locale === "de" ? "Anmelden" : locale === "nl" ? "Inloggen" : "Se connecter";
  const signUpLabel =
    locale === "en" ? "Create account" : locale === "de" ? "Konto erstellen" : locale === "nl" ? "Account aanmaken" : "Créer un compte";
  const signOutLabel =
    locale === "en" ? "Sign out" : locale === "de" ? "Abmelden" : locale === "nl" ? "Uitloggen" : "Se déconnecter";
  const dashboardLabel =
    locale === "fr" ? "Tableau de bord" : "Dashboard";
  const navItems = [
    { href: "/", label: copy.quickNav.home },
    { href: "/concert", label: copy.nav.concert },
    { href: "/prestataires", label: copy.nav.services },
    { href: "/trajets", label: copy.quickNav.trajets },
    { href: "/afters", label: copy.quickNav.afters },
    { href: "/merch", label: copy.quickNav.merch },
    { href: "/beaute", label: copy.quickNav.beaute },
    { href: "/classiques-paris", label: copy.quickNav.paris },
    { href: "/communaute", label: copy.nav.community },
    { href: "/playlists", label: copy.nav.playlists },
    { href: "/quiz", label: copy.quickNav.quiz },
    { href: "/jeu", label: copy.quickNav.game },
  ] as const;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label={copy.openMenu}
          className="md:hidden"
          size="icon"
          variant="ghost"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        className="flex flex-col border-white/10 bg-coal px-6 py-8"
        side="right"
      >
        <VisuallyHidden.Root>
          <SheetTitle>{copy.menu}</SheetTitle>
        </VisuallyHidden.Root>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-blood">
          {copy.menu}
        </p>

        <nav className="mt-6 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              className="group flex items-center justify-between rounded-xl border border-transparent px-4 py-3 transition-all hover:border-blood/20 hover:bg-blood/5"
              href={localizedHref(item.href, locale)}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              <span className="flex items-center gap-2 font-display text-xl uppercase text-paper transition-colors group-hover:text-blood">
                {item.href === "/" && <Home aria-hidden className="size-5 text-blood" />}
                {item.label}
              </span>
              <ArrowRight className="size-4 text-blood opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <div className="mb-4 h-px bg-white/5" />

          {isSignedIn ? (
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-blood/20 font-display text-sm uppercase text-blood">
                  {(user?.firstName?.[0] ?? user?.primaryEmailAddress?.emailAddress?.[0] ?? "M").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute">
                    {locale === "fr" ? "Connecté" : "Signed in"}
                  </p>
                  <p className="truncate text-sm text-paper">
                    {user?.firstName ?? user?.primaryEmailAddress?.emailAddress ?? ""}
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="h-12 w-full justify-start gap-3 text-sm"
                size="lg"
                variant="outline"
              >
                <Link
                  href={localizedHref("/dashboard", locale)}
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="size-4" />
                  {dashboardLabel}
                </Link>
              </Button>
              <SignOutButton redirectUrl={localizedHref("/", locale)}>
                <button
                  className="flex h-12 w-full items-center justify-start gap-3 rounded-md border border-white/10 px-4 text-sm text-paper-dim transition-colors hover:border-blood/40 hover:bg-blood/10 hover:text-paper"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <LogOut className="size-4" />
                  {signOutLabel}
                </button>
              </SignOutButton>
            </div>
          ) : (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <Button
                asChild
                className="h-12 justify-center gap-2 text-sm"
                size="lg"
                variant="outline"
              >
                <Link
                  href={localizedHref("/sign-in?redirect_url=/dashboard", locale)}
                  onClick={() => setOpen(false)}
                >
                  <LogIn className="size-4" />
                  {signInLabel}
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 justify-center gap-2 text-sm"
                size="lg"
                variant="ghost"
              >
                <Link
                  href={localizedHref("/sign-up?redirect_url=/dashboard", locale)}
                  onClick={() => setOpen(false)}
                >
                  <UserPlus className="size-4" />
                  {signUpLabel}
                </Link>
              </Button>
            </div>
          )}

          <Button
            asChild
            className="h-14 w-full text-base"
            size="lg"
            variant="vip"
          >
            <Link
              href={localizedHref("/vip", locale)}
              onClick={() => setOpen(false)}
            >
              {copy.vipCta}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
