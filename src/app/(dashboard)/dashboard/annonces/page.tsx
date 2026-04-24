import { Megaphone, Plus } from "lucide-react";
import Link from "next/link";

import { AnnonceActions } from "@/components/dashboard/annonce-actions";
import { BoostButton } from "@/components/dashboard/boost-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PremiumActivateButton } from "@/components/dashboard/premium-activate-button";
import { ProActions } from "@/components/dashboard/pro-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatMoney, getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

export default async function AnnoncesPage() {
  const user = await getDashboardUser();
  const [trajets, proProfile] = await Promise.all([
    prisma.trajet.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId: user.id },
    }),
    prisma.proProfile.findUnique({
      where: { userId: user.id },
    }),
  ]);

  const hasAnnonces = trajets.length > 0 || Boolean(proProfile);

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
            Annonces
          </p>
          <h1 className="mt-3 font-heading text-4xl text-paper">
            Mes annonces
          </h1>
          <p className="mt-3 max-w-2xl text-paper-dim leading-7">
            Suis tes trajets publiés et ton profil professionnel.
          </p>
        </div>
        <Button asChild>
          <Link href="/trajets/publier">
            <Plus aria-hidden /> Publier
          </Link>
        </Button>
      </div>

      {!hasAnnonces ? (
        <EmptyState
          actionHref="/trajets/publier"
          actionLabel="Publier un trajet"
          description="Tu n'as pas encore d'annonce. Commence par publier un trajet ou créer un profil pro."
          icon={Megaphone}
          title="Aucune annonce"
        />
      ) : (
        <div className="grid gap-4">
          {proProfile ? (
            <article className="rounded-2xl border border-white/10 bg-coal p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge className="bg-gold text-ink">Profil pro</Badge>
                  <h2 className="mt-3 font-heading text-2xl text-paper">
                    {proProfile.displayName}
                  </h2>
                  <p className="mt-1 text-paper-dim">
                    {proProfile.city} · {proProfile.category}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={proProfile.isVerified ? "default" : "outline"}
                    >
                      {proProfile.isVerified ? "Vérifié" : "En attente"}
                    </Badge>
                    <Badge
                      variant={proProfile.isPremium ? "default" : "outline"}
                    >
                      {proProfile.isPremium ? "Premium" : "Gratuit"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <PremiumActivateButton
                      category={proProfile.category}
                      alreadyActive={proProfile.isPremium}
                    />
                    <BoostButton
                      targetType="PRO_PROFILE"
                      targetId={proProfile.id}
                      alreadyBoosted={proProfile.isBoosted}
                    />
                    <ProActions />
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          {trajets.map((trajet) => (
            <article
              className="rounded-2xl border border-white/10 bg-coal p-5"
              key={trajet.id}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={trajet.isActive ? "default" : "outline"}>
                      {trajet.isActive ? "Actif" : "Inactif"}
                    </Badge>
                    <span className="text-paper-mute text-xs font-mono">
                      {trajet.views} vues
                    </span>
                  </div>
                  <h2 className="mt-3 font-heading text-2xl text-paper">
                    {trajet.villeDepart} vers {trajet.villeArrivee}
                  </h2>
                  <p className="mt-1 text-paper-dim">
                    {formatDate(trajet.date)} · {trajet.heureDepart} ·{" "}
                    {formatMoney(trajet.prix)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <BoostButton
                    targetType="TRAJET"
                    targetId={trajet.id}
                    alreadyBoosted={trajet.isBoosted}
                  />
                  <AnnonceActions id={trajet.id} isActive={trajet.isActive} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
