import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Règles d'utilisation de la marketplace Mboka Hub.",
};

const rules = [
  "Mboka Hub est une plateforme de mise en relation indépendante.",
  "Les utilisateurs restent responsables des informations publiées et des échanges après mise en contact.",
  "Aucune revente de billets n'est autorisée sur la plateforme.",
  "Les afters listés doivent renvoyer vers une billetterie externe ou une page officielle de l'organisateur.",
  "Aucun paiement entre utilisateurs n'est traité par Mboka Hub.",
  "Les profils pros peuvent être modérés, refusés ou désactivés en cas d'information trompeuse.",
  "Les contenus utilisant des visuels non autorisés ou une affiliation officielle trompeuse peuvent être supprimés.",
] as const;

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-primary text-sm uppercase">CGU</p>
      <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl">
        Conditions générales d'utilisation
      </h1>
      <ul className="mt-10 grid gap-4">
        {rules.map((rule) => (
          <li
            className="border border-white/10 bg-card p-5 text-muted-foreground leading-7"
            key={rule}
          >
            {rule}
          </li>
        ))}
      </ul>
    </article>
  );
}
