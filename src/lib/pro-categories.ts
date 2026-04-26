import type { ProCategory } from "@prisma/client";

export type ProCategoryMeta = {
  id: ProCategory;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  group: "BEAUTE" | "EVENT" | "LOGISTIQUE" | "FAMILLE" | "AUTRE";
};

export const PRO_CATEGORIES: ProCategoryMeta[] = [
  {
    id: "MAQUILLEUSE",
    label: "Maquilleuse",
    shortLabel: "Make-up",
    icon: "💄",
    description: "Make-up concert, soirée, mariage.",
    group: "BEAUTE",
  },
  {
    id: "ESTHETICIENNE",
    label: "Esthéticienne",
    shortLabel: "Esthétique",
    icon: "🧖🏾‍♀️",
    description: "Soins visage, corps, épilation.",
    group: "BEAUTE",
  },
  {
    id: "PROTHESISTE_ONGLES",
    label: "Prothésiste ongulaire",
    shortLabel: "Ongles",
    icon: "💅🏾",
    description: "Pose d'ongles, manucure, nail art.",
    group: "BEAUTE",
  },
  {
    id: "TECHNICIENNE_CILS",
    label: "Technicienne cils & sourcils",
    shortLabel: "Cils",
    icon: "👁️",
    description: "Extensions de cils, rehaussement, sourcils.",
    group: "BEAUTE",
  },
  {
    id: "COIFFEUR",
    label: "Coiffeur·euse",
    shortLabel: "Coiffeur",
    icon: "✂️",
    description: "Tresses, brushing, locks, perruques.",
    group: "BEAUTE",
  },
  {
    id: "BARBIER",
    label: "Barbier",
    shortLabel: "Barber",
    icon: "🪒",
    description: "Coupes, dégradés, taille de barbe.",
    group: "BEAUTE",
  },
  {
    id: "PHOTOGRAPHE",
    label: "Photographe",
    shortLabel: "Photo",
    icon: "📸",
    description: "Portraits, événements, souvenirs.",
    group: "EVENT",
  },
  {
    id: "VIDEASTE",
    label: "Vidéaste",
    shortLabel: "Vidéo",
    icon: "🎥",
    description: "Aftermovies, reportages, capsules.",
    group: "EVENT",
  },
  {
    id: "CREATEUR_CONTENU",
    label: "Créateur·rice de contenu",
    shortLabel: "Créateur",
    icon: "📱",
    description: "Reels, TikTok, couverture social media.",
    group: "EVENT",
  },
  {
    id: "DJ",
    label: "DJ",
    shortLabel: "DJ",
    icon: "🎧",
    description: "Soirées, afters, mix rumba & afrobeat.",
    group: "EVENT",
  },
  {
    id: "ANIMATEUR",
    label: "Animateur·rice / MC",
    shortLabel: "MC",
    icon: "🎤",
    description: "MC, animation, ambianceur.",
    group: "EVENT",
  },
  {
    id: "ORGANISATEUR_AFTER",
    label: "Organisateur d'after",
    shortLabel: "After",
    icon: "🎉",
    description: "Soirées after-concert clés en main.",
    group: "EVENT",
  },
  {
    id: "DECORATEUR",
    label: "Décorateur·rice",
    shortLabel: "Déco",
    icon: "🎈",
    description: "Décors événementiels, scénographie.",
    group: "EVENT",
  },
  {
    id: "TRAITEUR",
    label: "Traiteur",
    shortLabel: "Traiteur",
    icon: "🍽️",
    description: "Cuisine congolaise, africaine, fusion.",
    group: "EVENT",
  },
  {
    id: "CUISINIER",
    label: "Cuisinier·ère privé·e",
    shortLabel: "Chef",
    icon: "👨‍🍳",
    description: "Plats à domicile, dîners privés.",
    group: "EVENT",
  },
  {
    id: "VENDEUR_MERCH",
    label: "Vendeur merch / artisan",
    shortLabel: "Merch",
    icon: "👕",
    description: "T-shirts, casquettes, goodies.",
    group: "AUTRE",
  },
  {
    id: "COUTURIER",
    label: "Couturier·ère / styliste",
    shortLabel: "Couture",
    icon: "🧵",
    description: "Sapes sur-mesure, retouches express.",
    group: "AUTRE",
  },
  {
    id: "BIJOUTIER",
    label: "Bijoutier·ère",
    shortLabel: "Bijoux",
    icon: "💎",
    description: "Bijoux faits main, créateurs.",
    group: "AUTRE",
  },
  {
    id: "SECURITE",
    label: "Agent de sécurité",
    shortLabel: "Sécurité",
    icon: "🛡️",
    description: "Sécurité événementielle, accompagnement.",
    group: "LOGISTIQUE",
  },
  {
    id: "CHAUFFEUR_VTC",
    label: "Chauffeur VTC",
    shortLabel: "VTC",
    icon: "🚗",
    description: "Transports privés, transferts aéroport.",
    group: "LOGISTIQUE",
  },
  {
    id: "BABYSITTER",
    label: "Baby-sitter",
    shortLabel: "Baby-sitter",
    icon: "👶",
    description: "Garde d'enfants pendant le concert.",
    group: "FAMILLE",
  },
  {
    id: "AUTRE",
    label: "Autre prestation",
    shortLabel: "Autre",
    icon: "✨",
    description: "Toute autre prestation utile au week-end.",
    group: "AUTRE",
  },
];

export const PRO_CATEGORY_IDS = PRO_CATEGORIES.map((c) => c.id);

export const PRO_CATEGORY_BY_ID: Record<ProCategory, ProCategoryMeta> =
  PRO_CATEGORIES.reduce(
    (acc, c) => {
      acc[c.id] = c;
      return acc;
    },
    {} as Record<ProCategory, ProCategoryMeta>,
  );

export const PRO_CATEGORY_GROUPS: {
  id: ProCategoryMeta["group"];
  label: string;
}[] = [
  { id: "BEAUTE", label: "Beauté" },
  { id: "EVENT", label: "Événementiel" },
  { id: "LOGISTIQUE", label: "Logistique" },
  { id: "FAMILLE", label: "Famille" },
  { id: "AUTRE", label: "Autres" },
];

export function categoryLabel(id: ProCategory): string {
  return PRO_CATEGORY_BY_ID[id]?.label ?? id;
}

export function categoryIcon(id: ProCategory): string {
  return PRO_CATEGORY_BY_ID[id]?.icon ?? "✨";
}
