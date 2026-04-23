import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, name: true } } },
    take: 200,
  });

  const totalCompleted = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl text-foreground">
            Paiements ({payments.length})
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Historique des transactions Stripe.
          </p>
        </div>
        <div className="rounded-2xl border border-green-500/40 bg-green-500/10 px-5 py-3">
          <p className="font-mono text-green-300/80 text-xs uppercase">Total encaissé</p>
          <p className="font-heading text-2xl text-green-300">{totalCompleted.toFixed(2)} €</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Stripe</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-foreground text-xs">
                  <div>{p.user.name ?? "—"}</div>
                  <div className="font-mono text-muted-foreground">{p.user.email}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{p.type}</td>
                <td className="px-4 py-3 text-foreground">{p.amount} {p.currency.toUpperCase()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    p.status === "COMPLETED" ? "bg-green-500/20 text-green-300" :
                    p.status === "PENDING" ? "bg-yellow-500/20 text-yellow-300" :
                    p.status === "FAILED" ? "bg-red-500/20 text-red-300" :
                    "bg-white/10 text-muted-foreground"
                  }`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 font-mono text-muted-foreground text-xs">
                  {p.stripeSessionId.slice(0, 14)}...
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {p.createdAt.toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Aucun paiement pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
