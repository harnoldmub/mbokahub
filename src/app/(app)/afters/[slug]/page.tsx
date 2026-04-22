import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoAfters } from "@/lib/demo-data";

type AfterDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AfterDetailsPage({
  params,
}: AfterDetailsPageProps) {
  const { slug } = await params;
  const after = demoAfters.find((item) => item.slug === slug);

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
        <Badge variant="outline">{after.city}</Badge>
        <h1 className="mt-5 font-heading text-4xl text-foreground sm:text-5xl">
          {after.name}
        </h1>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Date</dt>
            <dd className="mt-1 font-heading text-xl">{after.dateLabel}</dd>
          </div>
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Lieu</dt>
            <dd className="mt-1 font-heading text-xl">{after.venue}</dd>
          </div>
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Prix</dt>
            <dd className="mt-1 font-heading text-xl">
              des {after.priceFrom} EUR
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-muted-foreground leading-8">
          Cette fiche référence une soirée externe. Les conditions d'entrée,
          prix définitifs et remboursements sont gérés par l'organisateur ou la
          billetterie externe.
        </p>
        <Button asChild className="mt-8 shadow-[var(--glow-red)]">
          <a href={after.ticketUrl} rel="noreferrer" target="_blank">
            Ouvrir la billetterie externe <ExternalLink aria-hidden />
          </a>
        </Button>
      </section>
    </main>
  );
}
