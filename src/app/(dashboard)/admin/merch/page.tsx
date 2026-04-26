import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { prisma } from "@/lib/db/prisma";
import {
  createMerchAdmin,
  deleteMerch,
  toggleMerchFeatured,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminMerchPage() {
  const products = await prisma.merchProduct.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Merch ({products.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Produits dérivés référencés sur la plateforme.
        </p>
      </div>

      <details className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 open:bg-red-500/10">
        <summary className="cursor-pointer font-heading text-foreground text-lg">
          ➕ Ajouter un produit merch
        </summary>
        <form
          action={createMerchAdmin}
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <input
            name="vendorName"
            required
            placeholder="Nom du vendeur / boutique"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="title"
            required
            placeholder="Titre du produit"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="category"
            required
            placeholder="Catégorie (T-shirt, Casquette…)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            min={0}
            required
            placeholder="Prix (€)"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="imageUrl"
            type="url"
            required
            placeholder="URL image"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground sm:col-span-2"
          />
          <input
            name="externalUrl"
            type="url"
            required
            placeholder="URL boutique externe"
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground sm:col-span-2"
          />
          <textarea
            name="description"
            rows={2}
            placeholder="Description (optionnel)"
            className="sm:col-span-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <label className="flex items-center gap-2 text-foreground text-sm">
            <input type="checkbox" name="isFeatured" />
            Mettre en avant
          </label>
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-red-500 px-4 py-2 font-semibold text-white text-sm transition hover:bg-red-600"
          >
            Ajouter ce produit
          </button>
        </form>
      </details>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Vendeur</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Clics</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-foreground">
                  <div className="flex items-center gap-3">
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                    )}
                    <span>{p.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{p.vendorName}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{p.category}</td>
                <td className="px-4 py-3 text-foreground">{p.price}€</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{p.clicks}</td>
                <td className="px-4 py-3">
                  {p.isFeatured ? (
                    <span className="rounded-full bg-amber-500/20 px-2 py-1 text-amber-200 text-xs">À la une</span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2 py-1 text-muted-foreground text-xs">Standard</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <form action={toggleMerchFeatured.bind(null, p.id, !p.isFeatured)}>
                      <button type="submit" className="rounded-md bg-amber-500/20 px-2 py-1 text-amber-200 text-xs hover:bg-amber-500/30">
                        {p.isFeatured ? "Retirer" : "Mettre en avant"}
                      </button>
                    </form>
                    <ConfirmActionForm
                      action={deleteMerch.bind(null, p.id)}
                      triggerLabel="Supprimer"
                      triggerClassName="text-red-400 text-xs hover:text-red-300"
                      title="Supprimer ce produit ?"
                      description={
                        <>
                          Le produit{" "}
                          <span className="font-semibold text-foreground">{p.title}</span>{" "}
                          ({p.vendorName}) sera retiré de la boutique.
                        </>
                      }
                      confirmLabel="Supprimer"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  Aucun produit pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
