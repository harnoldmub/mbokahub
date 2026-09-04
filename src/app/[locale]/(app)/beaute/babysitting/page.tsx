import { Baby, Check, ChevronLeft, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import {
  type Language,
  languageOf,
  localizedHref,
  type SearchParams,
} from "@/lib/nls";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Babysitting pour concerts et événements",
    description:
      "Trouve une solution de garde d’enfants pour tes soirées, mariages et concerts. Profils vérifiés et contact direct.",
    path: "/beaute/babysitting",
    locale,
    keywords: [
      "babysitting concert",
      "garde enfants soirée",
      "babysitter événement",
    ],
  });
}

type BabysittingPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<SearchParams>;
};

const COPY: Record<
  Language,
  {
    back: string;
    eyebrow: string;
    title: string;
    description: string;
    priceLabel: string;
    priceUnit: string;
    benefits: string[];
    cta: string;
    note: string;
  }
> = {
  fr: {
    back: "Retour aux prestations",
    eyebrow: "Babysitting",
    title: "Garde d'enfants pendant le concert",
    description:
      "Tu sors et tu cherches quelqu'un de fiable pour garder tes enfants ? On met en relation avec des babysitters de la diaspora, vérifiés par l'équipe.",
    priceLabel: "Tarif",
    priceUnit: "/heure",
    benefits: [
      "Babysitters vérifiés (pièce d'identité, références)",
      "Disponibles soirées des 2 et 3 mai 2026",
      "Paris et proche banlieue (zones 1-3)",
      "Photos, présentation et avis visibles avant réservation",
    ],
    cta: "Réserver par email",
    note: "Réponse sous 24 h. Acompte demandé pour valider la réservation.",
  },
  en: {
    back: "Back to services",
    eyebrow: "Babysitting",
    title: "Childcare during the concert",
    description:
      "Going out and need a trusted sitter for the kids? We connect you with diaspora babysitters vetted by the team.",
    priceLabel: "Rate",
    priceUnit: "/hour",
    benefits: [
      "Vetted sitters (ID, references)",
      "Available evenings of May 2 & 3, 2026",
      "Paris and inner suburbs (zones 1-3)",
      "Photos, intro and reviews before booking",
    ],
    cta: "Book by email",
    note: "Reply within 24 h. Deposit required to confirm booking.",
  },
};

export default async function BabysittingPage({
  params,
  searchParams,
}: BabysittingPageProps) {
  const { locale } = await params;
  const lang = languageOf(locale);
  const c = COPY[lang];

  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-8vw] top-[20vh] font-display text-[22vw] text-blood opacity-[0.03] select-none leading-none uppercase">
          KIDS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          className="mb-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute transition-colors hover:text-blood"
          href={localizedHref("/beaute", locale)}
        >
          <ChevronLeft className="size-3" />
          {c.back}
        </Link>

        <SectionHeading
          number="04"
          description={c.description}
          eyebrow={c.eyebrow}
          title={c.title}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2.5rem] border border-white/10 bg-coal/80 p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="size-16 rounded-3xl bg-blood/10 border border-blood/30 flex items-center justify-center text-blood">
                <Baby className="size-8" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                  {c.priceLabel}
                </p>
                <p className="font-display text-5xl text-paper">
                  10 €
                  <span className="ml-2 font-mono text-sm text-paper-mute uppercase tracking-widest">
                    {c.priceUnit}
                  </span>
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {c.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-paper-dim"
                >
                  <Check className="mt-1 size-4 shrink-0 text-blood" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-[2.5rem] border border-blood/30 bg-blood/5 p-10">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
                Nevent
              </p>
              <p className="font-body italic text-paper-dim leading-relaxed">
                {c.note}
              </p>
            </div>
            <Button
              asChild
              className="h-14 w-full text-base bg-blood hover:bg-blood/90 group"
              size="lg"
            >
              <a href="mailto:contact@mbokahub.com?subject=Babysitting%20-%20Demande%20via%20Nevent">
                <Mail className="mr-2 size-4" />
                {c.cta}
              </a>
            </Button>
            <p className="text-center font-mono text-[10px] text-paper-mute uppercase tracking-widest">
              contact@mbokahub.com
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
