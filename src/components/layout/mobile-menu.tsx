"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type Locale, localizedHref, nls } from "@/lib/nls";

type MobileMenuProps = {
  locale: Locale;
};

export function MobileMenu({ locale }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const copy = nls[locale].common;
  const navItems = [
    { href: "/concert", label: copy.nav.concert },
    { href: "/prestataires", label: copy.nav.services },
    { href: "/communaute", label: copy.nav.community },
    { href: "/playlists", label: copy.nav.playlists },
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
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-blood">
          {copy.menu}
        </p>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              className="group flex items-center justify-between rounded-2xl border border-transparent p-4 transition-all hover:border-blood/20 hover:bg-blood/5"
              href={localizedHref(item.href, locale)}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              <span className="font-display text-3xl uppercase text-paper transition-colors group-hover:text-blood">
                {item.label}
              </span>
              <ArrowRight className="size-5 text-blood opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <div className="mb-4 h-px bg-white/5" />
          <Button
            asChild
            className="h-14 w-full text-base"
            size="lg"
            variant="vip"
          >
            <Link
              href={localizedHref("/dashboard", locale)}
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
