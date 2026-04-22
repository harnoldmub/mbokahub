export type Locale = "fr" | "en" | "de" | "nl";

export const locales: Record<
  Locale,
  {
    flag: string;
    label: string;
    shortLabel: string;
  }
> = {
  fr: {
    flag: "🇫🇷",
    label: "Français",
    shortLabel: "FR",
  },
  en: {
    flag: "🇬🇧",
    label: "English",
    shortLabel: "EN",
  },
  de: {
    flag: "🇩🇪",
    label: "Deutsch",
    shortLabel: "DE",
  },
  nl: {
    flag: "🇳🇱",
    label: "Nederlands",
    shortLabel: "NL",
  },
};

export const nls = {
  fr: {
    home: {
      heroTitle: "Mboka Hub",
      heroSubtitle:
        "Prépare ton week-end à Paris : trajet, beauté, after, merch, jeu et bons plans.",
      primaryCta: "Voir les trajets",
      proCta: "Je suis pro",
      modulesTitle: "Tout est au même endroit",
      modulesDescription:
        "Un aperçu rapide de chaque module. Clique sur voir plus pour ouvrir la page.",
    },
  },
  en: {
    home: {
      heroTitle: "Mboka Hub",
      heroSubtitle:
        "Plan your Paris weekend: rides, beauty, afterparties, merch, game and useful spots.",
      primaryCta: "See rides",
      proCta: "I am a pro",
      modulesTitle: "Everything in one place",
      modulesDescription:
        "A quick preview of each module. Click see more to open the page.",
    },
  },
  de: {
    home: {
      heroTitle: "Mboka Hub",
      heroSubtitle:
        "Plane dein Paris-Wochenende: Fahrten, Beauty, Afters, Merch, Spiel und Tipps.",
      primaryCta: "Fahrten ansehen",
      proCta: "Ich bin Profi",
      modulesTitle: "Alles an einem Ort",
      modulesDescription:
        "Ein kurzer Blick auf jedes Modul. Klicke auf mehr ansehen.",
    },
  },
  nl: {
    home: {
      heroTitle: "Mboka Hub",
      heroSubtitle:
        "Plan je weekend in Parijs: ritten, beauty, afters, merch, game en handige plekken.",
      primaryCta: "Bekijk ritten",
      proCta: "Ik ben pro",
      modulesTitle: "Alles op één plek",
      modulesDescription:
        "Een snelle preview van elke module. Klik op meer bekijken.",
    },
  },
} satisfies Record<
  Locale,
  {
    home: {
      heroTitle: string;
      heroSubtitle: string;
      primaryCta: string;
      proCta: string;
      modulesTitle: string;
      modulesDescription: string;
    };
  }
>;
