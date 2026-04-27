import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ReportButton } from "@/components/shared/report-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

type AfterDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

const FR_DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
const FR_MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function formatAfterDate(date: Date): string {
  const d = FR_DAYS[date.getUTCDay()];
  const day = date.getUTCDate();
  const m = FR_MONTHS[date.getUTCMonth()];
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${d} ${day} ${m}, ${hh}:${mm}`;
}

export const dynamic = "force-dynamic";

export default async function AfterDetailsPage({
  params,
}: AfterDetailsPageProps) {
  const { slug } = await params;

  const after = await prisma.after.findFirst({
    where: { slug, isApproved: true, isActive: true },
  });

  if (!after) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Button asChild size="sm" variant="ghost">
        <Link href="/afters">
          <ArrowLeft aria-hidden /> Retour aux afters
        </Link>
      </Button>
      <section className="mt-8 border border-white/10 bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          {after.isBoosted ? <Badge>Vedette</Badge> : null}
          {after.isVerified ? (
            <Badge className="border-blue-400/40 bg-blue-500/10 text-blue-300">
              Vérifié
            </Badge>
          ) : null}
          <Badge variant="outline">{after.city}</Badge>
        </div>
        <h1 className="mt-5 font-heading text-4xl text-foreground sm:text-5xl">
          {after.name}
        </h1>
        <p className="mt-4 text-muted-foreground text-lg leading-8 whitespace-pre-line">
          {after.description}
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Date</dt>
            <dd className="mt-1 font-heading text-xl">
              {formatAfterDate(after.date)}
            </dd>
          </div>
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Lieu</dt>
            <dd className="mt-1 font-heading text-xl">{after.venue}</dd>
            <dd className="mt-1 text-sm text-muted-foreground">
              {after.address}
            </dd>
          </div>
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Prix</dt>
            <dd className="mt-1 font-heading text-xl">
              à partir de {after.priceFrom} EUR
            </dd>
            {after.capacity ? (
              <dd className="mt-1 text-sm text-muted-foreground">
                Capacité : {after.capacity}
              </dd>
            ) : null}
          </div>
        </dl>
        <p className="mt-6 text-muted-foreground leading-8">
          Cette fiche référence une soirée externe. Les conditions
          d&apos;entrée, prix définitifs et remboursements sont gérés par
          l&apos;organisateur ou la billetterie externe. Mboka Hub n&apos;est
          pas partie au contrat.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="shadow-[var(--glow-red)]">
            <a href={after.ticketUrl} rel="noreferrer noopener" target="_blank">
              Ouvrir la billetterie externe <ExternalLink aria-hidden />
            </a>
          </Button>
        </div>
        <div className="mt-6 flex justify-end">
          <ReportButton targetType="AFTER" targetId={after.id} variant="button" />
        </div>
      </section>
    </main>
  );
}
