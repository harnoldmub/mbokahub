export type Locale = "fr" | "en" | "de" | "nl";

export const defaultLocale: Locale = "fr";

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

export type SearchParams = {
  lang?: string | string[];
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && Object.hasOwn(locales, value);
}

export function getLocale(value?: string | string[] | null): Locale {
  const rawValue = Array.isArray(value) ? value[0] : value;
  return isLocale(rawValue) ? rawValue : defaultLocale;
}

export function getLocaleFromSearchParams(
  searchParams?: SearchParams | null,
): Locale {
  return getLocale(searchParams?.lang);
}

/** @deprecated Use marketHref from @/lib/markets instead. */
export function localizedHref(href: string, locale: Locale | string): string {
  if (href.startsWith("http")) return href;
  // If a market code is passed (fr-be, fr-cod, fr) prepend it as path segment
  return `/${locale}${href}`;
}

export const nls = {
  fr: {
    common: {
      nav: {
        home: "Accueil",
        concert: "Concert",
        services: "Prestataires",
        community: "Communauté",
        playlists: "Playlists",
        quiz: "Quiz",
        game: "Jeux",
        contact: "Contact",
      },
      megaServices: {
        trigger: "Prestations",
        sections: {
          annuaire: "Annuaire",
          beaute: "Beauté",
          shopping: "Shopping & sorties",
          devenirPro: "Espace prestataire",
        },
        links: {
          all: "Tous les prestataires",
          allDesc: "Annuaire vérifié, toutes catégories",
          maquilleuses: "Maquilleuses",
          coiffeurs: "Coiffeurs & barbers",
          photographes: "Photographes",
          babysitting: "Babysitting",
          merch: "Merch & vendeurs",
          afters: "Afters & soirées",
          becomePro: "Devenir prestataire",
        },
      },
      quickNav: {
        aria: "Accès rapide",
        home: "Accueil",
        trajets: "Trajets",
        afters: "Afters",
        merch: "Merch",
        beaute: "Beauté",
        paris: "Paris pratique",
        quiz: "Quiz",
        game: "Sape Run",
        playlists: "Playlists",
        community: "Communauté",
      },
      vipCta: "Devenir prestataire",
      menu: "Navigation",
      openMenu: "Ouvrir le menu",
      seeMore: "Voir plus",
    },
    prestations: {
      number: "02",
      eyebrow: "Prestations",
      title: "Le centre du *style*.",
      description:
        "Trouve les prestataires utiles pour ton week-end. Les profils sont vérifiés sur base du portfolio.",
      members: "membres",
      explore: "Explorer la catégorie",
      proTitle: "Tu es prestataire ?",
      proDescription:
        "Nevent te donne une vitrine simple pour toucher les fans qui préparent leur week-end à Paris.",
      proCta: "S'inscrire comme pro",
      categories: [
        {
          title: "Maquilleuses",
          description: "Pros spécialisées peaux noires et métisses.",
        },
        {
          title: "Coiffeurs & barbers",
          description: "Tresses, lace wigs, coupes et dégradés propres.",
        },
        {
          title: "Photographes",
          description:
            "Portraits, groupes, événements et souvenirs du week-end.",
        },
        {
          title: "Babysitting",
          description:
            "Garde d'enfants pendant le concert, profils vérifiés par l'équipe.",
        },
      ],
    },
    quiz: {
      titleLine1: "Quiz Fally",
      titleLine2: "et stade",
      description:
        "Réponds à 10 questions inspirées du concert de Fally Ipupa : dates, accès Stade de France, règles pratiques et culture diaspora.",
      rewardLabel: "Infos vérifiées",
      rewardText:
        "Deux dates officielles, première date complète, seconde date ajoutée.",
      communityLabel: "Pratique stade",
      communityText:
        "Accès RER B/D, métro 12/13/14, parkings sur réservation et restrictions sacs.",
      cta: "Lancer le quiz",
      duration: "Temps estimé : 2 minutes",
    },
    game: {
      version: "Sape Run — v1.0",
      titleLine1: "Sape",
      titleLine2: "Run.",
      description:
        "Incarne l'Aigle et fonce vers le Stade de France ! Évite les Combattants et les obstacles, récupère les Micros d'Or et prouve que tu es le plus grand Warrior.",
      play: "Jouer maintenant",
      leaderboard: "Classement",
      weeklyLeaderboard: "Leaderboard hebdo",
      points: "PTS",
      updatedAt: "Dernière mise à jour à",
      emptyLeaderboard: "Aucun score cette semaine — sois le premier !",
      beFirst: "Lancer la première partie",
      back: "Retour au jeu",
      eyebrow: "Nevent × Stade de France 2026",
      tagline:
        "Le Sapeur doit traverser Paris jusqu'au Stade de France — aide-le !",
      idleTagline:
        "Aide le Sapeur à traverser Paris jusqu'au Stade de France. Ramasse chapeaux, diamants et micros !",
      idleEyebrow: "Nevent Game",
      start: "Commencer",
      controlsHint: "Espace / Clic / Tap pour sauter",
      gameOver: "Game Over",
      fallen: "Le Sapeur est tombé !",
      score: "Score",
      record: "Record",
      newRecord: "Nouveau Record !",
      retry: "Rejouer",
      jumpHint: "Sauter (Espace / Clic)",
      recordLabel: "Record",
      speed: "VITESSE",
      goal: "STADE DE FRANCE",
      namePrompt: "Ton prénom (pour le classement)",
      namePlaceholder: "Ton prénom",
      nameRequired: "Entre ton prénom pour démarrer",
      playerLabel: "Joueur",
    },
    quizGame: {
      eyebrow: "Pendant que tu attends le concert",
      title: "Joue. Teste tes connaissances. Hype-toi.",
      gameBadge: "Mini-jeu",
      gameMeta: "2 min · gratuit",
      gameTitle: "Sape Run",
      gameDescription:
        "Cours dans les rues de Paris jusqu'au Stade de France, esquive les obstacles, ramasse les sapes les plus drippées. Bat ton record et grimpe au classement.",
      gameCta: "Lancer le jeu",
      quizBadge: "Quiz",
      quizMeta: "10 questions · 3 min",
      quizTitle: "Quel fan de Fally ?",
      quizDescription:
        "De Droit Chemin à Tokooos II, prouve que tu connais ton classique. Score, badge et code promo à la clé.",
      quizCta: "Démarrer le quiz",
    },
    contact: {
      eyebrow: "Contact",
      title: "On reste *en ligne*.",
      description:
        "Une question sur un trajet, un paiement ou ton profil pro ? L'équipe Nevent te répond.",
      email: "Email",
      whatsapp: "WhatsApp Business",
      office: "Bureau",
      fullName: "Nom complet",
      fullNamePlaceholder: "Jean Dupont",
      subject: "Sujet",
      subjectHelp: "Pourquoi nous contactes-tu ?",
      subjectPlaceholder: "Covoiturage, partenariat...",
      message: "Message",
      messagePlaceholder: "Dis-nous tout...",
      send: "Envoyer le message",
    },
    footer: {
      headlineStart: "Rejoins",
      headlineMiddle: "fans de la diaspora.",
      headlineEnd: "Sans détour.",
      navigation: "Navigation",
      professionals: "Professionnels",
      legal: "Légal",
      rights: "TOUS DROITS RÉSERVÉS.",
      links: {
        rides: "Trajets",
        afters: "Afters",
        services: "Prestataires",
        photographers: "Photographes",
        proSpace: "Espace prestataire",
        partnerships: "Partenariats",
        ads: "Publicité",
        team: "L'équipe",
        contact: "Contact",
        faq: "FAQ",
        terms: "CGU",
        sales: "CGV",
        privacy: "Confidentialité",
        legalNotice: "Mentions légales",
        disclaimer: "Disclaimer",
      },
    },
    communityPage: {
      eyebrow: "Communauté",
      title: "Rejoins ta communauté WhatsApp",
      subtitle:
        "Une communauté par région, animée par des modérateurs Nevent. Entraide, infos concert, covoiturage, bons plans — tout est là.",
      cta: "Devenir modérateur de ta région",
      emptyTitle: "Bientôt disponible",
      emptyText:
        "Les premières communautés régionales arrivent. Postule comme modérateur pour lancer celle de ta ville.",
      membersLabel: "membres",
      joinButton: "Rejoindre",
      moderatedBy: "Animée par",
    },
  },
  en: {
    common: {
      nav: {
        home: "Home",
        concert: "Concert",
        services: "Providers",
        community: "Community",
        playlists: "Playlists",
        quiz: "Quiz",
        game: "Games",
        contact: "Contact",
      },
      megaServices: {
        trigger: "Services",
        sections: {
          annuaire: "Directory",
          beaute: "Beauty",
          shopping: "Shop & nightlife",
          devenirPro: "Pro space",
        },
        links: {
          all: "All providers",
          allDesc: "Verified directory, all categories",
          maquilleuses: "Make-up artists",
          coiffeurs: "Hairdressers & barbers",
          photographes: "Photographers",
          babysitting: "Babysitting",
          merch: "Merch & sellers",
          afters: "Afters & parties",
          becomePro: "List my service",
        },
      },
      quickNav: {
        aria: "Quick access",
        home: "Home",
        trajets: "Rides",
        afters: "Afters",
        merch: "Merch",
        beaute: "Beauty",
        paris: "Paris guide",
        quiz: "Quiz",
        game: "Sape Run",
        playlists: "Playlists",
        community: "Community",
      },
      vipCta: "Become a pro",
      menu: "Navigation",
      openMenu: "Ouvrir le menu",
      seeMore: "Voir plus",
    },
    prestations: {
      number: "02",
      eyebrow: "Services",
      title: "The *style* hub.",
      description:
        "Find useful providers for your weekend. Profiles are checked through their portfolio.",
      members: "members",
      explore: "Explore category",
      proTitle: "Are you a provider?",
      proDescription:
        "Nevent gives you a simple storefront to reach fans preparing their Paris weekend.",
      proCta: "Register as a pro",
      categories: [
        {
          title: "Makeup artists",
          description: "Pros specialized in black and mixed skin.",
        },
        {
          title: "Hairdressers & barbers",
          description: "Braids, lace wigs, cuts and clean fades.",
        },
        {
          title: "Photographers",
          description: "Portraits, groups, events and weekend memories.",
        },
        {
          title: "Babysitting",
          description:
            "Childcare during the concert, profiles vetted by our team.",
        },
      ],
    },
    quiz: {
      titleLine1: "Fally quiz",
      titleLine2: "and stadium",
      description:
        "Answer 10 questions inspired by the Fally Ipupa concert: dates, Stade de France access, venue rules and diaspora culture.",
      rewardLabel: "Verified info",
      rewardText: "Two official dates, first date sold out, second date added.",
      communityLabel: "Stadium practicals",
      communityText:
        "RER B/D, metro 12/13/14, reserved parking and bag restrictions.",
      cta: "Start the quiz",
      duration: "Estimated time: 2 minutes",
    },
    game: {
      version: "Sape Run — v1.0",
      titleLine1: "Sape",
      titleLine2: "Run.",
      description:
        "Jump, collect style bonuses and avoid obstacles to reach Stade de France at your best.",
      play: "Play now",
      leaderboard: "Leaderboard",
      weeklyLeaderboard: "Weekly leaderboard",
      points: "PTS",
      updatedAt: "Last updated at",
      emptyLeaderboard: "No scores this week — be the first!",
      beFirst: "Start the first run",
      back: "Back to game",
      eyebrow: "Nevent × Stade de France 2026",
      tagline:
        "The Sapeur must cross Paris all the way to Stade de France — help him!",
      idleTagline:
        "Help the Sapeur cross Paris to reach Stade de France. Grab hats, diamonds and microphones!",
      idleEyebrow: "Nevent Game",
      start: "Start",
      controlsHint: "Space / Click / Tap to jump",
      gameOver: "Game Over",
      fallen: "The Sapeur is down!",
      score: "Score",
      record: "Best",
      newRecord: "New record!",
      retry: "Play again",
      jumpHint: "Jump (Space / Click)",
      recordLabel: "Best",
      speed: "SPEED",
      goal: "STADE DE FRANCE",
      namePrompt: "Your first name (for the leaderboard)",
      namePlaceholder: "Your first name",
      nameRequired: "Enter your first name to start",
      playerLabel: "Player",
    },
    quizGame: {
      eyebrow: "While you wait for the concert",
      title: "Play. Test your skills. Hype yourself.",
      gameBadge: "Mini-game",
      gameMeta: "2 min · free",
      gameTitle: "Sape Run",
      gameDescription:
        "Run through Paris all the way to Stade de France, dodge obstacles, grab the drippiest sapes. Beat your record and climb the leaderboard.",
      gameCta: "Launch the game",
      quizBadge: "Quiz",
      quizMeta: "10 questions · 3 min",
      quizTitle: "How big a Fally fan are you?",
      quizDescription:
        "From Droit Chemin to Tokooos II, prove you know the classics. Score, badge and promo code up for grabs.",
      quizCta: "Start the quiz",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's stay *connected*.",
      description:
        "Question about a ride, payment or pro profile? The Nevent team will reply.",
      email: "Email",
      whatsapp: "WhatsApp Business",
      office: "Office",
      fullName: "Full name",
      fullNamePlaceholder: "John Doe",
      subject: "Subject",
      subjectHelp: "Why are you contacting us?",
      subjectPlaceholder: "Carpool, partnership...",
      message: "Message",
      messagePlaceholder: "Tell us everything...",
      send: "Send message",
    },
    footer: {
      headlineStart: "Join",
      headlineMiddle: "diaspora fans.",
      headlineEnd: "No detours.",
      navigation: "Navigation",
      professionals: "Professionals",
      legal: "Legal",
      rights: "ALL RIGHTS RESERVED.",
      links: {
        rides: "Rides",
        afters: "Afters",
        services: "Providers",
        photographers: "Photographers",
        proSpace: "Provider area",
        partnerships: "Partnerships",
        ads: "Advertising",
        team: "Team",
        contact: "Contact",
        faq: "FAQ",
        terms: "Terms of use",
        sales: "Sales terms",
        privacy: "Privacy",
        legalNotice: "Legal notice",
        disclaimer: "Disclaimer",
      },
    },
    communityPage: {
      eyebrow: "Community",
      title: "Join your WhatsApp community",
      subtitle:
        "One community per region, run by Nevent moderators. Help, concert tips, carpooling, good deals — it's all here.",
      cta: "Become moderator of your region",
      emptyTitle: "Coming soon",
      emptyText:
        "The first regional communities are landing. Apply as moderator to launch yours.",
      membersLabel: "members",
      joinButton: "Join",
      moderatedBy: "Run by",
    },
  },
  de: {
    common: {
      nav: {
        home: "Start",
        concert: "Konzert",
        services: "Anbieter",
        community: "Community",
        playlists: "Playlists",
        quiz: "Quiz",
        game: "Spiele",
        contact: "Kontakt",
      },
      megaServices: {
        trigger: "Services",
        sections: {
          annuaire: "Verzeichnis",
          beaute: "Beauty",
          shopping: "Shopping & Nightlife",
          devenirPro: "Pro-Bereich",
        },
        links: {
          all: "Alle Dienstleister",
          allDesc: "Geprüftes Verzeichnis, alle Kategorien",
          maquilleuses: "Make-up Artists",
          coiffeurs: "Friseure & Barbiere",
          photographes: "Fotografen",
          babysitting: "Babysitting",
          merch: "Merch & Händler",
          afters: "Afters & Partys",
          becomePro: "Mein Angebot eintragen",
        },
      },
      quickNav: {
        aria: "Schnellzugriff",
        home: "Start",
        trajets: "Mitfahrten",
        afters: "Afters",
        merch: "Merch",
        beaute: "Beauty",
        paris: "Paris-Guide",
        quiz: "Quiz",
        game: "Sape Run",
        playlists: "Playlists",
        community: "Community",
      },
      vipCta: "Anbieter werden",
      menu: "Navigation",
      openMenu: "Menü öffnen",
      seeMore: "Mehr sehen",
    },
    prestations: {
      number: "02",
      eyebrow: "Services",
      title: "Das Zentrum für *Style*.",
      description:
        "Finde passende Dienstleister für dein Wochenende. Profile werden über das Portfolio geprüft.",
      members: "Mitglieder",
      explore: "Kategorie ansehen",
      proTitle: "Bist du Dienstleister?",
      proDescription:
        "Nevent gibt dir eine einfache Bühne, um Fans vor ihrem Paris-Wochenende zu erreichen.",
      proCta: "Als Profi anmelden",
      categories: [
        {
          title: "Make-up-Artists",
          description: "Profis für schwarze und gemischte Haut.",
        },
        {
          title: "Friseure & Barbiere",
          description: "Braids, Lace Wigs, Schnitte und saubere Fades.",
        },
        {
          title: "Fotografen",
          description: "Porträts, Gruppen, Events und Erinnerungen.",
        },
        {
          title: "Babysitting",
          description:
            "Kinderbetreuung während des Konzerts, vom Team geprüfte Profile.",
        },
      ],
    },
    quiz: {
      titleLine1: "Fally-Quiz",
      titleLine2: "und Stadion",
      description:
        "Beantworte 10 Fragen zum Konzert von Fally Ipupa: Termine, Zugang zum Stade de France, Stadionregeln und Diaspora-Kultur.",
      rewardLabel: "Verifizierte Infos",
      rewardText:
        "Zwei offizielle Termine, erster Termin ausverkauft, zweiter Termin hinzugefügt.",
      communityLabel: "Stadion praktisch",
      communityText:
        "RER B/D, Metro 12/13/14, reservierte Parkplätze und Taschenregeln.",
      cta: "Quiz starten",
      duration: "Dauer: ca. 2 Minuten",
    },
    game: {
      version: "Sape Run — v1.0",
      titleLine1: "Sape",
      titleLine2: "Run.",
      description:
        "Springe, sammle Style-Boni und weiche Hindernissen aus, um top gestylt zum Stade de France zu kommen.",
      play: "Jetzt spielen",
      leaderboard: "Rangliste",
      weeklyLeaderboard: "Wochenrangliste",
      points: "PKT",
      updatedAt: "Zuletzt aktualisiert um",
      emptyLeaderboard: "Diese Woche noch keine Scores — sei der Erste!",
      beFirst: "Erste Runde starten",
      back: "Zurück zum Spiel",
      eyebrow: "Nevent × Stade de France 2026",
      tagline:
        "Der Sapeur muss durch Paris bis zum Stade de France — hilf ihm!",
      idleTagline:
        "Hilf dem Sapeur, durch Paris bis zum Stade de France zu kommen. Sammle Hüte, Diamanten und Mikros!",
      idleEyebrow: "Nevent Game",
      start: "Start",
      controlsHint: "Leertaste / Klick / Tap zum Springen",
      gameOver: "Game Over",
      fallen: "Der Sapeur ist gefallen!",
      score: "Punkte",
      record: "Rekord",
      newRecord: "Neuer Rekord!",
      retry: "Nochmal",
      jumpHint: "Springen (Leertaste / Klick)",
      recordLabel: "Rekord",
      speed: "TEMPO",
      goal: "STADE DE FRANCE",
      namePrompt: "Dein Vorname (für die Bestenliste)",
      namePlaceholder: "Dein Vorname",
      nameRequired: "Gib deinen Vornamen ein, um zu starten",
      playerLabel: "Spieler",
    },
    quizGame: {
      eyebrow: "Während du auf das Konzert wartest",
      title: "Spiel. Teste dein Wissen. Heiz dich auf.",
      gameBadge: "Mini-Spiel",
      gameMeta: "2 Min · gratis",
      gameTitle: "Sape Run",
      gameDescription:
        "Lauf durch Paris bis zum Stade de France, weiche Hindernissen aus und sammle die stylischsten Sapes. Schlag deinen Rekord und steig in der Rangliste auf.",
      gameCta: "Spiel starten",
      quizBadge: "Quiz",
      quizMeta: "10 Fragen · 3 Min",
      quizTitle: "Wie groß ist dein Fally-Fan-Faktor?",
      quizDescription:
        "Von Droit Chemin bis Tokooos II — beweise, dass du die Klassiker kennst. Score, Badge und Promo-Code warten.",
      quizCta: "Quiz starten",
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Wir bleiben *verbunden*.",
      description:
        "Frage zu Fahrt, Zahlung oder Profi-Profil? Das Nevent-Hub-Team antwortet dir.",
      email: "E-Mail",
      whatsapp: "WhatsApp Business",
      office: "Büro",
      fullName: "Vollständiger Name",
      fullNamePlaceholder: "Max Mustermann",
      subject: "Betreff",
      subjectHelp: "Warum kontaktierst du uns?",
      subjectPlaceholder: "Mitfahrgelegenheit, Partnerschaft...",
      message: "Nachricht",
      messagePlaceholder: "Erzähl uns alles...",
      send: "Nachricht senden",
    },
    footer: {
      headlineStart: "Schließ dich",
      headlineMiddle: "Diaspora-Fans an.",
      headlineEnd: "Direkt.",
      navigation: "Navigation",
      professionals: "Profis",
      legal: "Rechtliches",
      rights: "ALLE RECHTE VORBEHALTEN.",
      links: {
        rides: "Fahrten",
        afters: "Afters",
        services: "Anbieter",
        photographers: "Fotografen",
        proSpace: "Pro-Bereich",
        partnerships: "Partnerschaften",
        ads: "Werbung",
        team: "Team",
        contact: "Kontakt",
        faq: "FAQ",
        terms: "Nutzungsbedingungen",
        sales: "Verkaufsbedingungen",
        privacy: "Datenschutz",
        legalNotice: "Impressum",
        disclaimer: "Disclaimer",
      },
    },
    communityPage: {
      eyebrow: "Community",
      title: "Tritt deiner WhatsApp-Community bei",
      subtitle:
        "Eine Community pro Region, betreut von Nevent-Hub-Moderatoren. Hilfe, Konzertinfos, Mitfahrgelegenheiten, gute Tipps — alles da.",
      cta: "Werde Moderator deiner Region",
      emptyTitle: "Bald verfügbar",
      emptyText:
        "Die ersten regionalen Communities starten. Bewirb dich als Moderator, um deine zu eröffnen.",
      membersLabel: "Mitglieder",
      joinButton: "Beitreten",
      moderatedBy: "Geleitet von",
    },
  },
  nl: {
    common: {
      nav: {
        home: "Home",
        concert: "Concert",
        services: "Diensten",
        community: "Community",
        playlists: "Playlists",
        quiz: "Quiz",
        game: "Games",
        contact: "Contact",
      },
      megaServices: {
        trigger: "Diensten",
        sections: {
          annuaire: "Gids",
          beaute: "Beauty",
          shopping: "Shop & uitgaan",
          devenirPro: "Pro-ruimte",
        },
        links: {
          all: "Alle dienstverleners",
          allDesc: "Geverifieerde gids, alle categorieën",
          maquilleuses: "Make-up artists",
          coiffeurs: "Kappers & barbiers",
          photographes: "Fotografen",
          babysitting: "Babysitting",
          merch: "Merch & verkopers",
          afters: "Afters & feesten",
          becomePro: "Mijn dienst registreren",
        },
      },
      quickNav: {
        aria: "Snelle toegang",
        home: "Home",
        trajets: "Ritten",
        afters: "Afters",
        merch: "Merch",
        beaute: "Beauty",
        paris: "Parijs-gids",
        quiz: "Quiz",
        game: "Sape Run",
        playlists: "Playlists",
        community: "Community",
      },
      vipCta: "Aanbieder worden",
      menu: "Navigatie",
      openMenu: "Menu openen",
      seeMore: "Meer zien",
    },
    prestations: {
      number: "02",
      eyebrow: "Diensten",
      title: "Het centrum voor *style*.",
      description:
        "Vind handige dienstverleners voor je weekend. Profielen worden via portfolio gecontroleerd.",
      members: "leden",
      explore: "Categorie bekijken",
      proTitle: "Ben jij dienstverlener?",
      proDescription:
        "Nevent geeft je een eenvoudige etalage om fans te bereiken die hun Parijs-weekend voorbereiden.",
      proCta: "Inschrijven als pro",
      categories: [
        {
          title: "Make-up artists",
          description: "Pros gespecialiseerd in zwarte en gemengde huid.",
        },
        {
          title: "Kappers & barbiers",
          description: "Vlechten, lace wigs, coupes en strakke fades.",
        },
        {
          title: "Fotografen",
          description: "Portretten, groepen, events en weekendherinneringen.",
        },
        {
          title: "Babysitting",
          description:
            "Kinderopvang tijdens het concert, profielen door het team gecontroleerd.",
        },
      ],
    },
    quiz: {
      titleLine1: "Fally quiz",
      titleLine2: "en stadion",
      description:
        "Beantwoord 10 vragen geïnspireerd door het concert van Fally Ipupa: data, toegang tot Stade de France, stadionregels en diaspora-cultuur.",
      rewardLabel: "Geverifieerde info",
      rewardText:
        "Twee officiële data, eerste datum uitverkocht, tweede datum toegevoegd.",
      communityLabel: "Stadion praktisch",
      communityText:
        "RER B/D, metro 12/13/14, gereserveerde parking en tasregels.",
      cta: "Start de quiz",
      duration: "Geschatte tijd: 2 minuten",
    },
    game: {
      version: "Sape Run — v1.0",
      titleLine1: "Sape",
      titleLine2: "Run.",
      description:
        "Spring, verzamel style-bonussen en ontwijk obstakels om top gestyled het Stade de France te bereiken.",
      play: "Nu spelen",
      leaderboard: "Klassement",
      weeklyLeaderboard: "Weekklassement",
      points: "PTN",
      updatedAt: "Laatst bijgewerkt om",
      emptyLeaderboard: "Nog geen scores deze week — wees de eerste!",
      beFirst: "Start de eerste run",
      back: "Terug naar het spel",
      eyebrow: "Nevent × Stade de France 2026",
      tagline: "De Sapeur moet door Parijs naar Stade de France — help hem!",
      idleTagline:
        "Help de Sapeur dwars door Parijs tot Stade de France. Pak hoeden, diamanten en microfoons!",
      idleEyebrow: "Nevent Game",
      start: "Start",
      controlsHint: "Spatie / Klik / Tap om te springen",
      gameOver: "Game Over",
      fallen: "De Sapeur is gevallen!",
      score: "Score",
      record: "Record",
      newRecord: "Nieuw record!",
      retry: "Opnieuw",
      jumpHint: "Springen (Spatie / Klik)",
      recordLabel: "Record",
      speed: "SNELHEID",
      goal: "STADE DE FRANCE",
      namePrompt: "Je voornaam (voor het klassement)",
      namePlaceholder: "Je voornaam",
      nameRequired: "Vul je voornaam in om te starten",
      playerLabel: "Speler",
    },
    quizGame: {
      eyebrow: "Terwijl je wacht op het concert",
      title: "Speel. Test je kennis. Hype jezelf.",
      gameBadge: "Mini-game",
      gameMeta: "2 min · gratis",
      gameTitle: "Sape Run",
      gameDescription:
        "Ren door Parijs tot aan Stade de France, ontwijk obstakels en pak de chicste sapes. Verbreek je record en klim in het klassement.",
      gameCta: "Start het spel",
      quizBadge: "Quiz",
      quizMeta: "10 vragen · 3 min",
      quizTitle: "Hoe groot is jouw Fally-fan-factor?",
      quizDescription:
        "Van Droit Chemin tot Tokooos II, bewijs dat je de klassiekers kent. Score, badge en promocode te winnen.",
      quizCta: "Start de quiz",
    },
    contact: {
      eyebrow: "Contact",
      title: "We blijven *verbonden*.",
      description:
        "Vraag over een rit, betaling of pro-profiel? Het Nevent-team antwoordt.",
      email: "E-mail",
      whatsapp: "WhatsApp Business",
      office: "Kantoor",
      fullName: "Volledige naam",
      fullNamePlaceholder: "Jan Jansen",
      subject: "Onderwerp",
      subjectHelp: "Waarom neem je contact op?",
      subjectPlaceholder: "Carpool, partnership...",
      message: "Bericht",
      messagePlaceholder: "Vertel ons alles...",
      send: "Bericht versturen",
    },
    footer: {
      headlineStart: "Sluit je aan bij",
      headlineMiddle: "diaspora-fans.",
      headlineEnd: "Zonder omweg.",
      navigation: "Navigatie",
      professionals: "Professionals",
      legal: "Juridisch",
      rights: "ALLE RECHTEN VOORBEHOUDEN.",
      links: {
        rides: "Ritten",
        afters: "Afters",
        services: "Diensten",
        photographers: "Fotografen",
        proSpace: "Pro-zone",
        partnerships: "Partnerships",
        ads: "Advertenties",
        team: "Team",
        contact: "Contact",
        faq: "FAQ",
        terms: "Gebruiksvoorwaarden",
        sales: "Verkoopvoorwaarden",
        privacy: "Privacy",
        legalNotice: "Juridische kennisgeving",
        disclaimer: "Disclaimer",
      },
    },
    communityPage: {
      eyebrow: "Community",
      title: "Sluit je aan bij je WhatsApp-community",
      subtitle:
        "Eén community per regio, geleid door Nevent-moderators. Hulp, concertinfo, carpoolen, goede tips — alles is hier.",
      cta: "Word moderator van je regio",
      emptyTitle: "Binnenkort beschikbaar",
      emptyText:
        "De eerste regionale communities komen eraan. Solliciteer als moderator om die van jouw stad te starten.",
      membersLabel: "leden",
      joinButton: "Deelnemen",
      moderatedBy: "Geleid door",
    },
  },
} as const;

export type Dictionary = (typeof nls)[Locale];
