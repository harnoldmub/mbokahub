import { prisma } from "@/lib/db/prisma";
import { deleteTrajet, toggleTrajetActive } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminTrajetsPage() {
  const trajets = await prisma.trajet.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, name: true } } },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Trajets ({trajets.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Voir, désactiver ou supprimer les trajets proposés par les conducteurs.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Conducteur</th>
              <th className="px-4 py-3">Départ</th>
              <th className="px-4 py-3">Arrivée</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Places</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {trajets.map((t) => (
              <tr key={t.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-foreground text-xs">
                  <div className="font-medium">{t.user.name ?? "—"}</div>
                  <div className="font-mono text-muted-foreground">{t.user.email}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.villeDepart}, {t.paysDepart}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.villeArrivee}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {t.date.toLocaleDateString("fr-FR")} · {t.heureDepart}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.placesDispo}/{t.placesTotal}</td>
                <td className="px-4 py-3 text-foreground">{t.prix}€</td>
                <td className="px-4 py-3 font-mono text-muted-foreground text-xs">{t.whatsapp}</td>
                <td className="px-4 py-3">
                  {t.isActive ? (
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-300 text-xs">Actif</span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2 py-1 text-muted-foreground text-xs">Inactif</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <form action={toggleTrajetActive.bind(null, t.id, !t.isActive)}>
                      <button type="submit" className="rounded-md bg-white/10 px-2 py-1 text-foreground text-xs hover:bg-white/20">
                        {t.isActive ? "Masquer" : "Activer"}
                      </button>
                    </form>
                    <form action={deleteTrajet.bind(null, t.id)}>
                      <button type="submit" className="text-red-400 text-xs hover:text-red-300">Supprimer</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {trajets.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                  Aucun trajet pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
