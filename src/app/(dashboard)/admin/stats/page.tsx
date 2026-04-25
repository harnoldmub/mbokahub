import { BadgeEuro, Crown, Eye, Flame, MessageCircle, Star, Users } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function StatBox({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: typeof Eye;
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "gold" | "red" | "green";
}) {
  const toneClass =
    tone === "gold"
      ? "border-amber-400/40 bg-amber-400/10"
      : tone === "red"
        ? "border-red-500/40 bg-red-500/10"
        : tone === "green"
          ? "border-emerald-400/40 bg-emerald-400/10"
          : "border-white/10 bg-white/5";

  return (
    <article className={`rounded-2xl border ${toneClass} p-5`}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
          {label}
        </p>
        <Icon aria-hidden className="size-4 text-red-400" />
      </div>
      <p className="mt-3 font-heading text-3xl text-foreground">{value}</p>
      {hint && <p className="mt-1 text-muted-foreground text-xs">{hint}</p>}
    </article>
  );
}

export default async function AdminStatsPage() {
  const [
    prosTotal,
    prosVerified,
    prosPremium,
    prosByCategoryRaw,
    topPros,
    aggPros,
    trajetsTotal,
    trajetsActive,
    aggTrajets,
    topTrajets,
    aftersTotal,
    aftersActive,
    aggAfters,
    merchTotal,
    aggMerch,
    paymentsAgg,
    usersTotal,
    vipsTotal,
  ] = await Promise.all([
    prisma.proProfile.count(),
    prisma.proProfile.count({ where: { isVerified: true } }),
    prisma.proProfile.count({ where: { isPremium: true } }),
    prisma.proProfile.groupBy({
      by: ["category"],
      _count: { _all: true },
      _sum: { views: true, contactAttempts: true },
      orderBy: { _count: { category: "desc" } },
    }),
    prisma.proProfile.findMany({
      orderBy: [{ views: "desc" }],
      take: 10,
      select: {
        id: true,
        displayName: true,
        category: true,
        city: true,
        views: true,
        contactAttempts: true,
        isVerified: true,
        isPremium: true,
        rating: true,
        reviewsCount: true,
      },
    }),
    prisma.proProfile.aggregate({
      _sum: { views: true, contactAttempts: true },
      _avg: { rating: true },
    }),
    prisma.trajet.count(),
    prisma.trajet.count({ where: { isActive: true } }),
    prisma.trajet.aggregate({ _sum: { views: true } }),
    prisma.trajet.findMany({
      orderBy: { views: "desc" },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.after.count(),
    prisma.after.count({ where: { isActive: true } }),
    prisma.after.aggregate({ _sum: { views: true } }),
    prisma.merchProduct.count(),
    prisma.merchProduct.aggregate({ _sum: { clicks: true } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      where: { status: "COMPLETED" },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { isVipActive: true } }),
  ]);

  const totalProViews = aggPros._sum.views ?? 0;
  const totalProContacts = aggPros._sum.contactAttempts ?? 0;
  const conversionRate =
    totalProViews > 0 ? ((totalProContacts / totalProViews) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-2xl text-foreground">Statistiques plateforme</h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Performance globale et focus sur les prestataires (vues, contacts, conversion).
        </p>
      </div>

      {/* GLOBAL OVERVIEW */}
      <section>
        <h3 className="mb-4 font-mono text-muted-foreground text-xs uppercase tracking-widest">
          Vue d'ensemble
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox icon={Users} label="Utilisateurs" value={usersTotal} hint={`${vipsTotal} VIP actifs`} />
          <StatBox icon={Crown} label="Pros total" value={prosTotal} hint={`${prosVerified} validés · ${prosPremium} premium`} tone="gold" />
          <StatBox
            icon={BadgeEuro}
            label="Recettes Mboka Hub"
            value={`${(paymentsAgg._sum.amount ?? 0).toFixed(2)} €`}
            hint={`${paymentsAgg._count._all} paiements (VIP, badges pros, boost, déblocages)`}
            tone="green"
          />
          <StatBox
            icon={Flame}
            label="Conversion pros"
            value={`${conversionRate}%`}
            hint="contacts / vues"
            tone="red"
          />
        </div>
        <p className="mt-3 text-muted-foreground text-xs">
          ℹ️ Mboka Hub n'encaisse pas pour le compte des prestataires. Les fans paient
          directement les pros (cash, virement, leur propre lien). Les recettes ci-dessus sont
          uniquement les abonnements et services payés <em>à</em> Mboka Hub.
        </p>
      </section>

      {/* PRESTATAIRES — DETAIL */}
      <section>
        <h3 className="mb-4 font-mono text-muted-foreground text-xs uppercase tracking-widest">
          Prestataires — performance
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox icon={Eye} label="Vues profils pros" value={totalProViews.toLocaleString("fr-FR")} />
          <StatBox icon={MessageCircle} label="Demandes contact" value={totalProContacts.toLocaleString("fr-FR")} />
          <StatBox
            icon={Star}
            label="Note moyenne"
            value={(aggPros._avg.rating ?? 0).toFixed(1)}
            hint="sur 5"
          />
          <StatBox icon={Crown} label="Pros premium" value={prosPremium} hint="badge or actif" tone="gold" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* By category */}
          <div className="rounded-2xl border border-white/10 bg-white/5">
            <div className="border-white/10 border-b px-5 py-4">
              <h4 className="font-heading text-foreground text-lg">Par catégorie</h4>
              <p className="text-muted-foreground text-xs">Répartition et engagement</p>
            </div>
            <div className="divide-y divide-white/5">
              {prosByCategoryRaw.length === 0 && (
                <p className="px-5 py-8 text-center text-muted-foreground text-sm">
                  Aucun pro pour le moment.
                </p>
              )}
              {prosByCategoryRaw.map((row) => {
                const views = row._sum.views ?? 0;
                const contacts = row._sum.contactAttempts ?? 0;
                return (
                  <div
                    className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                    key={row.category}
                  >
                    <div>
                      <p className="font-medium text-foreground">{row.category}</p>
                      <p className="font-mono text-muted-foreground text-xs">
                        {views.toLocaleString("fr-FR")} vues · {contacts.toLocaleString("fr-FR")} contacts
                      </p>
                    </div>
                    <span className="rounded-full bg-red-500/10 px-3 py-1 font-mono text-red-300 text-xs">
                      {row._count._all}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top pros */}
          <div className="rounded-2xl border border-white/10 bg-white/5">
            <div className="border-white/10 border-b px-5 py-4">
              <h4 className="font-heading text-foreground text-lg">Top 10 pros (par vues)</h4>
              <p className="text-muted-foreground text-xs">Classement par audience captée</p>
            </div>
            <div className="divide-y divide-white/5">
              {topPros.length === 0 && (
                <p className="px-5 py-8 text-center text-muted-foreground text-sm">
                  Aucun pro pour le moment.
                </p>
              )}
              {topPros.map((p, i) => (
                <div
                  className="flex items-center gap-3 px-5 py-3 text-sm"
                  key={p.id}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-muted-foreground text-xs">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {p.displayName}
                      {p.isPremium && <span className="ml-2 text-amber-300 text-xs">★</span>}
                    </p>
                    <p className="truncate font-mono text-muted-foreground text-xs">
                      {p.category} · {p.city}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-foreground">{p.views} vues</p>
                    <p className="text-muted-foreground">{p.contactAttempts} contacts</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-white/10 border-t px-5 py-3">
              <Link href="/admin/pros" className="text-red-400 text-xs hover:text-red-300">
                Voir tous les prestataires →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OTHER CONTENT */}
      <section>
        <h3 className="mb-4 font-mono text-muted-foreground text-xs uppercase tracking-widest">
          Trajets, afters & merch
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatBox
            icon={Eye}
            label="Trajets"
            value={trajetsTotal}
            hint={`${trajetsActive} actifs · ${(aggTrajets._sum.views ?? 0).toLocaleString("fr-FR")} vues`}
          />
          <StatBox
            icon={Eye}
            label="Afters"
            value={aftersTotal}
            hint={`${aftersActive} actifs · ${(aggAfters._sum.views ?? 0).toLocaleString("fr-FR")} vues`}
          />
          <StatBox
            icon={Eye}
            label="Merch"
            value={merchTotal}
            hint={`${(aggMerch._sum.clicks ?? 0).toLocaleString("fr-FR")} clics totaux`}
          />
        </div>

        {topTrajets.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5">
            <div className="border-white/10 border-b px-5 py-4">
              <h4 className="font-heading text-foreground text-lg">Top 5 trajets</h4>
            </div>
            <div className="divide-y divide-white/5">
              {topTrajets.map((t) => (
                <div className="flex items-center justify-between gap-4 px-5 py-3 text-sm" key={t.id}>
                  <div className="min-w-0">
                    <p className="truncate text-foreground">
                      {t.villeDepart} → {t.villeArrivee}
                    </p>
                    <p className="truncate font-mono text-muted-foreground text-xs">
                      {t.user.name ?? t.user.email} · {t.date.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <p className="text-foreground text-xs">{t.views} vues</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
