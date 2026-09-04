"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  ArrowRight,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MOBILE_MENU_LINKS } from "@/lib/navigation";
import { type Language, localizedHref, nls } from "@/lib/nls";

type MobileMenuProps = {
  market: string;
  lang: Language;
};

export function MobileMenu({ market, lang }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const copy = nls[lang].common;
  const { isSignedIn, user } = useUser();
  const {
    signIn: signInLabel,
    signUp: signUpLabel,
    signOut: signOutLabel,
    dashboard: dashboardLabel,
  } = copy.auth;
  // Même arborescence que le méga-menu, mise à plat : un utilisateur mobile
  // doit atteindre exactement ce qu'atteint un utilisateur desktop.
  const translatedLabels: Record<string, string> = {
    "/": copy.quickNav.home,
    "/trajets": copy.quickNav.trajets,
    "/afters": copy.quickNav.afters,
    "/contact": copy.nav.contact,
    "/pro/inscrire": copy.megaServices.links.becomePro,
  };
  const navItems = MOBILE_MENU_LINKS.map((link) => ({
    ...link,
    label: translatedLabels[link.href] ?? link.label,
  }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label={copy.openMenu}
          className="lg:hidden"
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
              href={localizedHref(item.href, market)}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              <span className="flex items-center gap-2 text-lg font-semibold text-paper transition-colors group-hover:text-blood">
                {item.href === "/" && (
                  <Home aria-hidden className="size-5 text-blood" />
                )}
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
                <div className="flex size-9 items-center justify-center rounded-full bg-blood/15 text-sm font-semibold uppercase text-blood">
                  {(
                    user?.firstName?.[0] ??
                    user?.primaryEmailAddress?.emailAddress?.[0] ??
                    "M"
                  ).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute">
                    {lang === "fr" ? "Connecté" : "Signed in"}
                  </p>
                  <p className="truncate text-sm text-paper">
                    {user?.firstName ??
                      user?.primaryEmailAddress?.emailAddress ??
                      ""}
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="h-12 w-full justify-start gap-3 text-sm"
                size="lg"
                variant="outline"
              >
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <LayoutDashboard className="size-4" />
                  {dashboardLabel}
                </Link>
              </Button>
              <SignOutButton redirectUrl={localizedHref("/", market)}>
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
                  href="/sign-in?redirect_url=/dashboard"
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
                  href="/sign-up?redirect_url=/dashboard"
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
              href={localizedHref("/pro/inscrire", market)}
              onClick={() => setOpen(false)}
            >
              Devenir prestataire
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
