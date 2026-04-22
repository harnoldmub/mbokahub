import Link from "next/link";

import { LEGAL_DISCLAIMER } from "@/lib/constants";

const footerLinks = [
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink border-t border-white/5 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* EDITORIAL PHRASE */}
        <div className="mb-20">
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-paper uppercase leading-[0.9] text-tight">
            Rejoins{" "}
            <span className="text-blood font-serif italic font-black">
              9 000
            </span>{" "}
            fans <br />
            de la diaspora. <span className="text-gold">Sans détour.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-blood">
              Navigation
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/trajets"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                Trajets
              </Link>
              <Link
                href="/afters"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                Afters
              </Link>
              <Link
                href="/beaute"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                Beauté
              </Link>
              <Link
                href="/beaute/photographes"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                Photographes
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-blood">
              Professionnels
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/pro"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                Espace Pro
              </Link>
              <Link
                href="/partenariat"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                Partenariats
              </Link>
              <Link
                href="/ads"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                Publicité
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-blood">
              Mboka Hub
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/equipe"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                L'équipe
              </Link>
              <Link
                href="/contact"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/faq"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                FAQ
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-blood">
              Légal
            </h3>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  className="text-paper-dim hover:text-paper transition-colors"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10">
          <p className="font-mono text-[10px] text-paper-mute leading-relaxed uppercase tracking-widest">
            {LEGAL_DISCLAIMER}
          </p>
          <p className="mt-4 font-mono text-[10px] text-paper-mute uppercase">
            © 2026 MBOKA HUB — TOUS DROITS RÉSERVÉS.
          </p>
        </div>
      </div>
    </footer>
  );
}
