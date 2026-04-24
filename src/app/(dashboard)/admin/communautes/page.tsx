import { prisma } from "@/lib/db/prisma";
import {
  createCommunityAction,
  deleteCommunity,
  toggleCommunityActive,
  toggleCommunityFeatured,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminCommunautesPage() {
  const [communities, approvedModerators] = await Promise.all([
    prisma.whatsAppCommunity.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: {
        moderator: { include: { user: { select: { name: true, email: true } } } },
      },
    }),
    prisma.moderator.findMany({
      where: { status: "APPROVED" },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { region: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Communautés WhatsApp ({communities.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Crée et gère les communautés régionales avec leur lien d'invitation et
          leur modérateur.
        </p>
      </div>

      {/* CREATE FORM */}
      <form
        action={createCommunityAction}
        className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h3 className="font-heading text-lg text-foreground">
          Créer une communauté
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            placeholder="Nom (ex: Mboka Hub Paris)"
            required
            className="rounded-md border border-white/10 bg-background px-3 py-2 text-foreground text-sm"
          />
          <input
            name="region"
            placeholder="Région / ville"
            required
            className="rounded-md border border-white/10 bg-background px-3 py-2 text-foreground text-sm"
          />
          <select
            name="country"
            defaultValue="France"
            className="rounded-md border border-white/10 bg-background px-3 py-2 text-foreground text-sm"
          >
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Pays-Bas">Pays-Bas</option>
            <option value="Allemagne">Allemagne</option>
            <option value="Royaume-Uni">Royaume-Uni</option>
          </select>
          <input
            name="inviteLink"
            placeholder="https://chat.whatsapp.com/…"
            required
            className="rounded-md border border-white/10 bg-background px-3 py-2 text-foreground text-sm"
          />
          <select
            name="moderatorId"
            defaultValue=""
            className="rounded-md border border-white/10 bg-background px-3 py-2 text-foreground text-sm sm:col-span-2"
          >
            <option value="">— Pas de modérateur assigné —</option>
            {approvedModerators.map((m) => (
              <option key={m.id} value={m.id}>
                {m.user.name ?? m.user.email} · {m.region}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description (optionnel)"
            rows={2}
            className="rounded-md border border-white/10 bg-background px-3 py-2 text-foreground text-sm sm:col-span-2"
          />
          <textarea
            name="rules"
            placeholder="Règles spécifiques (optionnel)"
            rows={3}
            className="rounded-md border border-white/10 bg-background px-3 py-2 text-foreground text-sm sm:col-span-2"
          />
          <label className="flex items-center gap-2 text-foreground text-sm sm:col-span-2">
            <input
              type="checkbox"
              name="isFeatured"
              className="size-4 rounded border-white/20 bg-background"
            />
            Marquer comme communauté officielle (mise en avant)
          </label>
        </div>
        <button
          type="submit"
          className="rounded-md bg-red-500 px-4 py-2 text-white text-sm hover:bg-red-600"
        >
          Créer
        </button>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Région</th>
              <th className="px-4 py-3">Pays</th>
              <th className="px-4 py-3">Modérateur</th>
              <th className="px-4 py-3">Lien</th>
              <th className="px-4 py-3">État</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {communities.map((c) => (
              <tr key={c.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-foreground">
                  {c.name}
                  {c.isFeatured && (
                    <span className="ml-2 rounded-full bg-yellow-500/20 px-2 py-0.5 text-yellow-300 text-[10px]">
                      ★ Officielle
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.region}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.country}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {c.moderator?.user.name ?? c.moderator?.user.email ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  <a
                    href={c.inviteLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    Ouvrir
                  </a>
                </td>
                <td className="px-4 py-3">
                  {c.isActive ? (
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-300 text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2 py-1 text-muted-foreground text-xs">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <form action={toggleCommunityActive.bind(null, c.id, !c.isActive)}>
                      <button
                        type="submit"
                        className="rounded-md bg-white/10 px-2 py-1 text-foreground text-xs hover:bg-white/20"
                      >
                        {c.isActive ? "Désactiver" : "Activer"}
                      </button>
                    </form>
                    <form action={toggleCommunityFeatured.bind(null, c.id, !c.isFeatured)}>
                      <button
                        type="submit"
                        className="rounded-md bg-yellow-500/20 px-2 py-1 text-yellow-300 text-xs hover:bg-yellow-500/30"
                      >
                        {c.isFeatured ? "★ Retirer" : "☆ Mettre en avant"}
                      </button>
                    </form>
                    <form action={deleteCommunity.bind(null, c.id)}>
                      <button
                        type="submit"
                        className="text-red-400 text-xs hover:text-red-300"
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {communities.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  Aucune communauté pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
