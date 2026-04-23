"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { LEGAL_DISCLAIMER, PHOTO_CREDITS } from "@/lib/constants";
import { getLocale, localizedHref, nls } from "@/lib/nls";

const footerLinks = [
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export function SiteFooter() {
  const locale = getLocale(useSearchParams().get("lang"));
  const copy = nls[locale].footer;

  return (
    <footer className="bg-ink border-t border-white/5 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* EDITORIAL PHRASE */}
        <div className="mb-20">
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-paper uppercase leading-[0.9] text-tight">
            {copy.headlineStart}{" "}
            <span className="text-blood font-serif italic font-black">
              9 000
            </span>{" "}
            <br />
            {copy.headlineMiddle}{" "}
            <span className="text-gold">{copy.headlineEnd}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-blood">
              {copy.navigation}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href={localizedHref("/trajets", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.rides}
              </Link>
              <Link
                href={localizedHref("/afters", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.afters}
              </Link>
              <Link
                href={localizedHref("/beaute", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.services}
              </Link>
              <Link
                href={localizedHref("/beaute/photographes", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.photographers}
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-blood">
              {copy.professionals}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href={localizedHref("/pro", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.proSpace}
              </Link>
              <Link
                href={localizedHref("/partenariat", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.partnerships}
              </Link>
              <Link
                href={localizedHref("/ads", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.ads}
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-blood">
              Mboka Hub
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href={localizedHref("/equipe", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.team}
              </Link>
              <Link
                href={localizedHref("/contact", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.contact}
              </Link>
              <Link
                href={localizedHref("/faq", locale)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.faq}
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-blood">
              {copy.legal}
            </h3>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  className="text-paper-dim hover:text-paper transition-colors"
                  href={localizedHref(link.href, locale)}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 space-y-6">
          {/* Disclaimer */}
          <div className="rounded-2xl border border-white/5 bg-smoke/20 px-6 py-5">
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.3em] text-blood">
              Site indépendant — Non officiel
            </p>
            <p className="font-mono text-[10px] text-paper-mute leading-relaxed">
              {LEGAL_DISCLAIMER}
            </p>
          </div>

          {/* Photo credits */}
          <div>
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-paper-mute">
              Crédits photographiques (Wikimedia Commons)
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {PHOTO_CREDITS.map((credit) => (
                <a
                  key={credit.file}
                  href={credit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] text-paper-mute hover:text-paper transition-colors"
                >
                  © {credit.author} — {credit.license}
                </a>
              ))}
            </div>
          </div>

          <p className="font-mono text-[10px] text-paper-mute uppercase">
            © 2026 MBOKA HUB — {copy.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
