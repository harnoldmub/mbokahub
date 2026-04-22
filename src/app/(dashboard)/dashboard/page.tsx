import {
  BadgeEuro,
  CalendarDays,
  Contact,
  Crown,
  Megaphone,
} from "lucide-react";
import Link from "next/link";

import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatMoney, getDashboardUser } from "@/lib/dashboard";
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
          Bonjour {user.name ?? "la famille"}
        </h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Ici tu suis ton accès VIP, tes contacts débloqués et tes annonces.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          description={
            user.vipUntil
              ? `Expire le ${formatDate(user.vipUntil)}`
              : "Pas encore activé"
          }
          icon={Crown}
          label="VIP"
          value={user.isVipActive ? "Actif" : "Inactif"}
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
          description="Paiements Mboka Hub"
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
                        {formatDate(payment.completedAt ?? payment.createdAt)}
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
