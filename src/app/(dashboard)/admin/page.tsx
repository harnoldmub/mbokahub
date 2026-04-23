import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    users,
    pros,
    prosUnverified,
    trajets,
    trajetsActive,
    afters,
    newsletter,
    payments,
    paymentsCompleted,
    promoCodes,
    promoCodesActive,
    quizResults,
    gameScores,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.proProfile.count(),
    prisma.proProfile.count({ where: { isVerified: false } }),
    prisma.trajet.count(),
    prisma.trajet.count({ where: { isActive: true } }),
    prisma.after.count(),
    prisma.newsletterSubscriber.count(),
    prisma.payment.count(),
    prisma.payment.count({ where: { status: "COMPLETED" } }),
    prisma.promoCode.count(),
    prisma.promoCode.count({ where: { isActive: true } }),
    prisma.quizResult.count(),
    prisma.gameScore.count(),
  ]);

  return {
    users,
    pros,
    prosUnverified,
    trajets,
    trajetsActive,
    afters,
    newsletter,
    payments,
    paymentsCompleted,
    promoCodes,
    promoCodesActive,
    quizResults,
    gameScores,
  };
}

function StatCard({
  label,
  value,
  hint,
  href,
  highlight,
}: {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <div
      className={`rounded-2xl border ${
        highlight
          ? "border-red-500/40 bg-red-500/10"
          : "border-white/10 bg-white/5"
      } p-5 transition hover:border-red-500/40`}
    >
      <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl text-foreground">{value}</p>
      {hint && <p className="mt-1 text-muted-foreground text-xs">{hint}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminDashboardPage() {
  const s = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Vue d'ensemble
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Indicateurs clés de la plateforme Mboka Hub.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Utilisateurs"
          value={s.users}
          href="/admin/users"
        />
        <StatCard
          label="Profils pros"
          value={s.pros}
          hint={`${s.prosUnverified} en attente de validation`}
          href="/admin/pros"
          highlight={s.prosUnverified > 0}
        />
        <StatCard
          label="Trajets"
          value={s.trajets}
          hint={`${s.trajetsActive} actifs`}
          href="/admin/trajets"
        />
        <StatCard
          label="Afters"
          value={s.afters}
        />
        <StatCard
          label="Codes promo"
          value={s.promoCodes}
          hint={`${s.promoCodesActive} actifs`}
          href="/admin/promo-codes"
        />
        <StatCard
          label="Newsletter"
          value={s.newsletter}
          href="/admin/newsletter"
        />
        <StatCard
          label="Paiements"
          value={s.payments}
          hint={`${s.paymentsCompleted} confirmés`}
          href="/admin/payments"
        />
        <StatCard label="Quiz · Jeux" value={`${s.quizResults} · ${s.gameScores}`} />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-heading text-foreground text-xl">Actions rapides</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/promo-codes"
            className="rounded-full bg-red-500 px-4 py-2 font-medium text-sm text-white hover:bg-red-600"
          >
            Gérer les codes promo
          </Link>
          <Link
            href="/admin/pros"
            className="rounded-full border border-white/20 px-4 py-2 font-medium text-foreground text-sm hover:bg-white/10"
          >
            Valider les pros ({s.prosUnverified})
          </Link>
          <Link
            href="/admin/users"
            className="rounded-full border border-white/20 px-4 py-2 font-medium text-foreground text-sm hover:bg-white/10"
          >
            Voir les utilisateurs
          </Link>
        </div>
      </section>
    </div>
  );
}
