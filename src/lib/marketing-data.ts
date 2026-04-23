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

export const proOffers = [
  {
    title: "Beauté premium",
    price: "15 EUR",
    audience: "maquilleuses, coiffeurs, barbiers",
    benefits: [
      "profil vérifié",
      "contact mis en avant",
      "statistiques de vues",
    ],
  },
  {
    title: "Merch premium",
    price: "20 EUR",
    audience: "vendeurs mode, accessoires, pagne",
    benefits: ["vitrine dédiée", "clics trackés", "badge premium"],
  },
  {
    title: "After premium",
    price: "30 EUR",
    audience: "organisateurs de soirées",
    benefits: [
      "fiche événement",
      "lien billetterie externe",
      "validation admin",
    ],
  },
] as const;

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
