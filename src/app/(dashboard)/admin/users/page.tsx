import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { PhotoReminderButton } from "@/components/admin/photo-reminder-button";
import { prisma } from "@/lib/db/prisma";
import {
  deleteUser,
  setUserRole,
  toggleFoundingFamily,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { proProfile: true, _count: { select: { trajets: true, payments: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl text-foreground">
            Utilisateurs ({users.length})
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Gérer les rôles, le badge Famille Fondatrice et les suppressions.
          </p>
        </div>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Rechercher email ou nom"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:border-red-500/40 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            Rechercher
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Fondateur</th>
              <th className="px-4 py-3">Pro</th>
              <th className="px-4 py-3">Trajets</th>
              <th className="px-4 py-3">Paiements</th>
              <th className="px-4 py-3">Inscrit</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-foreground text-xs">
                  {u.email}
                </td>
                <td className="px-4 py-3 text-foreground">{u.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <form
                    action={async (fd) => {
                      "use server";
                      await setUserRole(u.id, fd.get("role") as "FAN" | "PRO" | "ADMIN");
                    }}
                    className="flex items-center gap-1"
                  >
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-foreground text-xs"
                    >
                      <option value="FAN">FAN</option>
                      <option value="PRO">PRO</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-md bg-white/10 px-2 py-1 text-foreground text-xs hover:bg-white/20"
                    >
                      OK
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={toggleFoundingFamily.bind(null, u.id, !u.isVipActive)}>
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs ${
                        u.isVipActive
                          ? "bg-yellow-500/20 text-yellow-700"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      }`}
                      title="Badge ⭐ Famille Fondatrice (à vie, anciens VIP)"
                    >
                      {u.isVipActive ? "⭐ Fondateur" : "Accorder badge"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {u.proProfile ? (
                    <div className="flex items-center gap-2">
                      <span>{u.proProfile.category}</span>
                      {u.proProfile.photos.length === 0 ? (
                        <PhotoReminderButton proId={u.proProfile.id} />
                      ) : (
                        <span
                          className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-700"
                          title={`${u.proProfile.photos.length} photo(s)`}
                        >
                          📸 {u.proProfile.photos.length}
                        </span>
                      )}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u._count.trajets}</td>
                <td className="px-4 py-3 text-muted-foreground">{u._count.payments}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {u.createdAt.toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <ConfirmActionForm
                    action={deleteUser.bind(null, u.id)}
                    triggerLabel="Supprimer"
                    triggerClassName="text-red-600 text-xs hover:text-red-600"
                    title="Supprimer cet utilisateur ?"
                    description={
                      <>
                        Tu vas supprimer définitivement{" "}
                        <span className="font-semibold text-foreground">
                          {u.email}
                        </span>
                        . Toutes ses données associées (trajets, paiements, profil pro)
                        seront perdues. Cette action est irréversible.
                      </>
                    }
                    confirmLabel="Supprimer définitivement"
                  />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
