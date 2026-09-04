"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowUp, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import {
  DEFAULT_MARKET,
  MARKET_META,
  MARKETS,
  type Market,
} from "@/lib/markets";
import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/lib/navigation";
import { getLocale, localizedHref, nls } from "@/lib/nls";

const CONTACT_EMAIL = "contact@mbokahub.com";

/** Le footer garde une surface sombre quel que soit le thème : il sert d'ancre
 *  visuelle sous des pages majoritairement claires. Les couleurs sont donc
 *  écrites en valeurs explicites plutôt qu'avec les tokens ink/paper, qui
 *  basculent avec next-themes. Idem pour les bordures : globals.css redéfinit
 *  `border-white/10` en gris clair, on utilise donc `border-white/[0.12]`. */
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

  // Le pied de page est la seule surface exhaustive : il déroule toute
  // l'arborescence de src/lib/navigation.ts, plus le légal.
  // La structure vient du module ; les libellés restent traduits quand une
  // traduction existe, pour ne pas perdre l'i18n en centralisant.
  const translatedLabels: Record<string, string> = {
    "/trajets": copy.links.rides,
    "/afters": copy.links.afters,
    "/prestataires": copy.links.services,
    "/beaute/photographes": copy.links.photographers,
    "/pro": copy.links.proSpace,
    "/partenariat": copy.links.partnerships,
    "/ads": copy.links.ads,
    "/equipe": copy.links.team,
    "/contact": copy.links.contact,
    "/faq": copy.links.faq,
    "/cgu": copy.links.terms,
    "/cgv": copy.links.sales,
    "/confidentialite": copy.links.privacy,
    "/mentions-legales": copy.links.legalNotice,
    "/disclaimer": copy.links.disclaimer,
  };
  const columns = [
    ...FOOTER_COLUMNS,
    { id: "legal" as const, title: copy.legal, links: LEGAL_LINKS },
  ].map((column) => ({
    ...column,
    links: column.links.map((link) => ({
      ...link,
      label: translatedLabels[link.href] ?? link.label,
    })),
  }));

  const linkClass =
    "inline-block text-sm text-white/60 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5252]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0f] rounded-sm";

  return (
    <footer className="mt-24 bg-[#0b0c0f] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* BANDEAU ÉDITORIAL + CTA */}
        <div className="flex flex-col gap-8 border-white/[0.12] border-b py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <h2 className="max-w-2xl font-display text-4xl uppercase leading-[0.95] text-tight sm:text-5xl lg:text-6xl">
            Découvre l’événement.
            <br />
            Organise{" "}
            <span className="font-serif font-black text-[#ff5252] italic">
              toute
            </span>{" "}
            ton expérience.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center rounded-full bg-[#e31818] px-6 py-3 font-medium text-sm text-white transition-colors hover:bg-[#ff2d2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5252]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0f]"
              href={localizedHref("/pro/inscrire", market)}
            >
              Devenir prestataire
            </Link>
            <Link
              className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 font-medium text-sm text-white transition-colors hover:border-white hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0f]"
              href={localizedHref("/trajets/publier", market)}
            >
              Publier un trajet
            </Link>
          </div>
        </div>

        {/* MARQUE + COLONNES */}
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            {/* logo-white.png est un carré 2000×2000 dont le lettrage n'occupe
                que ~17 % de la hauteur et ~61 % de la largeur (38,5 % de vide
                au-dessus, 44,5 % en dessous, 19 % à gauche). Les marges
                négatives recadrent ce vide pour que le mot-symbole s'aligne sur
                la colonne : 160px × ces ratios. */}
            <Image
              alt="Nevent"
              className="-mt-[62px] -mb-[71px] -ml-[30px] h-40 w-auto object-contain"
              height={320}
              src="/logo-white.png"
              width={320}
            />
            <p className="mt-6 max-w-sm text-sm text-white/60 leading-relaxed">
              La plateforme indépendante qui réunit les événements afro en
              Europe et tous les services autour : trajets, beauté, photo et
              afters.
            </p>
            <a
              className="mt-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5252]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0f] rounded-sm"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              <Mail aria-hidden className="size-4" />
              {CONTACT_EMAIL}
            </a>

            <div className="mt-8">
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.25em]">
                Marchés
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {MARKETS.map((code) => {
                  const meta = MARKET_META[code];
                  const isCurrent = code === market;
                  return (
                    <Link
                      aria-current={isCurrent ? "true" : undefined}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0f] ${
                        isCurrent
                          ? "border-white/60 bg-white/[0.08] text-white"
                          : "border-white/[0.18] text-white/55 hover:border-white/45 hover:text-white"
                      }`}
                      href={`/${code}`}
                      key={code}
                    >
                      <span aria-hidden>{meta.flag}</span>
                      {meta.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="font-mono text-[10px] text-white/40 uppercase tracking-[0.25em]">
                  {column.title}
                </h3>
                <nav aria-label={column.title} className="mt-5">
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          className={linkClass}
                          href={localizedHref(link.href, market)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="font-mono text-[10px] text-[#ff5252] uppercase tracking-[0.3em]">
                Newsletter
              </p>
              <h3 className="mt-3 font-display text-2xl uppercase leading-tight sm:text-3xl">
                Reçois les nouveaux services et opportunités
              </h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                Nouveaux prestataires, boosts, offres partenaires : un email
                court, jamais de spam.
              </p>
            </div>
            <div className="lg:col-span-7">
              <NewsletterForm source="footer" tone="dark" />
            </div>
          </div>
        </div>

        {/* MODÈLE ÉCONOMIQUE */}
        <p className="mt-8 text-white/40 text-xs leading-relaxed">
          <span className="text-white/60">Modèle ouvert —</span> Pendant la
          phase de lancement, Nevent est gratuit pour tout le monde : visiteurs
          comme prestataires, mise en avant comprise. Toute évolution sera
          annoncée à l&apos;avance.
        </p>

        {/* BARRE BASSE */}
        <div className="mt-10 flex flex-col gap-4 border-white/[0.12] border-t py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.15em]">
            © 2026 Nevent — {copy.rights}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <Link
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] text-emerald-300 uppercase tracking-[0.2em] transition-colors hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0f]"
                href="/admin"
              >
                <ShieldCheck aria-hidden className="size-3" />
                Admin · Backoffice
              </Link>
            ) : null}
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.18] px-3 py-1.5 font-mono text-[10px] text-white/55 uppercase tracking-[0.2em] transition-colors hover:border-white/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0f]"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "auto"
                    : "smooth",
                })
              }
              type="button"
            >
              <ArrowUp aria-hidden className="size-3" />
              Haut de page
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
