import { BadgeEuro, Sparkles, Users } from "lucide-react";

export const PRICE_VIP_EUR = 0;
export const PRICE_PRO_EUR = 19.99;
export const PRICE_BOOST_EUR = 8.99;

const euroFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEuro(amount: number): string {
  return `${euroFormatter.format(amount)} €`;
}

export function formatEuroAmount(amount: number): string {
  return euroFormatter.format(amount);
}

export const proOffer = {
  title: "Fiche pro gratuite",
  price: "0 EUR",
  description:
    "Inscription, réservations et mise en avant gratuites pour tous les prestataires pendant la phase de lancement.",
  audiences: [
    {
      label: "Beauté",
      detail:
        "maquilleuses, esthéticiennes, ongles, cils, coiffeurs, barbers, photographes, vidéastes",
    },
    {
      label: "Merch & mode",
      detail: "vendeurs mode, accessoires, pagne, bijoux, couture",
    },
    {
      label: "Afters & soirées",
      detail: "organisateurs, DJ, animateurs, décorateurs",
    },
    {
      label: "Restauration",
      detail: "cuisiniers, traiteurs congolais, food trucks",
    },
    {
      label: "Mobilité & sécurité",
      detail: "chauffeurs VTC, agents de sécurité",
    },
    {
      label: "Autres services",
      detail: "babysitters et tout autre métier utile au week-end",
    },
  ],
  benefits: [
    "profil public vérifié",
    "photo principale et galerie",
    "contact visible gratuitement",
    "lien Instagram, TikTok et WhatsApp",
    "demandes de rendez-vous directes",
    "mise en avant gratuite pour apparaître plus haut",
  ],
} as const;

export const proProofPoints = [
  {
    label: "Accès",
    value: "gratuit",
    icon: Users,
  },
  {
    label: "Visibilité",
    value: "gratuite",
    icon: Sparkles,
  },
  {
    label: "Paiement",
    value: "aucun",
    icon: BadgeEuro,
  },
] as const;
