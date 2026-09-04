/**
 * Architecture d'information de Nevent — source unique.
 *
 * Le site expose cinq surfaces de navigation (en-tête, méga-menu, menu mobile,
 * barre mobile basse, pied de page). Chacune était maintenue à la main et
 * proposait un contenu différent : « Afters » n'existait que sur mobile et dans
 * le pied de page, « Prestataires » manquait dans la barre mobile, et douze
 * pages publiques n'étaient atteignables depuis aucune d'elles. Le parcours
 * dépendait donc de l'appareil.
 *
 * L'arborescence est définie ici une fois, et chaque surface en sélectionne une
 * partie selon une règle explicite (voir chaque export). Ajouter une page
 * publique revient à l'ajouter à un pôle : elle apparaît alors dans le pied de
 * page, qui est la seule surface exhaustive.
 */

export type NavLink = {
  href: string;
  label: string;
  /** Affichée dans le méga-menu uniquement. */
  description?: string;
};

export type NavGroup = {
  id: "decouvrir" | "services" | "pro" | "nevent";
  title: string;
  links: NavLink[];
};

/* ------------------------------------------------------------------ */
/* L'arborescence                                                      */
/* ------------------------------------------------------------------ */

const DECOUVRIR: NavGroup = {
  id: "decouvrir",
  title: "Découvrir",
  links: [
    {
      href: "/evenements",
      label: "Événements",
      description: "Concerts afro vérifiés, ville par ville",
    },
    {
      href: "/classiques-paris",
      label: "Guide pratique",
      description: "Arriver, manger, dormir, rentrer",
    },
    {
      href: "/jeu",
      label: "Sape Run",
      description: "Le mini-jeu et son classement hebdo",
    },
  ],
};

const SERVICES: NavGroup = {
  id: "services",
  title: "Organiser",
  links: [
    {
      href: "/prestataires",
      label: "Prestataires",
      description: "Annuaire gratuit, profils vérifiés",
    },
    {
      href: "/trajets",
      label: "Trajets",
      description: "Covoiturage entre villes",
    },
    {
      href: "/afters",
      label: "Afters",
      description: "Les soirées d'après-concert",
    },
  ],
};

/** Sous-ensemble de l'annuaire : des raccourcis, pas un pôle à part entière. */
export const CATEGORY_SHORTCUTS: NavLink[] = [
  { href: "/beaute/maquilleuses", label: "Maquilleuses" },
  { href: "/beaute/coiffeurs", label: "Coiffeurs & barbers" },
  { href: "/beaute/photographes", label: "Photographes" },
  { href: "/beaute/babysitting", label: "Baby-sitting" },
];

const PRO: NavGroup = {
  id: "pro",
  title: "Prestataires",
  links: [
    {
      href: "/pro/inscrire",
      label: "Devenir prestataire",
      description: "Créer sa fiche, gratuitement",
    },
    {
      href: "/pro",
      label: "Espace prestataire",
      description: "Comment fonctionne l'offre",
    },
    {
      href: "/ads",
      label: "Publicité",
      description: "Mise en avant sponsorisée",
    },
    {
      href: "/partenariat",
      label: "Partenariats",
      description: "Marques, médias, organisateurs",
    },
  ],
};

const NEVENT: NavGroup = {
  id: "nevent",
  title: "Nevent",
  links: [
    { href: "/a-propos", label: "À propos" },
    { href: "/vip", label: "Comment ça marche" },
    { href: "/equipe", label: "L'équipe" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
};

export const NAV_TREE: NavGroup[] = [DECOUVRIR, SERVICES, PRO, NEVENT];

export const LEGAL_LINKS: NavLink[] = [
  { href: "/cgu", label: "CGU" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/disclaimer", label: "Disclaimer" },
];

/**
 * Pages publiques volontairement tenues hors navigation.
 *
 * Ce sont des fonctionnalités complètes mais sans contenu : les exposer
 * mènerait à une page vide. Les rattacher à un pôle dès qu'elles sont
 * alimentées.
 */
export const UNLISTED_UNTIL_POPULATED: NavLink[] = [
  { href: "/merch", label: "Merch" },
  { href: "/communaute", label: "Communauté" },
];

/* ------------------------------------------------------------------ */
/* Déclinaison par surface                                             */
/* ------------------------------------------------------------------ */

/**
 * En-tête (desktop) — les trois destinations visiteur les plus fréquentes.
 * Tout le reste est déplié par le méga-menu ; on ne répète donc pas ici une
 * entrée qui ouvre la première section du méga-menu.
 */
export const HEADER_PRIMARY: NavLink[] = [
  SERVICES.links[0], // Prestataires
  DECOUVRIR.links[0], // Événements
  SERVICES.links[1], // Trajets
];

/**
 * Méga-menu — l'arborescence utile au visiteur et au prestataire.
 * Le pôle « Nevent » (institutionnel) et le légal vivent dans le pied de page.
 */
export const MEGA_MENU_GROUPS: (NavGroup | { title: string; links: NavLink[] })[] =
  [
    DECOUVRIR,
    SERVICES,
    { title: "Par catégorie", links: CATEGORY_SHORTCUTS },
    PRO,
  ];

/**
 * Menu mobile — la même arborescence que le méga-menu, mise à plat.
 * Un utilisateur mobile doit atteindre exactement ce qu'atteint un utilisateur
 * desktop.
 */
export const MOBILE_MENU_LINKS: NavLink[] = [
  { href: "/", label: "Accueil" },
  ...DECOUVRIR.links,
  ...SERVICES.links,
  ...CATEGORY_SHORTCUTS,
  ...PRO.links,
  { href: "/contact", label: "Contact" },
];

/**
 * Barre mobile basse — cinq emplacements, réservés aux gestes récurrents et non
 * à la découverte. Les deux derniers (messages, profil) dépendent de la session
 * et restent construits dans le composant.
 */
export const BOTTOM_NAV_PUBLIC: NavLink[] = [
  { href: "/", label: "Accueil" },
  DECOUVRIR.links[0], // Événements
  SERVICES.links[0], // Prestataires
];

/**
 * Pied de page — la seule surface exhaustive : toute l'arborescence, plus le
 * légal. C'est le filet de sécurité de l'architecture.
 */
export const FOOTER_COLUMNS: NavGroup[] = [DECOUVRIR, SERVICES, PRO, NEVENT];
