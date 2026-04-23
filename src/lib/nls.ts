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

export function localizedHref(href: string, locale: Locale): string {
  if (locale === defaultLocale || href.startsWith("http")) {
    return href;
  }

  const [path, hash] = href.split("#");
  const separator = path.includes("?") ? "&" : "?";
  const localizedPath = `${path}${separator}lang=${locale}`;

  return hash ? `${localizedPath}#${hash}` : localizedPath;
}

export const nls = {
  fr: {
    common: {
      nav: {
        home: "Accueil",
        services: "Prestations",
        quiz: "Quiz",
        game: "Jeux",
        contact: "Contact",
      },
      vipCta: "Devenir VIP",
      menu: "Navigation",
      openMenu: "Ouvrir le menu",
      seeMore: "Voir plus",
    },
    home: {
      heroTitle: "Mboka Hub",
      heroSubtitle:
        "Prépare le week-end du concert de Fally Ipupa au Stade de France : trajets, prestataires, afters, merch, jeu et bons plans vérifiés.",
      primaryCta: "Préparer mon week-end",
      proCta: "Je suis pro",
      prestationsLabel: "Prestations",
      modulesTitleLine1: "Tout est au",
      modulesTitleLine2: "même endroit.",
      modulesDescription:
        "Services utiles pour vivre le week-end Fally Ipupa sans stress : trajets, beauté, photo, soirées, guide Paris et plus.",
      proEyebrow: "Section pros",
      proTitleLine1: "Tu proposes",
      proTitleLine2: "un service ?",
      proDescription:
        "Maquillage, coiffure, photo, transport ou logistique : réserve ta place et sois visible auprès des fans de Fally Ipupa.",
      proButton: "Devenir partenaire",
      quickLinks: "Accès rapide",
      stats: {
        audience: "dates officielles",
        city: "prix public dès",
        dates: "week-end clé",
      },
      modules: [
        {
          title: "Trajets",
          eyebrow: "Covoiturage",
          description: "Du porte-à-porte diaspora vers le Stade de France.",
          features: [
            "Départs Bruxelles, Londres, Lyon...",
            "Places dispo en temps réel",
            "WhatsApp masqué avant déblocage",
            "Plan B avec RER B/D, métro 12/13/14",
          ],
          cta: "Voir les trajets",
        },
        {
          title: "Prestataires",
          eyebrow: "Beauté & services",
          description:
            "Maquilleuses, coiffeurs, barbiers et photographes de la diaspora.",
          features: [
            "Maquilleuses spé peau noire",
            "Coiffeurs, tresseurs et barbiers",
            "Photographes pour shootings et événements",
            "Tarifs affichés, profils vérifiés",
          ],
          cta: "Trouver un prestataire",
        },
        {
          title: "Afters",
          eyebrow: "Soirées post-concert",
          description: "Les meilleures soirées des nuits du 2 et 3 mai.",
          features: [
            "Soirées validées par l'équipe",
            "Lien billetterie externe direct",
            "Prix d'entrée et infos lieu",
            "Alertes nouvelles soirées",
          ],
          cta: "Voir les afters",
        },
        {
          title: "Paris pratique",
          eyebrow: "Guide complet",
          description: "Tout ce qu'il faut savoir pour Paris sans stress.",
          features: [
            "RER B La Plaine et RER D Saint-Denis",
            "Métro 12, 13, 14 et tram T1/T8",
            "Parkings officiels à réserver dès 29 EUR",
            "Sacs limités à 15 L, pas de valises",
          ],
          cta: "Voir le guide",
        },
        {
          title: "Merch",
          eyebrow: "Mode & accessoires",
          description: "Vendeurs mode, pagne et accessoires de la diaspora.",
          features: [
            "Sapologie et lifestyle Congo",
            "Mode africaine contemporaine",
            "Vendeurs vérifiés par l'équipe",
            "Lien boutique ou contact direct",
          ],
          cta: "Découvrir le merch",
        },
        {
          title: "Photographes",
          eyebrow: "Souvenirs",
          description: "Immortalise les meilleurs moments du week-end.",
          features: [
            "Photographes pro diaspora",
            "Shooting express avant/après",
            "Formules événementielles",
            "Portfolio visible sur le profil",
          ],
          cta: "Voir les photographes",
        },
      ],
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
        "Mboka Hub te donne une vitrine simple pour toucher les fans qui préparent leur week-end à Paris.",
      proCta: "S'inscrire comme pro",
      categories: [
        {
          title: "Maquilleuses",
          description: "Pros spécialisées peaux noires et métisses.",
        },
        {
          title: "Coiffeurs & barbiers",
          description: "Tresses, lace wigs, coupes et dégradés propres.",
        },
        {
          title: "Photographes",
          description:
            "Portraits, groupes, événements et souvenirs du week-end.",
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
      updated: "Dernière mise à jour à 22:50",
    },
    contact: {
      eyebrow: "Contact",
      title: "On reste *en ligne*.",
      description:
        "Une question sur un trajet, un paiement ou ton profil pro ? L'équipe Mboka Hub te répond.",
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
        services: "Prestations",
        photographers: "Photographes",
        proSpace: "Espace pro",
        partnerships: "Partenariats",
        ads: "Publicité",
        team: "L'équipe",
        contact: "Contact",
        faq: "FAQ",
      },
    },
  },
  en: {
    common: {
      nav: {
        home: "Home",
        services: "Services",
        quiz: "Quiz",
        game: "Games",
        contact: "Contact",
      },
      vipCta: "Become VIP",
      menu: "Navigation",
      openMenu: "Ouvrir le menu",
      seeMore: "Voir plus",
    },
    home: {
      heroTitle: "Mboka Hub",
      heroSubtitle:
        "Plan the Fally Ipupa concert weekend at Stade de France: rides, providers, afterparties, merch, game and verified tips.",
      primaryCta: "See rides",
      proCta: "I am a pro",
      prestationsLabel: "Services",
      modulesTitleLine1: "Everything in",
      modulesTitleLine2: "one place.",
      modulesDescription:
        "Useful services to enjoy the Fally Ipupa weekend with less stress: rides, beauty, photos, parties, Paris guide and more.",
      proEyebrow: "For pros",
      proTitleLine1: "Do you offer",
      proTitleLine2: "a service?",
      proDescription:
        "Makeup, hair, photo, transport or logistics: get listed and be visible to Fally Ipupa fans.",
      proButton: "Become a partner",
      quickLinks: "Quick access",
      stats: {
        audience: "official dates",
        city: "public price from",
        dates: "key weekend",
      },
      modules: [
        {
          title: "Rides",
          eyebrow: "Carpooling",
          description: "Diaspora door-to-door rides to Stade de France.",
          features: [
            "Departures from Brussels, London, Lyon...",
            "Seats shown in real time",
            "WhatsApp hidden before unlock",
            "Backup with RER B/D, metro 12/13/14",
          ],
          cta: "See rides",
        },
        {
          title: "Providers",
          eyebrow: "Beauty & services",
          description:
            "Makeup artists, hairdressers, barbers and photographers from the diaspora.",
          features: [
            "Makeup for black and mixed skin",
            "Hairdressers, braiders and barbers",
            "Photographers for shoots and events",
            "Visible prices, verified profiles",
          ],
          cta: "Find a provider",
        },
        {
          title: "Afters",
          eyebrow: "Post-concert parties",
          description: "The best parties on the nights of May 2 and 3.",
          features: [
            "Events checked by the team",
            "Direct external ticket link",
            "Entry price and venue info",
            "Alerts for new parties",
          ],
          cta: "See afters",
        },
        {
          title: "Paris guide",
          eyebrow: "Full guide",
          description: "Everything you need for Paris with less stress.",
          features: [
            "RER B La Plaine and RER D Saint-Denis",
            "Metro 12, 13, 14 and tram T1/T8",
            "Official parking to book from EUR 29",
            "Bags limited to 15 L, no suitcases",
          ],
          cta: "Open the guide",
        },
        {
          title: "Merch",
          eyebrow: "Fashion & accessories",
          description: "Diaspora fashion, wax fabric and accessories vendors.",
          features: [
            "Sape and Congo lifestyle",
            "Contemporary African fashion",
            "Vendors checked by the team",
            "Shop link or direct contact",
          ],
          cta: "Discover merch",
        },
        {
          title: "Photographers",
          eyebrow: "Memories",
          description: "Capture the best moments of the weekend.",
          features: [
            "Diaspora pro photographers",
            "Quick shoots before/after",
            "Event packages",
            "Portfolio visible on profile",
          ],
          cta: "See photographers",
        },
      ],
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
        "Mboka Hub gives you a simple storefront to reach fans preparing their Paris weekend.",
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
      updated: "Last updated at 22:50",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's stay *connected*.",
      description:
        "Question about a ride, payment or pro profile? The Mboka Hub team will reply.",
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
        services: "Services",
        photographers: "Photographers",
        proSpace: "Pro area",
        partnerships: "Partnerships",
        ads: "Advertising",
        team: "Team",
        contact: "Contact",
        faq: "FAQ",
      },
    },
  },
  de: {
    common: {
      nav: {
        home: "Start",
        services: "Services",
        quiz: "Quiz",
        game: "Spiele",
        contact: "Kontakt",
      },
      vipCta: "VIP werden",
      menu: "Navigation",
      openMenu: "Menü öffnen",
      seeMore: "Mehr sehen",
    },
    home: {
      heroTitle: "Mboka Hub",
      heroSubtitle:
        "Plane das Konzertwochenende von Fally Ipupa im Stade de France: Fahrten, Dienstleister, Afters, Merch, Spiel und geprüfte Tipps.",
      primaryCta: "Fahrten ansehen",
      proCta: "Ich bin Profi",
      prestationsLabel: "Services",
      modulesTitleLine1: "Alles an",
      modulesTitleLine2: "einem Ort.",
      modulesDescription:
        "Nützliche Services für das Fally-Ipupa-Wochenende mit weniger Stress: Fahrten, Beauty, Fotos, Partys, Paris-Guide und mehr.",
      proEyebrow: "Für Profis",
      proTitleLine1: "Bietest du",
      proTitleLine2: "einen Service an?",
      proDescription:
        "Make-up, Haare, Foto, Transport oder Logistik: werde sichtbar für Fans von Fally Ipupa.",
      proButton: "Partner werden",
      quickLinks: "Schnellzugriff",
      stats: {
        audience: "offizielle Termine",
        city: "öffentlicher Preis ab",
        dates: "wichtiges Wochenende",
      },
      modules: [
        {
          title: "Fahrten",
          eyebrow: "Mitfahren",
          description: "Diaspora-Fahrten bis zum Stade de France.",
          features: [
            "Abfahrten aus Brüssel, London, Lyon...",
            "Freie Plätze in Echtzeit",
            "WhatsApp bis zur Freischaltung verborgen",
            "Backup mit RER B/D, Metro 12/13/14",
          ],
          cta: "Fahrten ansehen",
        },
        {
          title: "Dienstleister",
          eyebrow: "Beauty & Services",
          description:
            "Make-up-Artists, Friseure, Barbiere und Fotografen aus der Diaspora.",
          features: [
            "Make-up für schwarze und gemischte Haut",
            "Friseure, Flechter und Barbiere",
            "Fotografen für Shootings und Events",
            "Preise sichtbar, Profile geprüft",
          ],
          cta: "Dienstleister finden",
        },
        {
          title: "Afters",
          eyebrow: "Partys nach dem Konzert",
          description: "Die besten Partys in den Nächten vom 2. und 3. Mai.",
          features: [
            "Events vom Team geprüft",
            "Direkter externer Ticketlink",
            "Eintrittspreis und Location-Infos",
            "Hinweise auf neue Partys",
          ],
          cta: "Afters ansehen",
        },
        {
          title: "Paris Guide",
          eyebrow: "Kompletter Guide",
          description: "Alles für Paris mit weniger Stress.",
          features: [
            "RER B La Plaine und RER D Saint-Denis",
            "Metro 12, 13, 14 und Tram T1/T8",
            "Offizielle Parkplätze ab 29 EUR reservieren",
            "Taschen max. 15 L, keine Koffer",
          ],
          cta: "Guide öffnen",
        },
        {
          title: "Merch",
          eyebrow: "Mode & Accessoires",
          description: "Diaspora-Mode, Pagne und Accessoires.",
          features: [
            "Sape und Congo-Lifestyle",
            "Moderne afrikanische Mode",
            "Vom Team geprüfte Verkäufer",
            "Shop-Link oder direkter Kontakt",
          ],
          cta: "Merch entdecken",
        },
        {
          title: "Fotografen",
          eyebrow: "Erinnerungen",
          description: "Halte die besten Momente des Wochenendes fest.",
          features: [
            "Professionelle Diaspora-Fotografen",
            "Schnelle Shootings davor/danach",
            "Event-Pakete",
            "Portfolio im Profil sichtbar",
          ],
          cta: "Fotografen ansehen",
        },
      ],
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
        "Mboka Hub gibt dir eine einfache Bühne, um Fans vor ihrem Paris-Wochenende zu erreichen.",
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
      updated: "Zuletzt aktualisiert um 22:50",
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Wir bleiben *verbunden*.",
      description:
        "Frage zu Fahrt, Zahlung oder Profi-Profil? Das Mboka-Hub-Team antwortet dir.",
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
        services: "Services",
        photographers: "Fotografen",
        proSpace: "Pro-Bereich",
        partnerships: "Partnerschaften",
        ads: "Werbung",
        team: "Team",
        contact: "Kontakt",
        faq: "FAQ",
      },
    },
  },
  nl: {
    common: {
      nav: {
        home: "Home",
        services: "Diensten",
        quiz: "Quiz",
        game: "Games",
        contact: "Contact",
      },
      vipCta: "VIP worden",
      menu: "Navigatie",
      openMenu: "Menu openen",
      seeMore: "Meer zien",
    },
    home: {
      heroTitle: "Mboka Hub",
      heroSubtitle:
        "Plan het concertweekend van Fally Ipupa in het Stade de France: ritten, dienstverleners, afters, merch, game en geverifieerde tips.",
      primaryCta: "Bekijk ritten",
      proCta: "Ik ben pro",
      prestationsLabel: "Diensten",
      modulesTitleLine1: "Alles op",
      modulesTitleLine2: "één plek.",
      modulesDescription:
        "Handige diensten voor het Fally Ipupa-weekend met minder stress: ritten, beauty, foto's, feesten, Parijs-gids en meer.",
      proEyebrow: "Voor pros",
      proTitleLine1: "Bied jij",
      proTitleLine2: "een dienst aan?",
      proDescription:
        "Make-up, haar, foto, vervoer of logistiek: word zichtbaar voor fans van Fally Ipupa.",
      proButton: "Partner worden",
      quickLinks: "Snelle toegang",
      stats: {
        audience: "officiële data",
        city: "publieke prijs vanaf",
        dates: "belangrijk weekend",
      },
      modules: [
        {
          title: "Ritten",
          eyebrow: "Carpool",
          description: "Diaspora-ritten naar het Stade de France.",
          features: [
            "Vertrek uit Brussel, Londen, Lyon...",
            "Vrije plaatsen in realtime",
            "WhatsApp verborgen tot ontgrendeling",
            "Backup met RER B/D, metro 12/13/14",
          ],
          cta: "Bekijk ritten",
        },
        {
          title: "Dienstverleners",
          eyebrow: "Beauty & services",
          description:
            "Make-up artists, kappers, barbiers en fotografen uit de diaspora.",
          features: [
            "Make-up voor zwarte en gemengde huid",
            "Kappers, vlechtspecialisten en barbiers",
            "Fotografen voor shoots en events",
            "Prijzen zichtbaar, profielen gecheckt",
          ],
          cta: "Vind een dienstverlener",
        },
        {
          title: "Afters",
          eyebrow: "Feesten na het concert",
          description: "De beste feesten in de nachten van 2 en 3 mei.",
          features: [
            "Events gecheckt door het team",
            "Directe externe ticketlink",
            "Entreeprijs en locatie-info",
            "Alerts voor nieuwe feesten",
          ],
          cta: "Bekijk afters",
        },
        {
          title: "Parijs gids",
          eyebrow: "Complete gids",
          description: "Alles voor Parijs met minder stress.",
          features: [
            "RER B La Plaine en RER D Saint-Denis",
            "Metro 12, 13, 14 en tram T1/T8",
            "Officiële parking reserveren vanaf EUR 29",
            "Tassen max. 15 L, geen koffers",
          ],
          cta: "Open de gids",
        },
        {
          title: "Merch",
          eyebrow: "Mode & accessoires",
          description: "Diaspora-mode, pagne en accessoires.",
          features: [
            "Sape en Congo-lifestyle",
            "Moderne Afrikaanse mode",
            "Verkopers gecheckt door het team",
            "Shoplink of direct contact",
          ],
          cta: "Ontdek merch",
        },
        {
          title: "Fotografen",
          eyebrow: "Herinneringen",
          description: "Leg de beste momenten van het weekend vast.",
          features: [
            "Professionele diaspora-fotografen",
            "Snelle shoots voor/na",
            "Eventpakketten",
            "Portfolio zichtbaar op profiel",
          ],
          cta: "Bekijk fotografen",
        },
      ],
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
        "Mboka Hub geeft je een eenvoudige etalage om fans te bereiken die hun Parijs-weekend voorbereiden.",
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
      updated: "Laatst bijgewerkt om 22:50",
    },
    contact: {
      eyebrow: "Contact",
      title: "We blijven *verbonden*.",
      description:
        "Vraag over een rit, betaling of pro-profiel? Het Mboka Hub-team antwoordt.",
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
      },
    },
  },
} as const;

export type Dictionary = (typeof nls)[Locale];
