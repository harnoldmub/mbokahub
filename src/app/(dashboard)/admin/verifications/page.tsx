import Link from "next/link";

import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { reviewVerificationRequestAction } from "@/lib/actions/verification";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const FILTER_CLASS =
  "inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm transition";

export default async function AdminVerificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const normalizedStatus =
    status === "APPROVED" || status === "REJECTED" ? status : "PENDING";
  const requests = await prisma.verificationRequest.findMany({
    where: { status: normalizedStatus },
    include: {
      user: { select: { email: true, name: true, accountVerified: true } },
      proProfile: {
        select: { displayName: true, category: true, isCertified: true },
      },
    },
    orderBy: { requestedAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Confiance et sécurité
        </p>
        <h2 className="mt-2 font-heading text-3xl text-foreground">
          Demandes de vérification
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Vérifie l&apos;identité et les éléments professionnels hors
          plateforme, puis approuve ou refuse la demande. Aucun justificatif
          sensible n’est stocké dans cette interface.
        </p>
        <nav
          className="mt-5 flex flex-wrap gap-2"
          aria-label="Filtrer les demandes"
        >
          {[
            ["PENDING", "En attente"],
            ["APPROVED", "Approuvées"],
            ["REJECTED", "Refusées"],
          ].map(([value, label]) => (
            <Link
              key={value}
              href={`/admin/verifications?status=${value}`}
              className={`${FILTER_CLASS} ${normalizedStatus === value ? "border-white bg-white text-black" : "border-white/15 text-foreground hover:bg-white/10"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="grid gap-4">
        {requests.map((request) => {
          const subject =
            request.type === "ACCOUNT"
              ? request.user.name || request.user.email
              : request.proProfile?.displayName || request.user.email;
          return (
            <article
              key={request.id}
              className="rounded-2xl border border-white/10 bg-coal p-5"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                    {request.type === "ACCOUNT" ? "Compte" : "Professionnel"}
                  </span>
                  <h3 className="mt-3 font-heading text-2xl text-paper">
                    {subject}
                  </h3>
                  <p className="mt-1 text-paper-dim text-sm">
                    {request.user.email}
                    {request.proProfile
                      ? ` · ${request.proProfile.category}`
                      : ""}
                  </p>
                  <p className="mt-2 text-paper-mute text-xs">
                    Demande du {request.requestedAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {request.status === "PENDING" ? (
                  <div className="flex flex-wrap gap-2">
                    <ConfirmActionForm
                      action={reviewVerificationRequestAction.bind(
                        null,
                        request.id,
                        "APPROVED",
                      )}
                      triggerLabel="Approuver"
                      triggerClassName="inline-flex min-h-11 items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                      title="Approuver cette vérification ?"
                      description={`${subject} recevra le statut vérifié correspondant.`}
                      confirmLabel="Approuver"
                      variant="default"
                    />
                    <ConfirmActionForm
                      action={reviewVerificationRequestAction.bind(
                        null,
                        request.id,
                        "REJECTED",
                      )}
                      triggerLabel="Refuser"
                      triggerClassName="inline-flex min-h-11 items-center rounded-full border border-red-500/40 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10"
                      title="Refuser cette vérification ?"
                      description="La personne pourra déposer une nouvelle demande après correction."
                      confirmLabel="Refuser"
                      variant="danger"
                    />
                  </div>
                ) : (
                  <span className="rounded-full border border-white/15 px-3 py-2 text-paper-dim text-sm">
                    {request.status === "APPROVED" ? "Approuvée" : "Refusée"}
                  </span>
                )}
              </div>
            </article>
          );
        })}

        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-paper-dim">
            Aucune demande dans cette catégorie.
          </div>
        ) : null}
      </div>
    </div>
  );
}
