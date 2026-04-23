import { ChevronLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

import { PHOTO_CREDITS } from "@/lib/constants";

export const dynamic = "force-static";

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <Link
        href="/"
        className="mb-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute transition-colors hover:text-blood"
      >
        <ChevronLeft className="size-3" />
        Accueil
      </Link>

      <div className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-blood">
          Mboka Hub
        </p>
        <h1 className="mt-3 font-display text-5xl uppercase text-paper leading-tight">
          Disclaimer
        </h1>
        <p className="mt-2 font-serif italic text-paper-dim">
          Mentions légales, attributions et avertissements
        </p>
      </div>

      {/* Main disclaimer */}
      <div className="mb-10 rounded-3xl border border-blood/20 bg-blood/5 px-8 py-8 space-y-4">
        <h2 className="font-display text-2xl uppercase text-paper">
          Site indépendant · Non officiel
        </h2>
        <p className="font-body text-base leading-relaxed text-paper-dim">
          Mboka Hub est une plateforme communautaire créée par des fans, pour les fans.
          Ce site <strong className="text-paper">n&apos;est affilié d&apos;aucune façon</strong> à :
        </p>
        <ul className="space-y-2 font-body text-sm text-paper-dim">
          {[
            "Fally Ipupa (artiste)",
            "F'Victeam (management / label)",
            "Les promoteurs et organisateurs officiels du concert",
            "Le Stade de France ou ses gestionnaires",
            "Toute billetterie officielle",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-blood shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="font-body text-sm text-paper-dim leading-relaxed">
          Toute mention du nom, de l&apos;image ou de l&apos;œuvre de Fally Ipupa sur ce site
          relève d&apos;un usage éditorial et informatif, sans intention commerciale liée
          à l&apos;artiste ou à ses ayants droit.
        </p>
      </div>

      {/* Information disclaimer */}
      <div className="mb-10 border-t border-white/5 pt-8">
        <h2 className="mb-4 font-display text-xl uppercase text-paper">
          Informations non contractuelles
        </h2>
        <p className="font-body text-sm leading-relaxed text-paper-dim">
          Les informations pratiques publiées sur Mboka Hub (prix de transport, horaires,
          règles d&apos;accès au stade, adresses) sont compilées de sources publiques et
          fournies à titre strictement indicatif. Elles peuvent être inexactes ou évoluer
          sans préavis. Mboka Hub décline toute responsabilité pour toute décision prise
          sur la base de ces informations.
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-blood">
          Consultez toujours les sources officielles avant de vous déplacer.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { label: "Stade de France officiel", href: "https://www.stadefrance.com" },
            { label: "RATP — Transports", href: "https://www.ratp.fr" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-smoke/30 px-4 py-2 font-mono text-[9px] uppercase tracking-wider text-paper-mute hover:border-blood/30 hover:text-paper transition-all"
            >
              {link.label}
              <ExternalLink className="size-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Photo credits */}
      <div className="border-t border-white/5 pt-8">
        <h2 className="mb-6 font-display text-xl uppercase text-paper">
          Crédits photographiques
        </h2>
        <p className="mb-6 font-body text-sm text-paper-dim leading-relaxed">
          Toutes les photographies utilisées sur ce site proviennent de{" "}
          <a
            href="https://commons.wikimedia.org/wiki/Category:Fally_Ipupa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blood hover:underline underline-offset-4"
          >
            Wikimedia Commons
          </a>{" "}
          et sont publiées sous licences libres. Conformément aux termes de ces licences,
          voici les attributions complètes :
        </p>
        <div className="space-y-4">
          {PHOTO_CREDITS.map((credit) => (
            <div
              key={credit.file}
              className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-smoke/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono text-[10px] text-paper-mute uppercase tracking-wider">
                  {credit.file}
                </p>
                <p className="mt-0.5 font-body text-sm text-paper">
                  © {credit.author}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-lg border border-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-paper-mute">
                  {credit.license}
                </span>
                <a
                  href={credit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blood hover:text-blood/70 transition-colors"
                >
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-paper-mute">
          CC BY-SA 4.0 — Creative Commons Attribution-ShareAlike 4.0 International ·
          CC BY-SA 2.0 — Creative Commons Attribution-ShareAlike 2.0 Generic
        </p>
      </div>
    </main>
  );
}
