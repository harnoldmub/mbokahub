"use client";

import { useUser } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { DEFAULT_MARKET, MARKETS, type Market } from "@/lib/markets";
import { getLocale, localizedHref, nls } from "@/lib/nls";

export function SiteFooter() {
  const pathname = usePathname();
  const seg = pathname.split("/")[1];
  const market: string = MARKETS.includes(seg as Market) ? seg : DEFAULT_MARKET;
  const lang = getLocale(useSearchParams().get("lang"));
  const copy = nls[lang].footer;
  const { isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!isSignedIn) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    fetch("/api/me/vip", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled) setIsAdmin(Boolean(d?.isAdmin));
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);
  const legalLinks = [
    { href: "/cgu", label: copy.links.terms },
    { href: "/cgv", label: copy.links.sales },
    { href: "/confidentialite", label: copy.links.privacy },
    { href: "/mentions-legales", label: copy.links.legalNotice },
    { href: "/disclaimer", label: copy.links.disclaimer },
  ] as const;

  return (
    <footer className="bg-ink border-t border-white/5 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* EDITORIAL PHRASE */}
        <div className="mb-20">
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-paper uppercase leading-[0.9] text-tight">
            La plateforme{" "}
            <span className="text-blood font-serif italic font-black">
              gratuite
            </span>{" "}
            <br />
            des services, réservations et boosts.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-blood">
              {copy.navigation}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href={localizedHref("/trajets", market)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.rides}
              </Link>
              <Link
                href={localizedHref("/afters", market)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.afters}
              </Link>
              <Link
                href={localizedHref("/prestataires", market)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.services}
              </Link>
              <Link
                href={localizedHref("/beaute/photographes", market)}
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
                href={localizedHref("/pro", market)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.proSpace}
              </Link>
              <Link
                href={localizedHref("/partenariat", market)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.partnerships}
              </Link>
              <Link
                href={localizedHref("/ads", market)}
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
                href={localizedHref("/equipe", market)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.team}
              </Link>
              <Link
                href={localizedHref("/contact", market)}
                className="text-paper-dim hover:text-paper transition-colors"
              >
                {copy.links.contact}
              </Link>
              <Link
                href={localizedHref("/faq", market)}
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
              {legalLinks.map((link) => (
                <Link
                  className="text-paper-dim hover:text-paper transition-colors"
                  href={localizedHref(link.href, market)}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mb-12 rounded-2xl border border-blood/30 bg-blood/5 p-6 sm:p-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-blood">
            Newsletter
          </p>
          <h3 className="mt-2 font-display text-2xl text-paper sm:text-3xl">
            Reçois les nouveaux services et opportunités
          </h3>
          <p className="mt-2 text-paper-dim text-sm">
            Nouveaux prestataires, boosts, offres partenaires : un email court,
            jamais de spam.
          </p>
          <div className="mt-5 max-w-xl">
            <NewsletterForm source="footer" />
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 space-y-6">
          <div className="rounded-2xl border border-white/5 bg-smoke/20 px-6 py-5">
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.3em] text-blood">
              Modèle ouvert
            </p>
            <p className="font-mono text-[10px] text-paper-mute leading-relaxed">
              Mboka Hub est gratuit pour les clients et les prestataires. Les
              options payantes concernent uniquement la visibilité sponsorisée,
              les boosts, les placements et les campagnes partenaires.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] text-paper-mute uppercase">
              © 2026 MBOKA HUB — {copy.rights}
            </p>
            {isAdmin ? (
              <Link
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-200/80 transition hover:border-emerald-400/70 hover:bg-emerald-400/10 hover:text-emerald-100"
                href="/admin"
              >
                <ShieldCheck aria-hidden className="size-3" />
                Admin · Backoffice
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
