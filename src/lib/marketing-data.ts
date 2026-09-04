import {
  BadgeEuro,
  Car,
  CheckCircle2,
  Gamepad2,
  MapPin,
  Package,
  PartyPopper,
  Scissors,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const landingStats = [
  { label: "catégories de services", value: "20+" },
  { label: "accès public", value: "gratuit" },
  { label: "accès pro", value: "gratuit" },
] as const;

export const fanModules = [
  {
    title: "Trajets",
    description: "Covoiturages, vans et bus pour venir à Paris.",
    href: "/trajets",
    icon: Car,
  },
  {
    title: "Beauté",
    description: "Maquilleuses, coiffeurs et barbers près de Paris.",
    href: "/beaute/maquilleuses",
    icon: Scissors,
  },
  {
    title: "Afters",
    description: "Soirées listées avec liens vers les billetteries externes.",
    href: "/afters",
    icon: PartyPopper,
  },
  {
    title: "Merch",
    description: "Mode, accessoires et vendeurs à découvrir.",
    href: "/merch",
    icon: Package,
  },
  {
    title: "Paris pratique",
    description: "Restos, hôtels, transports, parkings et numéros utiles.",
    href: "/classiques-paris",
    icon: MapPin,
  },
  {
    title: "Quiz",
    description: "Un quiz rapide pour découvrir ton profil de fan.",
    href: "/quiz",
    icon: Sparkles,
  },
  {
    title: "Sape Run",
    description: "Le mini-jeu pour défier tes amis avant le grand week-end.",
    href: "/jeu",
    icon: Gamepad2,
  },
] as const;

export const trustItems = [
  {
    title: "Indépendant",
    description:
      "Une plateforme de mise en relation ouverte, sans dépendre d'un artiste ou d'un événement unique.",
    icon: ShieldCheck,
  },
  {
    title: "Gratuit pour tous",
    description:
      "Clients et prestataires utilisent toutes les fonctionnalités Nevent sans abonnement.",
    icon: BadgeEuro,
  },
  {
    title: "Visibilité ouverte",
    description:
      "Les mises en avant sont gratuites pendant la phase de lancement.",
    icon: CheckCircle2,
  },
] as const;

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
