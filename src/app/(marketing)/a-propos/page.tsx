import { SectionHeading } from "@/components/marketing/section-heading";
import { LEGAL_DISCLAIMER } from "@/lib/constants";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        number="INFO"
        description="Mboka Hub est né d'un besoin simple : aider une diaspora mobile à se coordonner autour d'un grand week-end culturel, sans mélanger mise en relation, billetterie et paiements entre particuliers."
        eyebrow="Mission"
        title="Une plateforme utile, indépendante et cadrée"
      />
      <div className="mt-10 grid gap-6 text-muted-foreground text-lg leading-8">
        <p>
          Le produit met en avant les services pratiques dont les fans ont
          besoin : trajets, pros beauté, afters externes, merch et bons plans
          parisiens. Le modèle économique repose sur des accès et options vendus
          par Mboka Hub.
        </p>
        <p>
          Les contacts sensibles sont protégés par floutage, les profils pros
          sont vérifiés progressivement, et les données personnelles restent
          limitées au strict nécessaire pour le service.
        </p>
        <p className="border border-white/10 bg-card p-5 text-foreground">
          {LEGAL_DISCLAIMER}
        </p>
      </div>
    </main>
  );
}
