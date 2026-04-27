import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { prisma } from "@/lib/db/prisma";
import {
  createAfterAdmin,
  deleteAfter,
  setAfterApproval,
  toggleAfterActive,
  toggleAfterBoosted,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminAftersPage() {
  const afters = await prisma.after.findMany({
    orderBy: [{ isApproved: "asc" }, { date: "asc" }],
    include: {
      organizer: { select: { email: true, name: true } },
    },
    take: 200,
  });

  const pendingCount = afters.filter((a) => !a.isApproved).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Afters ({afters.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Soirées after-concert. Valider, masquer, mettre en avant ou supprimer.
        </p>
      </div>

      {pendingCount > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-amber-200 text-sm">
          <span className="font-semibold">
            ⏱ {pendingCount} after{pendingCount > 1 ? "s" : ""}
          </span>{" "}
          en attente de validation. Les fans ne les voient pas tant que tu ne
          les as pas approuvés.
        </div>
      )}

      <details className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 open:bg-red-500/10">
        <summary className="cursor-pointer font-heading text-foreground text-lg">
          ➕ Créer un after (publication par admin)
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
            Publier cet after (validé directement)
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
              <th className="px-4 py-3">Organisateur</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {afters.map((a) => (
              <tr
                key={a.id}
                className={
                  a.isApproved
                    ? "hover:bg-white/5"
                    : "bg-amber-500/5 hover:bg-amber-500/10"
                }
              >
                <td className="px-4 py-3 text-foreground">
                  <div>{a.name}</div>
                  <div className="font-mono text-muted-foreground text-xs">
                    {a.slug}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {a.date.toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  <div>{a.venue}</div>
                  <div>{a.city}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {a.organizer ? (
                    <>
                      <div className="text-foreground">
                        {a.organizer.name || "—"}
                      </div>
                      <div>{a.organizer.email}</div>
                    </>
                  ) : (
                    <span className="italic">Admin</span>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground">{a.priceFrom}€</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {a.isApproved ? (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300 text-xs">
                        ✓ Validé
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/30 px-2 py-1 font-semibold text-amber-200 text-xs">
                        ⏱ En attente
                      </span>
                    )}
                    {a.isActive ? (
                      <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-300 text-xs">
                        Actif
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2 py-1 text-muted-foreground text-xs">
                        Masqué
                      </span>
                    )}
                    {a.isBoosted && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-1 text-amber-200 text-xs">
                        Vedette
                      </span>
                    )}
                    {a.isVerified && (
                      <span className="rounded-full bg-blue-500/20 px-2 py-1 text-blue-300 text-xs">
                        Vérifié
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <a
                      href={`/afters/${a.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md bg-blue-500/20 px-2 py-1 text-blue-300 text-xs hover:bg-blue-500/30"
                    >
                      Voir la fiche
                    </a>
                    {a.isApproved ? (
                      <ConfirmActionForm
                        action={setAfterApproval.bind(null, a.id, false)}
                        triggerLabel="Dévalider"
                        triggerClassName="rounded-md bg-amber-500/20 px-2 py-1 text-amber-200 text-xs hover:bg-amber-500/30"
                        title="Retirer la validation ?"
                        description={
                          <>
                            L&apos;after{" "}
                            <span className="font-semibold text-foreground">
                              {a.name}
                            </span>{" "}
                            sera retiré de la liste publique jusqu&apos;à
                            nouvelle validation.
                          </>
                        }
                        confirmLabel="Dévalider"
                        variant="warning"
                      />
                    ) : (
                      <form
                        action={setAfterApproval.bind(null, a.id, true)}
                      >
                        <button
                          type="submit"
                          className="rounded-md bg-emerald-500/30 px-3 py-1 font-semibold text-emerald-100 text-xs hover:bg-emerald-500/40"
                        >
                          ✓ Valider
                        </button>
                      </form>
                    )}
                    <form
                      action={toggleAfterActive.bind(null, a.id, !a.isActive)}
                    >
                      <button
                        type="submit"
                        className="rounded-md bg-white/10 px-2 py-1 text-foreground text-xs hover:bg-white/20"
                      >
                        {a.isActive ? "Masquer" : "Activer"}
                      </button>
                    </form>
                    <form
                      action={toggleAfterBoosted.bind(null, a.id, !a.isBoosted)}
                    >
                      <button
                        type="submit"
                        className="rounded-md bg-amber-500/20 px-2 py-1 text-amber-200 text-xs hover:bg-amber-500/30"
                      >
                        {a.isBoosted ? "Débooster" : "Booster"}
                      </button>
                    </form>
                    <ConfirmActionForm
                      action={deleteAfter.bind(null, a.id)}
                      triggerLabel="Supprimer"
                      triggerClassName="rounded-md bg-red-500/20 px-2 py-1 text-red-300 text-xs hover:bg-red-500/30"
                      title="Supprimer cet after ?"
                      description={
                        <>
                          L&apos;after{" "}
                          <span className="font-semibold text-foreground">
                            {a.name}
                          </span>{" "}
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
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
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
