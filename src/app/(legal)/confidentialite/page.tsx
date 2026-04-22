import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Données personnelles, emails, cookies et droits RGPD.",
};

const sections = [
  {
    title: "Données collectées",
    body: "Nous collectons les informations nécessaires au fonctionnement du service : compte utilisateur, email, ville, pays, annonces publiées, contacts débloqués, paiements effectués auprès de Mboka Hub et statistiques de consultation.",
  },
  {
    title: "Emails et double opt-in",
    body: "Les inscriptions newsletter ou campagnes email devront être confirmées par double opt-in. Les emails transactionnels liés au compte, au paiement ou à la sécurité peuvent être envoyés sans inscription newsletter.",
  },
  {
    title: "Paiements",
    body: "Les paiements sont traités par Stripe Checkout. Mboka Hub ne stocke pas les numéros de carte bancaire. Les identifiants Stripe nécessaires au suivi des achats peuvent être conservés.",
  },
  {
    title: "Cookies et analytics",
    body: "L'analytics doit rester limité à une solution RGPD-friendly. Aucun tracking publicitaire tiers n'est prévu pour le MVP.",
  },
  {
    title: "Droits RGPD",
    body: "Chaque utilisateur pourra demander l'accès, la rectification ou la suppression de ses données. Un bouton de suppression de compte sera disponible dans les paramètres.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-primary text-sm uppercase">RGPD</p>
      <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl">
        Politique de confidentialité
      </h1>
      <div className="mt-10 grid gap-5">
        {sections.map((section) => (
          <section
            className="border border-white/10 bg-card p-5"
            key={section.title}
          >
            <h2 className="font-heading text-2xl text-foreground">
              {section.title}
            </h2>
            <p className="mt-3 text-muted-foreground leading-7">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
