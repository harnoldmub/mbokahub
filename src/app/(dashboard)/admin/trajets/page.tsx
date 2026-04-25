import { prisma } from "@/lib/db/prisma";
import {
  createTrajetAdmin,
  deleteTrajet,
  toggleTrajetActive,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminTrajetsPage() {
  const trajets = await prisma.trajet.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, name: true } } },
    take: 200,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Trajets ({trajets.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Voir, désactiver, supprimer ou créer un trajet manuellement.
        </p>
      </div>

      <details className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 open:bg-red-500/10">
        <summary className="cursor-pointer font-heading text-foreground text-lg">
          ➕ Créer un trajet (publication par admin)
        </summary>
        <form
          action={createTrajetAdmin}
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <input
            name="driverEmail"
            type="email"
            required
            placeholder="Email du conducteur (existant ou nouveau)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="driverName"
            placeholder="Nom du conducteur"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="villeDepart"
            required
            placeholder="Ville de départ"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="paysDepart"
            required
            placeholder="Pays de départ (FR, BE, NL, DE...)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="villeArrivee"
            defaultValue="Paris"
            placeholder="Ville d'arrivée"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="date"
            type="date"
            required
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="heureDepart"
            required
            placeholder="Heure (ex 14:30)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="placesTotal"
            type="number"
            min={1}
            max={9}
            required
            placeholder="Places"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="prix"
            type="number"
            min={0}
            step="0.01"
            required
            placeholder="Prix par place (€)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="whatsapp"
            required
            placeholder="WhatsApp (+33…)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="vehicule"
            placeholder="Marque véhicule"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="vehiculeModel"
            placeholder="Modèle"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="vehiculeColor"
            placeholder="Couleur"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <textarea
            name="note"
            rows={2}
            placeholder="Note (optionnel)"
            className="sm:col-span-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-red-500 px-4 py-2 font-semibold text-white text-sm transition hover:bg-red-600"
          >
            Publier ce trajet
          </button>
        </form>
      </details>

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
