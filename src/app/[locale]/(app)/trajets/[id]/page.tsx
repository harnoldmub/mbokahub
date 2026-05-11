import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactLock } from "@/components/shared/contact-lock";
import { ReportButton } from "@/components/shared/report-button";
import { PriceOfferDialog } from "@/components/trajets/price-offer-dialog";
import { RulesDialog } from "@/components/trajets/rules-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { isCurrentUserAdmin } from "@/lib/auth-helpers";
import { findCity, suggestPrice } from "@/lib/data/cities";
import { prisma } from "@/lib/db/prisma";

type TrajetDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const FR_DAYS = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
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

function formatDateLabel(date: Date): string {
  return `${FR_DAYS[date.getUTCDay()]} ${date.getUTCDate()} ${FR_MONTHS[date.getUTCMonth()]}`;
}

export const dynamic = "force-dynamic";

export default async function TrajetDetailsPage({
  params,
}: TrajetDetailsPageProps) {
  const { id } = await params;

  const trajet = await prisma.trajet.findUnique({ where: { id } });

  if (!trajet) {
    notFound();
  }

  const [isAdmin, { userId: clerkId }] = await Promise.all([
    isCurrentUserAdmin(),
    auth(),
  ]);
  const isOwner =
    !!clerkId &&
    !!(await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    }).then((u) => u && u.id === trajet.userId));

  if (!trajet.isApproved || !trajet.isActive) {
    if (!isAdmin && !isOwner) {
      notFound();
    }
  }

  const dateLabel = formatDateLabel(trajet.date);

  const fromCity = findCity(trajet.villeDepart);
  const toCity = findCity(trajet.villeArrivee);
  const suggestion =
    fromCity && toCity ? suggestPrice(fromCity, toCity, trajet.placesTotal) : null;
  const suggestedPrice =
    suggestion && trajet.prix > suggestion.perPlaceFair
      ? suggestion.perPlaceFair
      : null;

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
          {trajet.villeDepart} vers {trajet.villeArrivee}
        </h1>
        {trajet.note ? (
          <p className="mt-4 text-muted-foreground text-lg leading-8">
            {trajet.note}
          </p>
        ) : null}
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="border border-white/10 bg-background/70 p-4">
            <dt className="text-muted-foreground text-sm">Date</dt>
            <dd className="mt-1 font-heading text-2xl">
              {dateLabel} à {trajet.heureDepart}
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
              <ContactLock
                value={trajet.whatsapp}
                rawValue={trajet.whatsapp}
              />
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {!isOwner && (
            <PriceOfferDialog
              trajetId={trajet.id}
              prixPublie={trajet.prix}
              villeDepart={trajet.villeDepart}
              villeArrivee={trajet.villeArrivee}
              isSignedIn={!!clerkId}
              suggestedPrice={suggestedPrice}
            />
          )}
          <RulesDialog />
        </div>
        <div className="mt-6 flex justify-end">
          <ReportButton targetType="TRAJET" targetId={trajet.id} variant="button" />
        </div>
      </section>
    </main>
  );
}
