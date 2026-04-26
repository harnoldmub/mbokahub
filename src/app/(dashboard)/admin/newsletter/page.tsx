import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { prisma } from "@/lib/db/prisma";
import { deleteNewsletterSubscriber } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subs = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl text-foreground">
            Newsletter ({subs.length})
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Liste des abonnés à la newsletter Mboka Hub.
          </p>
        </div>
        <a
          href={`mailto:?bcc=${subs.map((s) => s.email).join(",")}`}
          className="rounded-full bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
        >
          Email à tous (BCC)
        </a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Confirmé</th>
              <th className="px-4 py-3">Inscrit</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {subs.map((s) => (
              <tr key={s.id} className="hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-foreground text-xs">{s.email}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{s.source ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {s.confirmed ? "✓" : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {s.createdAt.toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <ConfirmActionForm
                    action={deleteNewsletterSubscriber.bind(null, s.id)}
                    triggerLabel="Supprimer"
                    triggerClassName="text-red-400 text-xs hover:text-red-300"
                    title="Désinscrire cet abonné ?"
                    description={
                      <>
                        L&apos;email{" "}
                        <span className="font-semibold text-foreground">{s.email}</span>{" "}
                        sera retiré de la newsletter.
                      </>
                    }
                    confirmLabel="Supprimer"
                  />
                </td>
              </tr>
            ))}
            {subs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  Aucun abonné pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
