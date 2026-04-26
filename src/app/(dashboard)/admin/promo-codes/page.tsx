import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { prisma } from "@/lib/db/prisma";
import {
  createPromoCode,
  togglePromoCode,
  deletePromoCode,
  generateInitialPromoCodes,
  ensureMbkFreeCode,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

const CATEGORIES = ["VIP_FAN", "PRO"] as const;

const CATEGORY_LABEL: Record<(typeof CATEGORIES)[number], string> = {
  VIP_FAN: "VIP Famille",
  PRO: "Prestataires Pro (toutes catégories)",
};

export default async function AdminPromoCodesPage() {
  const codes = await prisma.promoCode.findMany({
    orderBy: [{ category: "asc" }, { code: "asc" }],
    include: { _count: { select: { redemptions: true } } },
  });

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    codes: codes.filter((c) => c.category === cat),
  }));

  const total = codes.length;
  const hasMbkFree = codes.some((c) => c.code === "MBKFREE");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl text-foreground">
            Codes promo ({total})
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            10 codes VIP + 10 codes Pro + le code universel{" "}
            <span className="font-mono text-foreground">MBKFREE</span>{" "}
            (inscription Pro gratuite, toutes catégories).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ConfirmActionForm
            action={ensureMbkFreeCode}
            triggerLabel={hasMbkFree ? "Recharger MBKFREE" : "Créer MBKFREE"}
            triggerClassName="rounded-full bg-amber-500 px-4 py-2 text-sm text-black hover:bg-amber-400"
            title="Activer le code MBKFREE ?"
            description="Crée (ou réactive) le code universel MBKFREE — 100% de réduction, 9999 utilisations, valable pour n'importe quelle catégorie pro."
            confirmLabel="Activer MBKFREE"
            variant="warning"
          />
          <ConfirmActionForm
            action={generateInitialPromoCodes}
            triggerLabel="Générer les codes initiaux (20 + MBKFREE)"
            triggerClassName="rounded-full bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
            title="Générer les codes promo initiaux ?"
            description="Cela va créer 10 codes VIP + 10 codes Pro + le code MBKFREE. Les codes existants ne sont pas écrasés."
            confirmLabel="Générer maintenant"
            variant="warning"
          />
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-heading text-foreground text-lg">Créer un code</h3>
        <form
          action={createPromoCode}
          className="mt-4 grid gap-3 sm:grid-cols-5"
        >
          <input
            name="code"
            placeholder="CODE-001"
            required
            className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm uppercase placeholder:text-muted-foreground"
          />
          <select
            name="category"
            required
            className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
          <input
            name="label"
            placeholder="Libellé (optionnel)"
            className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="discountPercent"
            type="number"
            defaultValue={100}
            min={1}
            max={100}
            className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm"
          />
          <input
            name="maxUses"
            type="number"
            defaultValue={1}
            min={1}
            className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm"
          />
          <button
            type="submit"
            className="col-span-full rounded-md bg-white/10 px-4 py-2 text-foreground text-sm hover:bg-white/20"
          >
            Ajouter le code
          </button>
        </form>
      </section>

      {grouped.map((group) => (
        <section key={group.category}>
          <h3 className="mb-3 font-heading text-foreground text-lg">
            {CATEGORY_LABEL[group.category]} ({group.codes.length})
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Libellé</th>
                  <th className="px-4 py-3">Réduction</th>
                  <th className="px-4 py-3">Utilisé</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {group.codes.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-foreground">{c.code}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{c.label ?? "—"}</td>
                    <td className="px-4 py-3 text-foreground">{c.discountPercent}%</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.usedCount}/{c.maxUses}
                    </td>
                    <td className="px-4 py-3">
                      {c.isActive ? (
                        <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-300 text-xs">Actif</span>
                      ) : (
                        <span className="rounded-full bg-white/10 px-2 py-1 text-muted-foreground text-xs">Inactif</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <form action={togglePromoCode.bind(null, c.id, !c.isActive)}>
                          <button type="submit" className="rounded-md bg-white/10 px-2 py-1 text-foreground text-xs hover:bg-white/20">
                            {c.isActive ? "Désactiver" : "Activer"}
                          </button>
                        </form>
                        <ConfirmActionForm
                          action={deletePromoCode.bind(null, c.id)}
                          triggerLabel="Supprimer"
                          triggerClassName="text-red-400 text-xs hover:text-red-300"
                          title="Supprimer ce code promo ?"
                          description={
                            <>
                              Le code{" "}
                              <span className="font-mono font-semibold text-foreground">
                                {c.code}
                              </span>{" "}
                              sera supprimé. Les utilisations passées resteront tracées.
                            </>
                          }
                          confirmLabel="Supprimer"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {group.codes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground text-xs">
                      Aucun code dans cette catégorie. Cliquez sur "Générer les codes initiaux" en haut.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
