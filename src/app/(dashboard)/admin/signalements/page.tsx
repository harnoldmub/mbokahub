import Link from "next/link";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { prisma } from "@/lib/db/prisma";
import {
  updateReportStatus,
  deleteReport,
  deleteReportedTarget,
} from "@/lib/actions/admin";
import type { ReportTargetType } from "@prisma/client";

export const dynamic = "force-dynamic";

const REASON_LABEL: Record<string, string> = {
  ARNAQUE: "🚨 Arnaque",
  FAUX_PROFIL: "🎭 Faux profil",
  SPAM: "📧 Spam",
  CONTENU_INAPPROPRIE: "🚫 Inapproprié",
  PRIX_ABUSIF: "💸 Prix abusif",
  CONTACT_NON_REPONSE: "📵 Pas de réponse",
  AUTRE: "❓ Autre",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300",
  REVIEWING: "bg-blue-500/20 text-blue-300",
  RESOLVED: "bg-green-500/20 text-green-300",
  DISMISSED: "bg-white/10 text-muted-foreground",
};

async function fetchTargetSummary(type: ReportTargetType, id: string) {
  switch (type) {
    case "TRAJET": {
      const t = await prisma.trajet.findUnique({
        where: { id },
        include: { user: { select: { email: true, name: true } } },
      });
      return t
        ? `${t.villeDepart} → ${t.villeArrivee} · ${t.user.email}`
        : "Trajet supprimé";
    }
    case "PRO_PROFILE": {
      const p = await prisma.proProfile.findUnique({
        where: { id },
        include: { user: { select: { email: true } } },
      });
      return p ? `${p.displayName} (${p.category}) · ${p.user.email}` : "Pro supprimé";
    }
    case "AFTER": {
      const a = await prisma.after.findUnique({ where: { id } });
      return a ? `After: ${a.name}` : "After supprimé";
    }
    case "USER": {
      const u = await prisma.user.findUnique({ where: { id } });
      return u ? `${u.email}` : "Utilisateur supprimé";
    }
    case "MERCH_PRODUCT": {
      const m = await prisma.merchProduct.findUnique({ where: { id } });
      return m ? `${m.title} · ${m.vendorName}` : "Produit supprimé";
    }
  }
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; reason?: string }>;
}) {
  const { status, reason } = await searchParams;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (reason) where.reason = reason;

  const reports = await prisma.report.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  const summaries = await Promise.all(
    reports.map((r) => fetchTargetSummary(r.targetType, r.targetId)),
  );

  const counts = {
    pending: await prisma.report.count({ where: { status: "PENDING" } }),
    reviewing: await prisma.report.count({ where: { status: "REVIEWING" } }),
    arnaque: await prisma.report.count({ where: { reason: "ARNAQUE" } }),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Signalements ({reports.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Centre de modération — arnaques, faux profils, contenus signalés par la communauté.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:max-w-2xl">
          <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-3">
            <p className="font-mono text-xs text-yellow-300/80 uppercase">À traiter</p>
            <p className="mt-1 font-heading text-2xl text-yellow-300">{counts.pending}</p>
          </div>
          <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-3">
            <p className="font-mono text-xs text-blue-300/80 uppercase">En cours</p>
            <p className="mt-1 font-heading text-2xl text-blue-300">{counts.reviewing}</p>
          </div>
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3">
            <p className="font-mono text-xs text-red-300/80 uppercase">🚨 Arnaques</p>
            <p className="mt-1 font-heading text-2xl text-red-300">{counts.arnaque}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/signalements" className="rounded-full border border-white/20 px-3 py-1 text-foreground text-xs hover:bg-white/10">Tous</Link>
          <Link href="/admin/signalements?status=PENDING" className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-yellow-300 text-xs">À traiter</Link>
          <Link href="/admin/signalements?status=REVIEWING" className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-blue-300 text-xs">En cours</Link>
          <Link href="/admin/signalements?status=RESOLVED" className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-green-300 text-xs">Résolus</Link>
          <Link href="/admin/signalements?reason=ARNAQUE" className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-300 text-xs">🚨 Arnaques uniquement</Link>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((r, i) => (
          <article
            key={r.id}
            className={`rounded-2xl border p-5 ${
              r.reason === "ARNAQUE" && r.status === "PENDING"
                ? "border-red-500/50 bg-red-500/5"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{REASON_LABEL[r.reason]}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  <span className="font-mono text-muted-foreground text-xs">{r.targetType}</span>
                </div>
                <p className="mt-2 text-foreground text-sm">
                  Cible : <span className="font-mono">{summaries[i]}</span>
                </p>
                {r.description && (
                  <p className="mt-2 whitespace-pre-wrap rounded-md bg-black/40 p-3 text-muted-foreground text-sm">
                    {r.description}
                  </p>
                )}
                <p className="mt-2 text-muted-foreground text-xs">
                  Signalé par : <span className="font-mono">{r.reporterEmail ?? "anonyme"}</span> · {r.createdAt.toLocaleString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <form action={updateReportStatus.bind(null, r.id, "REVIEWING", undefined)}>
                <button type="submit" className="rounded-md bg-blue-500/20 px-3 py-1 text-blue-300 text-xs hover:bg-blue-500/30">
                  Prendre en charge
                </button>
              </form>
              <ConfirmActionForm
                action={updateReportStatus.bind(null, r.id, "RESOLVED", undefined)}
                triggerLabel="Marquer résolu"
                triggerClassName="rounded-md bg-green-500/20 px-3 py-1 text-green-300 text-xs hover:bg-green-500/30"
                title="Marquer ce signalement comme résolu ?"
                description="Le signalement sera classé comme résolu. Tu pourras toujours consulter l'historique."
                confirmLabel="Marquer résolu"
                variant="default"
              />
              <ConfirmActionForm
                action={updateReportStatus.bind(null, r.id, "DISMISSED", undefined)}
                triggerLabel="Rejeter"
                triggerClassName="rounded-md bg-white/10 px-3 py-1 text-muted-foreground text-xs hover:bg-white/20"
                title="Rejeter ce signalement ?"
                description="Le signalement sera marqué comme rejeté (non fondé). La cible n'est pas affectée."
                confirmLabel="Rejeter"
                variant="warning"
              />
              <ConfirmActionForm
                action={deleteReportedTarget.bind(null, r.id, r.targetType, r.targetId)}
                triggerLabel="🗑 Supprimer la cible + résoudre"
                triggerClassName="rounded-md bg-red-500/20 px-3 py-1 text-red-300 text-xs hover:bg-red-500/30"
                title="Supprimer la cible signalée ?"
                description={
                  <>
                    Le contenu signalé ({r.targetType}) sera supprimé définitivement
                    et le signalement marqué résolu. Action irréversible.
                  </>
                }
                confirmLabel="Supprimer la cible"
              />
              <div className="ml-auto">
                <ConfirmActionForm
                  action={deleteReport.bind(null, r.id)}
                  triggerLabel="Supprimer ce signalement"
                  triggerClassName="text-muted-foreground text-xs hover:text-red-300"
                  title="Supprimer ce signalement ?"
                  description="Le signalement disparaît de la liste. La cible n'est pas affectée."
                  confirmLabel="Supprimer le signalement"
                />
              </div>
            </div>
          </article>
        ))}

        {reports.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-muted-foreground">
            Aucun signalement {status ? `(${status})` : ""}{reason ? ` ${reason}` : ""} pour le moment. 🎉
          </div>
        )}
      </div>
    </div>
  );
}
