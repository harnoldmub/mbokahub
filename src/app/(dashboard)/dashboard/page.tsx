import {
  BadgeEuro,
  CalendarDays,
  Camera,
  Contact,
  Megaphone,
  Star,
} from "lucide-react";
import Link from "next/link";

import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

export default async function DashboardPage() {
  const user = await getDashboardUser();

  const [contactsCount, trajetsCount, completedPayments, proProfile] =
    await Promise.all([
      prisma.unlockedContact.count({ where: { userId: user.id } }),
      prisma.trajet.count({ where: { userId: user.id } }),
      prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        where: { status: "COMPLETED", userId: user.id },
      }),
      prisma.proProfile.findUnique({ where: { userId: user.id } }),
    ]);

  const totalPaid = completedPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  return (
    <div className="grid gap-8">
      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Dashboard
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">
          Salut {user.name?.split(" ")[0] || "👋"}
        </h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Ici tu gères ton compte, tes annonces, ta fiche pro et tes demandes de
          rendez-vous.
        </p>
      </div>

      {proProfile && proProfile.photos.length === 0 ? (
        <Link
          href="/dashboard/profil-pro"
          className="group flex items-start gap-4 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 transition hover:border-yellow-400/60"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/20 text-yellow-200">
            <Camera className="size-5" />
          </span>
          <div className="flex-1">
            <p className="font-display text-base uppercase text-yellow-100">
              Ajoute des photos à ta fiche pro
            </p>
            <p className="mt-1 text-sm text-yellow-100/80 leading-6">
              Ta fiche{" "}
              <strong className="text-yellow-50">
                {proProfile.displayName}
              </strong>{" "}
              n&apos;a pas encore de photo. Les fans cliquent 3 à 5 fois plus
              sur les profils avec une vraie couverture et une petite galerie.
            </p>
            <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-yellow-200 group-hover:gap-2 transition-all">
              Compléter maintenant →
            </span>
          </div>
        </Link>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          description={
            user.isVipActive
              ? "Badge à vie (ancien VIP)"
              : "Réservé aux anciens VIP"
          }
          icon={Star}
          label="Famille Fondatrice"
          value={user.isVipActive ? "⭐ Membre" : "—"}
        />
        <StatCard
          description="Contacts trajets ou pros"
          icon={Contact}
          label="Contacts"
          value={String(contactsCount)}
        />
        <StatCard
          description="Trajets publiés"
          icon={Megaphone}
          label="Annonces"
          value={String(trajetsCount + (proProfile ? 1 : 0))}
        />
        <StatCard
          description="Paiements Nevent"
          icon={BadgeEuro}
          label="Dépenses"
          value={formatMoney(totalPaid)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline">
              <Link href="/trajets">Trouver un trajet</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/trajets/publier">Publier un trajet</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/beaute/maquilleuses">Voir les pros beauté</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pro/inscrire">Inscrire mon service</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/planning">Gérer mon planning</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/afters/organiser">Organiser un After</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Derniers paiements</CardTitle>
          </CardHeader>
          <CardContent>
            {completedPayments.length > 0 ? (
              <ul className="grid gap-3">
                {completedPayments.map((payment) => (
                  <li
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ink/40 p-4"
                    key={payment.id}
                  >
                    <div>
                      <p className="font-heading text-paper">{payment.type}</p>
                      <p className="text-paper-dim text-sm">
                        {(
                          payment.completedAt ?? payment.createdAt
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <Badge>{formatMoney(payment.amount)}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/40 p-4 text-paper-dim">
                <CalendarDays aria-hidden className="size-5 text-blood" />
                Aucun paiement pour le moment.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
