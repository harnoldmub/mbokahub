import { ShieldAlert, UserRound } from "lucide-react";

import { ScrollToTopOnMount } from "@/components/dashboard/scroll-to-top-on-mount";
import { deleteAccountAction } from "@/lib/actions/account";
import { formatDate, getDashboardUser } from "@/lib/dashboard";

type SettingsPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const [{ error }, user] = await Promise.all([
    searchParams,
    getDashboardUser(),
  ]);

  return (
    <div className="grid gap-8">
      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Paramètres
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">Mon compte</h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Gère tes informations et tes droits RGPD.
        </p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-coal p-6">
        <div className="flex items-center gap-3">
          <UserRound aria-hidden className="size-6 text-blood" />
          <h2 className="font-heading text-2xl text-paper">Informations</h2>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
            <dt className="text-paper-mute text-sm">Nom</dt>
            <dd className="mt-1 text-paper">{user.name ?? "Non renseigné"}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
            <dt className="text-paper-mute text-sm">Email</dt>
            <dd className="mt-1 text-paper">{user.email}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
            <dt className="text-paper-mute text-sm">Compte créé</dt>
            <dd className="mt-1 text-paper">{formatDate(user.createdAt)}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
            <dt className="text-paper-mute text-sm">Statut VIP</dt>
            <dd className="mt-1 text-paper">
              {user.isVipActive ? "Actif" : "Inactif"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-3xl border border-error/30 bg-error/5 p-6">
        <div className="flex items-center gap-3">
          <ShieldAlert aria-hidden className="size-6 text-error" />
          <h2 className="font-heading text-2xl text-paper">
            Suppression du compte
          </h2>
        </div>
        <p className="mt-4 max-w-2xl text-paper-dim leading-7">
          Cette action supprime ton compte Clerk et les données Mboka Hub liées
          à ton utilisateur. Elle est définitive.
        </p>
        {error === "confirmation" ? (
          <p className="mt-4 rounded-2xl border border-error/30 bg-error/10 p-3 text-error">
            <ScrollToTopOnMount />
            Tape exactement SUPPRIMER pour confirmer.
          </p>
        ) : null}
        <form
          action={deleteAccountAction}
          className="mt-6 grid gap-3 sm:max-w-md"
        >
          <label className="text-paper-dim text-sm" htmlFor="confirmation">
            Tape SUPPRIMER
          </label>
          <input
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-paper outline-none focus:border-error"
            id="confirmation"
            name="confirmation"
            placeholder="SUPPRIMER"
          />
          <button
            className="rounded-full border border-error/40 bg-error/10 px-5 py-3 font-display text-error uppercase tracking-normal transition hover:bg-error/20"
            type="submit"
          >
            Supprimer mon compte
          </button>
        </form>
      </section>
    </div>
  );
}
