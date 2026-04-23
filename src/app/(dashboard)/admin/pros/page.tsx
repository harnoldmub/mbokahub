import { prisma } from "@/lib/db/prisma";
import { verifyProProfile, deleteProProfile } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminProsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where = status === "pending" ? { isVerified: false } : status === "verified" ? { isVerified: true } : {};

  const pros = await prisma.proProfile.findMany({
    where,
    orderBy: [{ isVerified: "asc" }, { createdAt: "desc" }],
    include: { user: { select: { email: true, name: true } } },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Profils pros ({pros.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Valider, rejeter ou supprimer les profils prestataires.
        </p>
        <div className="mt-4 flex gap-2">
          <a href="/admin/pros" className="rounded-full border border-white/20 px-3 py-1 text-foreground text-xs hover:bg-white/10">Tous</a>
          <a href="/admin/pros?status=pending" className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-yellow-300 text-xs hover:bg-yellow-500/20">En attente</a>
          <a href="/admin/pros?status=verified" className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-green-300 text-xs hover:bg-green-500/20">Validés</a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Nom affiché</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pros.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-foreground">{p.displayName}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{p.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.city}, {p.country}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground text-xs">{p.whatsapp}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground text-xs">{p.user.email}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {p.isPremium ? "✓" : "—"}
                </td>
                <td className="px-4 py-3">
                  {p.isVerified ? (
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-300 text-xs">Validé</span>
                  ) : (
                    <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-yellow-300 text-xs">En attente</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <form action={verifyProProfile.bind(null, p.id, !p.isVerified)}>
                      <button type="submit" className="rounded-md bg-green-500/20 px-2 py-1 text-green-300 text-xs hover:bg-green-500/30">
                        {p.isVerified ? "Dévalider" : "Valider"}
                      </button>
                    </form>
                    <form action={deleteProProfile.bind(null, p.id)}>
                      <button type="submit" className="text-red-400 text-xs hover:text-red-300">Supprimer</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {pros.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  Aucun profil pro pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
