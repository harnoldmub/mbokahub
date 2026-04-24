import { ShieldCheck } from "lucide-react";

import { applyAsModeratorAction } from "@/lib/actions/public";

export const metadata = {
  title: "Devenir modérateur · Mboka Hub",
  description:
    "Postule pour devenir modérateur de la communauté WhatsApp Mboka Hub de ta région.",
};

const RULES = [
  "Maintenir une ambiance respectueuse et bienveillante.",
  "Faire respecter la charte : pas d'arnaque, pas de spam, pas de contenu haineux.",
  "Vérifier les annonces partagées (trajets, prestataires, afters) avant validation.",
  "Renvoyer les questions générales vers la plateforme Mboka Hub.",
  "Signaler tout abus à l'équipe via contact@mbokahub.com.",
];

export default async function DevenirModerateurPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-blood/10 via-transparent to-transparent" />

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-32 lg:px-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 text-blood" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            Modérateur·rice de communauté
          </p>
        </div>
        <h1 className="mt-4 font-display text-5xl uppercase tracking-tight text-paper sm:text-6xl">
          Anime ta région.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-paper-dim">
          Tu connais ton quartier, ta ville, ta diaspora ? Deviens
          modérateur·rice de la communauté WhatsApp Mboka Hub de ta région et
          aide à faire vivre l'esprit Stade de France 2026.
        </p>

        {/* Rules */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-coal/60 p-8">
          <h2 className="font-display text-2xl uppercase text-paper">
            La charte
          </h2>
          <ul className="mt-4 space-y-3">
            {RULES.map((r) => (
              <li
                key={r}
                className="flex items-start gap-3 text-sm text-paper-dim"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blood" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {success && (
          <div className="mt-8 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-emerald-200">
            <p className="font-display uppercase">Candidature envoyée 🙌</p>
            <p className="mt-1 text-sm text-emerald-100/80">
              L'équipe Mboka Hub revient vers toi sous 48h. Tu peux compléter
              ton dossier en revenant ici.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-red-200">
            Indique au moins ta région.
          </div>
        )}

        <form
          action={applyAsModeratorAction}
          className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-coal/60 p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                Région / Ville *
              </span>
              <input
                name="region"
                required
                placeholder="Saint-Denis, Bruxelles, Paris 18…"
                className="rounded-2xl border border-white/10 bg-smoke px-4 py-3 text-paper placeholder:text-paper-mute focus:border-blood focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                Pays
              </span>
              <select
                name="country"
                defaultValue="France"
                className="rounded-2xl border border-white/10 bg-smoke px-4 py-3 text-paper focus:border-blood focus:outline-none"
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Pays-Bas">Pays-Bas</option>
                <option value="Allemagne">Allemagne</option>
                <option value="Royaume-Uni">Royaume-Uni</option>
                <option value="Autre">Autre</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
              Lien WhatsApp existant (optionnel)
            </span>
            <input
              name="whatsappLink"
              placeholder="https://chat.whatsapp.com/..."
              className="rounded-2xl border border-white/10 bg-smoke px-4 py-3 text-paper placeholder:text-paper-mute focus:border-blood focus:outline-none"
            />
            <span className="text-xs text-paper-mute">
              Si tu animes déjà un groupe, partage le lien — sinon on en crée un
              avec toi.
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
              Pourquoi toi ?
            </span>
            <textarea
              name="motivation"
              rows={4}
              placeholder="Mon expérience, ma motivation, ma disponibilité…"
              className="rounded-2xl border border-white/10 bg-smoke px-4 py-3 text-paper placeholder:text-paper-mute focus:border-blood focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
              Bio publique (optionnel)
            </span>
            <textarea
              name="bio"
              rows={3}
              placeholder="Pour que la communauté te reconnaisse"
              className="rounded-2xl border border-white/10 bg-smoke px-4 py-3 text-paper placeholder:text-paper-mute focus:border-blood focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blood px-6 py-4 font-mono text-xs uppercase tracking-widest text-paper transition hover:bg-blood/90 sm:w-auto"
          >
            Envoyer ma candidature
          </button>
        </form>
      </section>
    </main>
  );
}
