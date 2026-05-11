import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales de Mboka Hub.",
};

export default function LegalNoticePage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-primary text-sm uppercase">Legal</p>
      <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl">
        Mentions légales
      </h1>
      <div className="mt-10 grid gap-5">
        <section className="border border-white/10 bg-card p-5">
          <h2 className="font-heading text-2xl text-foreground">Editeur</h2>
          <p className="mt-3 text-muted-foreground leading-7">
            Mboka Hub. Informations société à compléter avant publication
            production.
          </p>
        </section>
        <section className="border border-white/10 bg-card p-5">
          <h2 className="font-heading text-2xl text-foreground">Hébergement</h2>
          <p className="mt-3 text-muted-foreground leading-7">
            Application hébergée sur Replit. Base de données hébergée sur Neon
            Postgres.
          </p>
        </section>
        <section className="border border-white/10 bg-card p-5">
          <h2 className="font-heading text-2xl text-foreground">Contact</h2>
          <p className="mt-3 text-muted-foreground leading-7">
            Adresse email de contact à compléter avant mise en ligne publique.
          </p>
        </section>
      </div>
    </article>
  );
}
