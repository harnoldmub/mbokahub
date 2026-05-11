import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

const SECTIONS = [
  {
    title: "1. Objet et champ d'application",
    content: `Mboka Hub est une plateforme communautaire indépendante destinée aux fans du concert de Fally Ipupa au Stade de France (2 et 3 mai 2026). Elle met en relation des particuliers et des prestataires pour faciliter l'organisation du séjour concert (covoiturage, prestations beauté, afters, bons plans).

Mboka Hub n'est ni organisateur du concert, ni revendeur officiel de billets, ni affilié à Fally Ipupa, F'Victeam ou au Stade de France.`,
  },
  {
    title: "2. Services proposés",
    content: `La plateforme propose :
— La mise en relation entre conducteurs et passagers pour les trajets vers le concert.
— La mise en avant de prestataires de beauté (maquilleuses, coiffeurs, photographes).
— Un répertoire d'afters et événements annexes au concert.
— Des informations pratiques compilées de sources publiques.
— Des activités communautaires (quiz, jeu).

Mboka Hub agit en qualité d'intermédiaire de mise en relation. Les transactions éventuelles se concluent directement entre les utilisateurs.`,
  },
  {
    title: "3. Inscription et compte utilisateur",
    content: `L'accès aux fonctionnalités complètes nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants. Mboka Hub se réserve le droit de suspendre tout compte en cas de comportement abusif.`,
  },
  {
    title: "4. Responsabilité",
    content: `Les informations publiées sur Mboka Hub (prix, horaires, adresses, règles du stade) sont fournies à titre indicatif, compilées de sources publiques, et peuvent évoluer sans préavis. Mboka Hub décline toute responsabilité en cas d'inexactitude ou de modification postérieure à la publication.

Les annonces de trajet et de prestation relèvent de la responsabilité exclusive de leurs auteurs. Mboka Hub ne garantit pas la fiabilité ou la solvabilité des utilisateurs.`,
  },
  {
    title: "5. Propriété intellectuelle",
    content: `Le contenu éditorial de Mboka Hub (textes, design, code) est protégé par le droit d'auteur. Les photos utilisées sont issues de Wikimedia Commons sous licences CC BY-SA 4.0 et CC BY-SA 2.0 — les crédits photographiques sont disponibles en pied de page et sur la page Disclaimer.

Le nom, l'image et la musique de Fally Ipupa appartiennent à leurs ayants droit respectifs. Leur mention sur ce site relève d'un usage éditorial informatif.`,
  },
  {
    title: "6. Données personnelles",
    content: `Les données collectées (email, préférences) sont utilisées exclusivement pour le fonctionnement de la plateforme. Elles ne sont pas revendues à des tiers. Conformément au RGPD, l'utilisateur dispose d'un droit d'accès, de rectification et de suppression. Contact : via la page /contact.`,
  },
  {
    title: "7. Droit applicable",
    content: `Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence des tribunaux français compétents.`,
  },
  {
    title: "8. Modification des CGV",
    content: `Mboka Hub se réserve le droit de modifier les présentes CGV à tout moment. Les modifications prennent effet dès leur publication sur cette page. L'utilisation continue du service vaut acceptation des nouvelles conditions.`,
  },
] as const;

export default function CgvPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <Link
        href="/"
        className="mb-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute transition-colors hover:text-blood"
      >
        <ChevronLeft className="size-3" />
        Accueil
      </Link>

      <div className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-blood">
          Mboka Hub
        </p>
        <h1 className="mt-3 font-display text-5xl uppercase text-paper leading-tight">
          Conditions Générales
        </h1>
        <p className="mt-2 font-serif italic text-paper-dim">
          Version 1.0 — Avril 2026
        </p>
      </div>

      {/* Non-official notice */}
      <div className="mb-10 rounded-2xl border border-blood/20 bg-blood/5 px-6 py-5">
        <p className="font-mono text-[9px] uppercase tracking-widest text-blood mb-1">
          Site indépendant · Non officiel
        </p>
        <p className="font-body text-sm text-paper-dim leading-relaxed">
          Mboka Hub n&apos;est pas affilié à Fally Ipupa, F&apos;Victeam, au Stade de France
          ou à tout organisateur officiel. Ce site est créé par des fans pour les fans.
        </p>
      </div>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <div key={section.title} className="border-t border-white/5 pt-8">
            <h2 className="mb-4 font-display text-xl uppercase text-paper">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.content.split("\n\n").map((para, i) => (
                <p key={i} className="font-body text-sm leading-relaxed text-paper-dim whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 border-t border-white/5 pt-8">
        <p className="font-mono text-[9px] uppercase tracking-widest text-paper-mute">
          Contact légal :{" "}
          <Link href="/contact" className="text-blood hover:underline underline-offset-4">
            via le formulaire de contact
          </Link>
        </p>
      </div>
    </main>
  );
}
