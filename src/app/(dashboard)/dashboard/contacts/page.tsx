import { Contact, LockKeyhole } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate, getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

export default async function ContactsPage() {
  const user = await getDashboardUser();
  const unlockedContacts = await prisma.unlockedContact.findMany({
    orderBy: { unlockedAt: "desc" },
    where: { userId: user.id },
  });

  const trajetIds = unlockedContacts
    .filter((contactItem) => contactItem.targetType === "TRAJET")
    .map((contactItem) => contactItem.targetId);
  const proIds = unlockedContacts
    .filter((contactItem) => contactItem.targetType === "PRO_PROFILE")
    .map((contactItem) => contactItem.targetId);

  const [trajets, pros] = await Promise.all([
    trajetIds.length
      ? prisma.trajet.findMany({ where: { id: { in: trajetIds } } })
      : Promise.resolve([]),
    proIds.length
      ? prisma.proProfile.findMany({ where: { id: { in: proIds } } })
      : Promise.resolve([]),
  ]);

  const trajetById = new Map(trajets.map((trajet) => [trajet.id, trajet]));
  const proById = new Map(pros.map((pro) => [pro.id, pro]));

  return (
    <div className="grid gap-8">
      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Contacts
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">
          Contacts débloqués
        </h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Les numéros WhatsApp débloqués restent ici pour les retrouver vite.
        </p>
      </div>

      {unlockedContacts.length === 0 ? (
        <EmptyState
          actionHref="/trajets"
          actionLabel="Explorer les annonces"
          description="Tu n'as pas encore débloqué de contact. Quand tu le fais, il apparaît ici."
          icon={LockKeyhole}
          title="Aucun contact débloqué"
        />
      ) : (
        <div className="grid gap-4">
          {unlockedContacts.map((contactItem) => {
            const trajet = trajetById.get(contactItem.targetId);
            const pro = proById.get(contactItem.targetId);
            const title = trajet
              ? `${trajet.villeDepart} vers ${trajet.villeArrivee}`
              : (pro?.displayName ?? "Contact supprimé");
            const whatsapp =
              trajet?.whatsapp ?? pro?.whatsapp ?? "Indisponible";

            return (
              <article
                className="rounded-2xl border border-white/10 bg-coal p-5"
                key={contactItem.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Badge variant="outline">{contactItem.targetType}</Badge>
                    <h2 className="mt-3 font-heading text-2xl text-paper">
                      {title}
                    </h2>
                    <p className="mt-1 text-paper-dim text-sm">
                      Débloqué le {formatDate(contactItem.unlockedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-smoke px-4 py-2 text-paper">
                    <Contact aria-hidden className="size-4 text-blood" />
                    {whatsapp}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
