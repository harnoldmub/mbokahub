import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { PhoneInput } from "@/components/ui/phone-input";
import { prisma } from "@/lib/db/prisma";
import {
  createTrajetAdmin,
  deleteTrajet,
  setTrajetApproval,
  toggleTrajetActive,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminTrajetsPage() {
  const trajets = await prisma.trajet.findMany({
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
    include: { user: { select: { email: true, name: true } } },
    take: 200,
  });

  const pendingCount = trajets.filter((t) => !t.isApproved).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Trajets ({trajets.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Voir, valider, désactiver, supprimer ou créer un trajet manuellement.
        </p>
      </div>

      {pendingCount > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-amber-700 text-sm">
          <span className="font-semibold">⏱ {pendingCount} trajet{pendingCount > 1 ? "s" : ""}</span>{" "}
          en attente de validation. Les passagers ne les voient pas tant que tu ne les as pas approuvés.
        </div>
      )}

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
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="driverName"
            placeholder="Nom du conducteur"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="villeDepart"
            required
            placeholder="Ville de départ"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="paysDepart"
            required
            placeholder="Pays de départ (FR, BE, NL, DE...)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="villeArrivee"
            defaultValue="Paris"
            placeholder="Ville d'arrivée"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="date"
            type="date"
            required
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="heureDepart"
            required
            placeholder="Heure (ex 14:30)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="placesTotal"
            type="number"
            min={1}
            max={9}
            required
            placeholder="Places"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="prix"
            type="number"
            min={0}
            step="0.01"
            required
            placeholder="Prix par place (€)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <PhoneInput name="whatsapp" required />
          <input
            name="vehicule"
            placeholder="Marque véhicule"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="vehiculeModel"
            placeholder="Modèle"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="vehiculeColor"
            placeholder="Couleur"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <textarea
            name="note"
            rows={2}
            placeholder="Note (optionnel)"
            className="sm:col-span-2 rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
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
              <th className="px-4 py-3">Modération</th>
              <th className="px-4 py-3">Visibilité</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {trajets.map((t) => (
              <tr
                key={t.id}
                className={
                  !t.isApproved
                    ? "bg-amber-500/[0.04] hover:bg-amber-500/10"
                    : "hover:bg-white/5"
                }
              >
                <td className="px-4 py-3 text-foreground text-xs">
                  <a
                    href={`/trajets/${t.id}`}
                    className="font-medium hover:text-blue-700 hover:underline"
                  >
                    {t.user.name ?? "—"}
                  </a>
                  <div className="font-mono text-muted-foreground">{t.user.email}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {t.villeDepart}, {t.paysDepart}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.villeArrivee}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {t.date.toLocaleDateString("fr-FR")} · {t.heureDepart}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {t.placesDispo}/{t.placesTotal}
                </td>
                <td className="px-4 py-3 text-foreground">{t.prix}€</td>
                <td className="px-4 py-3 font-mono text-muted-foreground text-xs">
                  {t.whatsapp}
                </td>
                <td className="px-4 py-3">
                  {t.isApproved ? (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300 text-xs">
                      ✓ Validé
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/25 px-2 py-1 text-amber-700 text-xs">
                      ⏱ En attente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {t.isActive ? (
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-700 text-xs">
                      Actif
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2 py-1 text-muted-foreground text-xs">
                      Masqué
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <a
                      href={`/trajets/${t.id}`}
                      className="rounded-md bg-blue-500/20 px-2 py-1 text-blue-700 text-xs hover:bg-blue-500/30"
                    >
                      Voir la fiche
                    </a>
                    {!t.isApproved ? (
                      <ConfirmActionForm
                        action={setTrajetApproval.bind(null, t.id, true)}
                        triggerLabel="Valider"
                        triggerClassName="rounded-md bg-emerald-500 px-2 py-1 text-white text-xs hover:bg-emerald-600"
                        title="Valider ce trajet ?"
                        description={
                          <>
                            Le trajet{" "}
                            <span className="font-semibold text-foreground">
                              {t.villeDepart} → {t.villeArrivee}
                            </span>{" "}
                            du {t.date.toLocaleDateString("fr-FR")} sera publié
                            sur la liste publique. Les passagers pourront le
                            voir et contacter le conducteur.
                          </>
                        }
                        confirmLabel="Valider et publier"
                        variant="default"
                      />
                    ) : (
                      <ConfirmActionForm
                        action={setTrajetApproval.bind(null, t.id, false)}
                        triggerLabel="Dévalider"
                        triggerClassName="rounded-md bg-amber-500/20 px-2 py-1 text-amber-700 text-xs hover:bg-amber-500/30"
                        title="Dévalider ce trajet ?"
                        description={
                          <>
                            Le trajet{" "}
                            <span className="font-semibold text-foreground">
                              {t.villeDepart} → {t.villeArrivee}
                            </span>{" "}
                            repassera en attente et ne sera plus visible
                            publiquement.
                          </>
                        }
                        confirmLabel="Dévalider"
                        variant="warning"
                      />
                    )}
                    <ConfirmActionForm
                      action={toggleTrajetActive.bind(null, t.id, !t.isActive)}
                      triggerLabel={t.isActive ? "Masquer" : "Activer"}
                      triggerClassName="rounded-md bg-white/10 px-2 py-1 text-foreground text-xs hover:bg-white/20"
                      title={
                        t.isActive
                          ? "Masquer ce trajet ?"
                          : "Réactiver ce trajet ?"
                      }
                      description={
                        <>
                          Trajet{" "}
                          <span className="font-semibold text-foreground">
                            {t.villeDepart} → {t.villeArrivee}
                          </span>{" "}
                          du {t.date.toLocaleDateString("fr-FR")}.{" "}
                          {t.isActive
                            ? "Il ne sera plus visible publiquement, mais reste en base et pourra être réactivé."
                            : "Il redeviendra visible publiquement (s'il est validé)."}
                        </>
                      }
                      confirmLabel={
                        t.isActive ? "Masquer le trajet" : "Réactiver le trajet"
                      }
                      variant={t.isActive ? "warning" : "default"}
                    />
                    <ConfirmActionForm
                      action={deleteTrajet.bind(null, t.id)}
                      triggerLabel="Supprimer"
                      triggerClassName="rounded-md px-2 py-1 text-red-600 text-xs hover:bg-red-500/10 hover:text-red-600"
                      title="Supprimer ce trajet ?"
                      description={
                        <>
                          Trajet{" "}
                          <span className="font-semibold text-foreground">
                            {t.villeDepart} → {t.villeArrivee}
                          </span>{" "}
                          du {t.date.toLocaleDateString("fr-FR")}. Action
                          irréversible.
                        </>
                      }
                      confirmLabel="Supprimer le trajet"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {trajets.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
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
