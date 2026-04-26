import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { prisma } from "@/lib/db/prisma";
import {
  createAfterAdmin,
  deleteAfter,
  toggleAfterActive,
  toggleAfterBoosted,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminAftersPage() {
  const afters = await prisma.after.findMany({
    orderBy: { date: "asc" },
    take: 200,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Afters ({afters.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Soirées after-concert. Créer, masquer, mettre en avant ou supprimer.
        </p>
      </div>

      <details className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 open:bg-red-500/10">
        <summary className="cursor-pointer font-heading text-foreground text-lg">
          ➕ Créer un after
        </summary>
        <form
          action={createAfterAdmin}
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <input
            name="name"
            required
            placeholder="Nom de l'after"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground sm:col-span-2"
          />
          <input
            name="venue"
            required
            placeholder="Lieu (ex: Le Cabaret Sauvage)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="address"
            required
            placeholder="Adresse complète"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="city"
            defaultValue="Paris"
            placeholder="Ville"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="date"
            type="datetime-local"
            required
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
          />
          <input
            name="capacity"
            type="number"
            min={0}
            placeholder="Capacité"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="priceFrom"
            type="number"
            step="0.01"
            min={0}
            required
            placeholder="Prix à partir de (€)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="ticketUrl"
            type="url"
            required
            placeholder="URL billetterie"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground sm:col-span-2"
          />
          <input
            name="flyerUrl"
            type="url"
            placeholder="URL du flyer (optionnel)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground sm:col-span-2"
          />
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Description"
            className="sm:col-span-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <label className="flex items-center gap-2 text-foreground text-sm">
            <input type="checkbox" name="isVerified" defaultChecked />
            Marquer comme vérifié
          </label>
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-red-500 px-4 py-2 font-semibold text-white text-sm transition hover:bg-red-600"
          >
            Publier cet after
          </button>
        </form>
      </details>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Lieu</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {afters.map((a) => (
              <tr key={a.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-foreground">
                  <div>{a.name}</div>
                  <div className="font-mono text-muted-foreground text-xs">{a.slug}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {a.date.toLocaleString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  <div>{a.venue}</div>
                  <div>{a.city}</div>
                </td>
                <td className="px-4 py-3 text-foreground">{a.priceFrom}€</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {a.isActive ? (
                      <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-300 text-xs">Actif</span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2 py-1 text-muted-foreground text-xs">Masqué</span>
                    )}
                    {a.isBoosted && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-1 text-amber-200 text-xs">Boosté</span>
                    )}
                    {a.isVerified && (
                      <span className="rounded-full bg-blue-500/20 px-2 py-1 text-blue-300 text-xs">Vérifié</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <form action={toggleAfterActive.bind(null, a.id, !a.isActive)}>
                      <button type="submit" className="rounded-md bg-white/10 px-2 py-1 text-foreground text-xs hover:bg-white/20">
                        {a.isActive ? "Masquer" : "Activer"}
                      </button>
                    </form>
                    <form action={toggleAfterBoosted.bind(null, a.id, !a.isBoosted)}>
                      <button type="submit" className="rounded-md bg-amber-500/20 px-2 py-1 text-amber-200 text-xs hover:bg-amber-500/30">
                        {a.isBoosted ? "Débooster" : "Booster"}
                      </button>
                    </form>
                    <ConfirmActionForm
                      action={deleteAfter.bind(null, a.id)}
                      triggerLabel="Supprimer"
                      triggerClassName="text-red-400 text-xs hover:text-red-300"
                      title="Supprimer cet after ?"
                      description={
                        <>
                          L&apos;after{" "}
                          <span className="font-semibold text-foreground">{a.name}</span>{" "}
                          sera supprimé définitivement.
                        </>
                      }
                      confirmLabel="Supprimer l'after"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {afters.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Aucun after pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
