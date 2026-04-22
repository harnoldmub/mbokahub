import Image from "next/image";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/#prestations", label: "Prestations" },
  { href: "/quiz", label: "Quiz" },
  { href: "/jeu", label: "Jeux" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="glass-header">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        {/* Logo */}
        <Link
          aria-label="Mboka Hub accueil"
          className="group flex items-center gap-3"
          href="/"
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
          {navItems.map((item) => (
            <Link
              className="group/link relative font-body text-sm uppercase tracking-widest text-paper-dim transition-colors hover:text-blood"
              href={item.href}
              key={item.href}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-blood transition-all group-hover/link:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button asChild className="hidden sm:inline-flex" size="sm" variant="vip">
            <Link href="/dashboard">Devenir VIP</Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
