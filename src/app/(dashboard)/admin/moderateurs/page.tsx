import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { prisma } from "@/lib/db/prisma";
import {
  approveModerator,
  suspendModerator,
  deleteModerator,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  PENDING: {
    text: "En attente",
    cls: "bg-yellow-500/20 text-yellow-300",
  },
  APPROVED: {
    text: "Approuvé",
    cls: "bg-green-500/20 text-green-300",
  },
  SUSPENDED: {
    text: "Suspendu",
    cls: "bg-red-500/20 text-red-300",
  },
};

export default async function AdminModerateursPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where =
    status === "pending"
      ? { status: "PENDING" as const }
      : status === "approved"
        ? { status: "APPROVED" as const }
        : status === "suspended"
          ? { status: "SUSPENDED" as const }
          : {};

  const moderators = await prisma.moderator.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      user: { select: { email: true, name: true } },
      community: { select: { id: true, name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Modérateurs ({moderators.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Approuver ou suspendre les modérateurs des communautés WhatsApp.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/admin/moderateurs"
            className="rounded-full border border-white/20 px-3 py-1 text-foreground text-xs hover:bg-white/10"
          >
            Tous
          </a>
          <a
            href="/admin/moderateurs?status=pending"
            className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-yellow-300 text-xs hover:bg-yellow-500/20"
          >
            En attente
          </a>
          <a
            href="/admin/moderateurs?status=approved"
            className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-green-300 text-xs hover:bg-green-500/20"
          >
            Approuvés
          </a>
          <a
            href="/admin/moderateurs?status=suspended"
            className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-300 text-xs hover:bg-red-500/20"
          >
            Suspendus
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Modérateur</th>
              <th className="px-4 py-3">Région</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Communauté</th>
              <th className="px-4 py-3">Motivation</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {moderators.map((m) => {
              const badge = STATUS_LABEL[m.status];
              return (
                <tr key={m.id} className="align-top hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="font-foreground">
                      {m.user.name ?? "—"}
                    </div>
                    <div className="font-mono text-muted-foreground text-xs">
                      {m.user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {m.region}
                    <div className="text-muted-foreground text-xs">
                      {m.country}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground text-xs">
                    {m.whatsappLink ? (
                      <a
                        href={m.whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline"
                      >
                        Lien
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {m.community ? m.community.name : "—"}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-muted-foreground text-xs">
                    {m.motivation ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${badge.cls}`}
                    >
                      {badge.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {m.status !== "APPROVED" && (
                        <form action={approveModerator.bind(null, m.id)}>
                          <button
                            type="submit"
                            className="rounded-md bg-green-500/20 px-2 py-1 text-green-300 text-xs hover:bg-green-500/30"
                          >
                            Approuver
                          </button>
                        </form>
                      )}
                      {m.status !== "SUSPENDED" && (
                        <ConfirmActionForm
                          action={suspendModerator.bind(null, m.id)}
                          triggerLabel="Suspendre"
                          triggerClassName="rounded-md bg-yellow-500/20 px-2 py-1 text-yellow-300 text-xs hover:bg-yellow-500/30"
                          title="Suspendre ce modérateur ?"
                          description="Le modérateur perdra immédiatement son accès. Tu pourras le réactiver plus tard."
                          confirmLabel="Suspendre"
                          variant="warning"
                        />
                      )}
                      <ConfirmActionForm
                        action={deleteModerator.bind(null, m.id)}
                        triggerLabel="Supprimer"
                        triggerClassName="text-red-400 text-xs hover:text-red-300"
                        title="Supprimer ce modérateur ?"
                        description="Suppression définitive du rôle de modérateur. Le compte utilisateur reste."
                        confirmLabel="Supprimer"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {moderators.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  Aucun modérateur pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
