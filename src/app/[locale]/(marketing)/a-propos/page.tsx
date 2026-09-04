import type { Metadata } from "next";
import { SectionHeading } from "@/components/marketing/section-heading";
import { LEGAL_DISCLAIMER } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "À propos — Notre mission pour la diaspora",
    description:
      "Nevent aide la diaspora à se coordonner autour des grands événements culturels : découverte, trajets, services et communauté.",
    path: "/a-propos",
    locale,
  });
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        number="INFO"
        description="Nevent est né d'un besoin simple : aider une diaspora mobile à se coordonner autour des événements qu'elle suit, sans mélanger mise en relation, billetterie et paiements entre particuliers."
        eyebrow="Mission"
        title="Une plateforme utile, indépendante et cadrée"
      />
      <div className="mt-10 grid gap-6 text-muted-foreground text-lg leading-8">
        <p>
          Le produit met en avant les services pratiques dont les fans ont
          besoin : trajets, prestataires, afters et guides pratiques par ville.
          Pendant la phase de lancement, Nevent est gratuit pour tout le monde,
          visiteurs comme prestataires. Toute évolution du modèle sera annoncée
          à l&apos;avance.
        </p>
        <p>
          Les prestataires sont vérifiés manuellement avant publication, les
          échanges passent par la messagerie interne, et les données
          personnelles restent limitées au strict nécessaire pour le service.
        </p>
        <p className="border border-white/10 bg-card p-5 text-foreground">
          {LEGAL_DISCLAIMER}
        </p>
      </div>
    </main>
  );
}
