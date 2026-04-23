import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactLock } from "@/components/shared/contact-lock";
import { ReportButton } from "@/components/shared/report-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoTrajets } from "@/lib/demo-data";

type TrajetDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TrajetDetailsPage({
  params,
}: TrajetDetailsPageProps) {
  const { id } = await params;
  const trajet = demoTrajets.find((item) => item.id === id);

  if (!trajet) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Button asChild size="sm" variant="ghost">
        <Link href="/trajets">
          <ArrowLeft aria-hidden /> Retour aux trajets
        </Link>
      </Button>
      <section className="mt-8 border border-white/10 bg-card p-6">
        <div className="flex flex-wrap gap-2">
          {trajet.isBoosted ? <Badge>Vedette</Badge> : null}
          <Badge variant="outline">{trajet.paysDepart}</Badge>
        </div>
        <h1 className="mt-5 font-heading text-4xl text-foreground sm:text-5xl">
          {trajet.villeDepart} vers Paris
        </h1>
        <p className="mt-4 text-muted-foreground text-lg leading-8">
          {trajet.note}
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Date</dt>
            <dd className="mt-1 font-heading text-2xl">
              {trajet.dateLabel} a {trajet.heureDepart}
            </dd>
          </div>
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Places</dt>
            <dd className="mt-1 font-heading text-2xl">
              {trajet.placesDispo}/{trajet.placesTotal}
            </dd>
          </div>
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Prix indicatif</dt>
            <dd className="mt-1 font-heading text-2xl">{trajet.prix} EUR</dd>
          </div>
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Contact</dt>
            <dd className="mt-1">
              <ContactLock value={trajet.whatsappMasked} />
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button className="shadow-[var(--glow-red)]">
            <LockKeyhole aria-hidden /> Débloquer avec VIP
          </Button>
          <Button asChild variant="outline">
            <Link href="/cgu">Voir les règles de mise en relation</Link>
          </Button>
        </div>
        <div className="mt-6 flex justify-end">
          <ReportButton targetType="TRAJET" targetId={trajet.id} variant="button" />
        </div>
      </section>
    </main>
  );
}
