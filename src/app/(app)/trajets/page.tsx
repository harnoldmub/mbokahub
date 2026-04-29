import { Plus } from "lucide-react";
import Link from "next/link";

import { VipMemberBanner } from "@/components/marketing/vip-member-banner";
import { TrajetsListClient } from "@/components/trajets/trajets-list-client";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import type { TrajetDemo } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

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
  const d = FR_DAYS[date.getUTCDay()];
  const day = date.getUTCDate();
  const m = FR_MONTHS[date.getUTCMonth()];
  return `${d} ${day} ${m}`;
}

function maskPhone(raw: string): string {
  const cleaned = raw.replace(/\s+/g, "");
  if (cleaned.length <= 4) return "+•• •• •• •• ••";
  const head = cleaned.slice(0, 3);
  return `${head} •• •• •• ••`;
}

export default async function TrajetsPage() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Plateforme 100% gratuite pour les fans : tous les contacts WhatsApp des
  // conducteurs sont visibles. Ordre : boostés d'abord, puis date la plus
  // proche.
  const trajetsDb = await prisma.trajet.findMany({
    where: {
      isApproved: true,
      isActive: true,
      date: { gte: today },
    },
    orderBy: [
      { isBoosted: "desc" },
      { date: "asc" },
      { createdAt: "desc" },
    ],
    take: 200,
  });

  const trajets: (TrajetDemo & {
    dateIso: string;
    carPhoto?: string | null;
    vehiculeColor?: string | null;
    vehiculeModel?: string | null;
    whatsappRaw?: string | null;
  })[] = trajetsDb.map((t) => ({
    id: t.id,
    villeDepart: t.villeDepart,
    paysDepart: t.paysDepart,
    dateLabel: formatDateLabel(t.date),
    dateIso: t.date.toISOString().slice(0, 10),
    heureDepart: t.heureDepart,
    placesDispo: t.placesDispo,
    placesTotal: t.placesTotal,
    prix: t.prix,
    vehicule: t.vehicule ?? t.vehiculeModel ?? "Véhicule",
    note: t.note ?? "",
    whatsappMasked: maskPhone(t.whatsapp),
    isBoosted: t.isBoosted,
    carPhoto: t.carPhoto,
    vehiculeColor: t.vehiculeColor,
    vehiculeModel: t.vehiculeModel,
    whatsappRaw: t.whatsapp,
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <VipMemberBanner message="Tous les contacts covoiturage WhatsApp sont débloqués." />
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            Covoiturage
          </p>
          <h1 className="font-display text-6xl uppercase leading-[0.9] text-paper sm:text-7xl">
            Trouver <br />
            <span className="font-serif italic text-blood">un trajet</span>
          </h1>
          <p className="mt-4 max-w-md font-body text-paper-dim">
            Fais le trajet avec d&apos;autres fans de la Famille Mboka. Économise, rencontre l&apos;Aigle, et
            arrive en toute sécurité au Stade.
          </p>
        </div>
        <Button
          asChild
          className="h-14 px-8 shadow-[var(--glow-red)]"
          size="lg"
        >
          <Link href="/trajets/publier">
            <Plus aria-hidden className="mr-2 size-4" />
            Publier un trajet
          </Link>
        </Button>
      </div>

      <TrajetsListClient trajets={trajets} unlocked />
    </main>
  );
}
