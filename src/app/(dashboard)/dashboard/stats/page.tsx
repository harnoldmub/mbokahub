import { BadgeEuro, BarChart3, Contact, Eye } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatMoney, getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

export default async function StatsPage() {
  const user = await getDashboardUser();

  const [trajets, proProfile, contactsCount, completedPayments] =
    await Promise.all([
      prisma.trajet.findMany({ where: { userId: user.id } }),
      prisma.proProfile.findUnique({ where: { userId: user.id } }),
      prisma.unlockedContact.count({ where: { userId: user.id } }),
      prisma.payment.findMany({
        where: { status: "COMPLETED", userId: user.id },
      }),
    ]);

  const trajetViews = trajets.reduce((sum, trajet) => sum + trajet.views, 0);
  const proViews = proProfile?.views ?? 0;
  const contactAttempts = proProfile?.contactAttempts ?? 0;
  const revenue = completedPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  return (
    <div className="grid gap-8">
      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Stats
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">Performance</h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Vue simple des vues, contacts et paiements liés à ton compte.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          description="Trajets et profil pro"
          icon={Eye}
          label="Vues"
          value={String(trajetViews + proViews)}
        />
        <StatCard
          description="Contacts que tu as débloqués"
          icon={Contact}
          label="Contacts"
          value={String(contactsCount)}
        />
        <StatCard
          description="Tentatives sur ton profil pro"
          icon={BarChart3}
          label="Demandes pro"
          value={String(contactAttempts)}
        />
        <StatCard
          description="Paiements Mboka Hub"
          icon={BadgeEuro}
          label="Total payé"
          value={formatMoney(revenue)}
        />
      </div>

      <section className="rounded-3xl border border-white/10 bg-coal p-6">
        <h2 className="font-heading text-2xl text-paper">Détail annonces</h2>
        <div className="mt-5 grid gap-3">
          {proProfile ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge>Profil pro</Badge>
                <p className="mt-2 font-heading text-paper">
                  {proProfile.displayName}
                </p>
              </div>
              <p className="text-paper-dim">
                {proProfile.views} vues · {proProfile.contactAttempts} contacts
              </p>
            </div>
          ) : null}

          {trajets.map((trajet) => (
            <div
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              key={trajet.id}
            >
              <div>
                <Badge variant="outline">Trajet</Badge>
                <p className="mt-2 font-heading text-paper">
                  {trajet.villeDepart} vers {trajet.villeArrivee}
                </p>
              </div>
              <p className="text-paper-dim">
                {trajet.views} vues · {trajet.placesDispo} places restantes
              </p>
            </div>
          ))}

          {!proProfile && trajets.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-ink/40 p-4 text-paper-dim">
              Aucune annonce à mesurer pour le moment.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
