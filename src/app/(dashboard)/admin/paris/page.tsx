import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { prisma } from "@/lib/db/prisma";
import {
  createParisAdmin,
  deleteParis,
  toggleParisSponsored,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminParisPage() {
  const items = await prisma.parisClassic.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    take: 300,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Paris pratique ({items.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Adresses incontournables : restaurants, monuments, shopping, sorties.
        </p>
      </div>

      <details className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 open:bg-red-500/10">
        <summary className="cursor-pointer font-heading text-foreground text-lg">
          ➕ Ajouter une adresse Paris
        </summary>
        <form
          action={createParisAdmin}
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <input
            name="name"
            required
            placeholder="Nom de l'adresse"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="category"
            required
            placeholder="Catégorie (Restaurant, Monument…)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="address"
            required
            placeholder="Adresse complète"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground sm:col-span-2"
          />
          <input
            name="arrondissement"
            type="number"
            min={1}
            max={20}
            placeholder="Arrondissement (1-20)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <select
            name="priceLevel"
            defaultValue="2"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
          >
            <option value="1">€ — Économique</option>
            <option value="2">€€ — Moyen</option>
            <option value="3">€€€ — Cher</option>
            <option value="4">€€€€ — Très cher</option>
          </select>
          <input
            name="phone"
            placeholder="Téléphone"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="order"
            type="number"
            defaultValue="0"
            placeholder="Ordre (0 = premier)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="externalUrl"
            type="url"
            placeholder="Site web"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="googleMapsUrl"
            type="url"
            placeholder="URL Google Maps"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="imageUrl"
            type="url"
            placeholder="URL image"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground sm:col-span-2"
          />
          <input
            name="tags"
            placeholder="Tags (séparés par virgule)"
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
            <input type="checkbox" name="isSponsored" />
            Sponsorisé
          </label>
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-red-500 px-4 py-2 font-semibold text-white text-sm transition hover:bg-red-600"
          >
            Ajouter cette adresse
          </button>
        </form>
      </details>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Arrond.</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Adresse</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-foreground">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{p.category}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {p.arrondissement ? `${p.arrondissement}e` : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{"€".repeat(p.priceLevel)}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{p.address}</td>
                <td className="px-4 py-3">
                  {p.isSponsored ? (
                    <span className="rounded-full bg-amber-500/20 px-2 py-1 text-amber-200 text-xs">Sponsorisé</span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2 py-1 text-muted-foreground text-xs">Standard</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <form action={toggleParisSponsored.bind(null, p.id, !p.isSponsored)}>
                      <button type="submit" className="rounded-md bg-amber-500/20 px-2 py-1 text-amber-200 text-xs hover:bg-amber-500/30">
                        {p.isSponsored ? "Retirer" : "Sponsoriser"}
                      </button>
                    </form>
                    <ConfirmActionForm
                      action={deleteParis.bind(null, p.id)}
                      triggerLabel="Supprimer"
                      triggerClassName="text-red-400 text-xs hover:text-red-300"
                      title="Supprimer ce lieu ?"
                      description={
                        <>
                          Le lieu{" "}
                          <span className="font-semibold text-foreground">{p.name}</span>{" "}
                          sera retiré des classiques de Paris.
                        </>
                      }
                      confirmLabel="Supprimer"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  Aucune adresse pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
