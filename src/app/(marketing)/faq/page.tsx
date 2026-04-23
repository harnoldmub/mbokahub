import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";

const FAQ_SECTIONS = [
  {
    title: "Trajets & covoiturage",
    items: [
      {
        q: "Comment réserver un trajet ?",
        a: "Trouve un trajet sur la page /trajets, clique sur l'annonce, puis contacte le conducteur directement via WhatsApp. Le paiement se fait entre vous, en main propre ou par virement.",
      },
      {
        q: "Mboka Hub prend-il une commission ?",
        a: "Non. La plateforme est gratuite pour les passagers et les conducteurs. On se finance uniquement via la pub et les partenariats marques.",
      },
      {
        q: "Comment publier mon trajet ?",
        a: "Crée un compte, va sur /trajets/publier, remplis le formulaire (ville, date, places, prix). Ton annonce passe en validation manuelle sous 24h.",
      },
      {
        q: "Que faire si le conducteur ne répond pas ?",
        a: "Signale l'annonce avec le bouton 🚨 sur la fiche. Notre équipe vérifie sous 24h et désactive le profil si besoin.",
      },
    ],
  },
  {
    title: "Pros (beauté, photo, after)",
    items: [
      {
        q: "Comment devenir pro vérifié ?",
        a: "Va sur /pro/inscrire, choisis ta catégorie, remplis ton profil. La vérification manuelle prend 24-48h. Une fois validé, tu apparais sur les pages publiques.",
      },
      {
        q: "Combien ça coûte ?",
        a: "L'inscription est gratuite. Tu peux booster ton profil avec un format Pro Feature (à partir de 200€/semaine — voir /ads).",
      },
      {
        q: "Comment recevoir des paiements ?",
        a: "Mboka Hub ne gère pas les paiements pros. Les clients te contactent en direct via WhatsApp et règlent selon tes conditions habituelles.",
      },
    ],
  },
  {
    title: "Sécurité & signalement",
    items: [
      {
        q: "Comment signaler une arnaque ?",
        a: "Chaque annonce a un bouton 🚨 Signaler. Décris le problème, notre équipe traite sous 24h et peut suspendre l'annonceur.",
      },
      {
        q: "Mes données sont-elles protégées ?",
        a: "Oui. RGPD respecté. On stocke uniquement ce qui est nécessaire (email, nom, annonces). Tu peux demander la suppression de ton compte à tout moment via /contact.",
      },
      {
        q: "Le site utilise-t-il des cookies ?",
        a: "Uniquement des cookies essentiels par défaut. Tu choisis si tu acceptes les cookies analytics et marketing via la bannière.",
      },
    ],
  },
  {
    title: "À propos du concert",
    items: [
      {
        q: "Quand a lieu le concert de Fally au Stade de France ?",
        a: "Le 28 mai 2026. Ouverture des portes à 18h, début du concert à 20h.",
      },
      {
        q: "Mboka Hub vend-il des billets ?",
        a: "Non. Mboka Hub est une plateforme communautaire indépendante. Les billets s'achètent uniquement chez les revendeurs officiels.",
      },
      {
        q: "Êtes-vous affiliés à Fally Ipupa ?",
        a: "Non. Mboka Hub est un site indépendant non-officiel, créé par et pour la diaspora congolaise.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-5vw] top-[15vh] font-display text-[28vw] text-blood opacity-[0.03] select-none leading-none uppercase">
          FAQ
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 space-y-16">
        <SectionHeading
          number="04"
          eyebrow="FAQ"
          title="Vos *questions*, nos réponses."
          description="Tout ce qu'il faut savoir avant de réserver un trajet, publier une annonce ou contacter un pro."
        />

        <div className="space-y-12">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="font-display text-2xl uppercase text-paper border-l-4 border-blood pl-4">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-white/5 bg-coal p-6 transition-colors hover:border-blood/30"
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                      <span className="flex items-start gap-3">
                        <HelpCircle className="mt-0.5 size-5 shrink-0 text-blood" />
                        <span className="font-display text-base text-paper">{item.q}</span>
                      </span>
                      <span className="font-mono text-xs text-paper-mute group-open:rotate-180 transition-transform">
                        ▾
                      </span>
                    </summary>
                    <p className="mt-4 pl-8 text-sm text-paper-dim leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-blood/30 bg-blood/5 p-10 text-center">
          <h2 className="font-display text-2xl uppercase text-paper sm:text-3xl">
            Pas trouvé ta réponse ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-paper-dim">
            On répond en moins de 24h sur tous les messages.
          </p>
          <Button asChild size="lg" className="mt-6 shadow-glow-blood">
            <Link href="/contact">
              Nous contacter <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
