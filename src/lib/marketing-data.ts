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
  { label: "spectateurs cumulés", value: "160k+" },
  { label: "ans de carrière", value: "20+" },
  { label: "albums studio", value: "10+" },
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
    description: "Maquilleuses, coiffeurs et barbiers près de Paris.",
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
      "Aucune affiliation à un artiste, label ou organisateur officiel. La communication reste générique.",
    icon: ShieldCheck,
  },
  {
    title: "Sans intermédiation",
    description:
      "Mboka Hub vend ses propres accès et options. Aucun paiement n'est traité entre utilisateurs.",
    icon: BadgeEuro,
  },
  {
    title: "Contacts protégés",
    description:
      "Les numéros et réseaux sont floutés avant déblocage pour limiter le spam et qualifier les demandes.",
    icon: CheckCircle2,
  },
] as const;

export const PRICE_VIP_EUR = 9.99;
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
  title: "Inscription pro",
  price: "19,99 EUR",
  description:
    "Tarif unique pour tous les pros — beauté, merch ou afters. Aucune commission, aucun abonnement, aucun frais caché.",
  audiences: [
    {
      label: "Beauté",
      detail: "maquilleuses, coiffeurs, barbiers, photographes",
    },
    {
      label: "Merch",
      detail: "vendeurs mode, accessoires, pagne",
    },
    {
      label: "After",
      detail: "organisateurs de soirées",
    },
  ],
  benefits: [
    "profil ou fiche vérifié",
    "contact mis en avant",
    "vitrine ou billetterie externe",
    "statistiques de vues & clics",
    "badge premium",
    "validation admin",
  ],
} as const;

export const proProofPoints = [
  {
    label: "Fans qualifiés",
    value: "diaspora Europe",
    icon: Users,
  },
  {
    label: "Visibilité courte",
    value: "pic événementiel",
    icon: Sparkles,
  },
  {
    label: "Paiement clair",
    value: "à Mboka Hub",
    icon: BadgeEuro,
  },
] as const;
