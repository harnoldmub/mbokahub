export type TrajetDemo = {
  id: string;
  villeDepart: string;
  paysDepart: string;
  dateLabel: string;
  heureDepart: string;
  placesDispo: number;
  placesTotal: number;
  prix: number;
  vehicule: string;
  note: string;
  whatsappMasked: string;
  isBoosted?: boolean;
};

export type ProDemo = {
  id: string;
  category: "MAQUILLEUSE" | "COIFFEUR" | "BARBIER" | "PHOTOGRAPHE";
  displayName: string;
  city: string;
  country: string;
  specialities: string[];
  priceRange: string;
  rating: number;
  reviewsCount: number;
  whatsappMasked: string;
  isPremium?: boolean;
  isVerified?: boolean;
};

export type AfterDemo = {
  slug: string;
  name: string;
  dateLabel: string;
  venue: string;
  city: string;
  priceFrom: number;
  ticketUrl: string;
  isBoosted?: boolean;
};

export type ParisClassicDemo = {
  id: string;
  category: string;
  name: string;
  description: string;
  address: string;
  tags: string[];
  isSponsored?: boolean;
  highlight?: boolean;
  phone?: string;
  link?: string;
  tip?: string;
  price?: string;
};

export const demoTrajets: TrajetDemo[] = [
  {
    id: "bruxelles-van-01",
    villeDepart: "Bruxelles",
    paysDepart: "Belgique",
    dateLabel: "Samedi 2 mai",
    heureDepart: "08:30",
    placesDispo: 5,
    placesTotal: 8,
    prix: 39,
    vehicule: "Van 9 places",
    note: "Départ Bruxelles, trajet direct jusqu'au Stade de France.",
    whatsappMasked: "+32 4•• •• •• ••",
    isBoosted: true,
  },
  {
    id: "londres-bus-01",
    villeDepart: "Londres",
    paysDepart: "Royaume-Uni",
    dateLabel: "Vendredi 1 mai",
    heureDepart: "22:00",
    placesDispo: 14,
    placesTotal: 30,
    prix: 79,
    vehicule: "Bus privé",
    note: "Traversée de nuit, retour prévu dimanche après-midi.",
    whatsappMasked: "+44 7••• ••••••",
  },
  {
    id: "lyon-car-01",
    villeDepart: "Lyon",
    paysDepart: "France",
    dateLabel: "Samedi 2 mai",
    heureDepart: "06:15",
    placesDispo: 2,
    placesTotal: 4,
    prix: 35,
    vehicule: "SUV",
    note: "Deux arrêts possibles sur l'A6, bagages cabine uniquement.",
    whatsappMasked: "+33 6•• •• •• ••",
  },
  {
    id: "lille-van-01",
    villeDepart: "Lille",
    paysDepart: "France",
    dateLabel: "Dimanche 3 mai",
    heureDepart: "09:00",
    placesDispo: 6,
    placesTotal: 8,
    prix: 25,
    vehicule: "Mercedes Vito",
    note: "Direct Stade de France pour le deuxième soir. Ambiance assurée !",
    whatsappMasked: "+33 7•• •• •• ••",
    isBoosted: true,
  },
];

export const demoPros: ProDemo[] = [
  {
    id: "studio-liputa",
    category: "MAQUILLEUSE",
    displayName: "Studio Liputa",
    city: "Saint-Denis",
    country: "France",
    specialities: ["glow peau noire", "look soirée", "shoot express"],
    priceRange: "45-90 EUR",
    rating: 4.8,
    reviewsCount: 31,
    whatsappMasked: "+33 7•• •• •• ••",
    isPremium: true,
  },
  {
    id: "barber-matonge-paris",
    category: "BARBIER",
    displayName: "Barber Matonge Paris",
    city: "Chateau-Rouge",
    country: "France",
    specialities: ["degrade", "barbe", "line-up"],
    priceRange: "20-45 EUR",
    rating: 4.6,
    reviewsCount: 18,
    whatsappMasked: "+33 6•• •• •• ••",
  },
  {
    id: "tresses-ndaku",
    category: "COIFFEUR",
    displayName: "Tresses Ndaku",
    city: "Strasbourg-Saint-Denis",
    country: "France",
    specialities: ["tresses", "lace", "retouches"],
    priceRange: "35-120 EUR",
    rating: 4.7,
    reviewsCount: 24,
    whatsappMasked: "+33 7•• •• •• ••",
    isPremium: true,
  },
  {
    id: "mboka-vision",
    category: "PHOTOGRAPHE",
    displayName: "Mboka Vision",
    city: "Paris",
    country: "France",
    specialities: ["portrait", "event", "retouche"],
    priceRange: "80-150 EUR",
    rating: 4.9,
    reviewsCount: 12,
    whatsappMasked: "+33 6•• •• •• ••",
    isPremium: true,
  },
];

export const demoAfters: AfterDemo[] = [
  {
    slug: "nuit-afro-saint-denis",
    name: "Nuit afro Saint-Denis",
    dateLabel: "Samedi 2 mai, 23:30",
    venue: "Secret Palace (Proche Stade)",
    city: "Saint-Denis",
    priceFrom: 25,
    ticketUrl: "https://www.eventbrite.com/",
    isBoosted: true,
  },
  {
    slug: "rumba-club-paris",
    name: "Rumba Club Paris",
    dateLabel: "Vendredi 1 mai, 22:00",
    venue: "Paris Est",
    city: "Paris",
    priceFrom: 15,
    ticketUrl: "https://shotgun.live/",
  },
  {
    slug: "cloture-stade-denis",
    name: "Clôture Royale",
    dateLabel: "Dimanche 3 mai, 23:30",
    venue: "Secret Location Saint-Denis",
    city: "Saint-Denis",
    priceFrom: 25,
    ticketUrl: "https://www.eventbrite.com/",
    isBoosted: true,
  },
];

export const parisClassics: ParisClassicDemo[] = [
  // ── TRANSPORTS ────────────────────────────────────────────────────────────
  {
    id: "rer-b-saint-denis",
    category: "Transports",
    name: "RER B — Saint-Denis Université",
    description:
      "La ligne la plus rapide depuis le centre de Paris. Direction Mitry-Mory ou CDG. Environ 25 min depuis Châtelet, 10 min depuis Gare du Nord. Trains renforcés les soirs de concert.",
    address: "Station Saint-Denis Université (RER B) — zone 3",
    tags: ["recommandé", "direct", "RER B"],
    highlight: true,
    tip: "Valider son ticket avant de monter — contrôles fréquents. Titre zone 1-3 requis.",
  },
  {
    id: "rer-d-stade",
    category: "Transports",
    name: "RER D — Stade de France Saint-Denis",
    description:
      "Arrêt direct face au stade. Idéal depuis Gare de Lyon, Gare du Nord ou Châtelet. Fréquence renforcée les soirs de grand concert mais attente post-concert garantie.",
    address: "Station Stade de France – Saint-Denis (RER D)",
    tags: ["direct", "retour", "RER D"],
    tip: "Après le concert, attente de 20-40 min en file — rester calme et s'éloigner de la foule en attendant.",
  },
  {
    id: "tramway-t1",
    category: "Transports",
    name: "Tramway T1 — Connexion nord Paris",
    description:
      "Relie la Porte de la Chapelle (Métro 12) à Saint-Denis. Utile si vous logez dans le nord de Paris ou venez de Porte de Clichy. Moins bondé que le RER après le concert.",
    address: "Arrêt Saint-Denis Stade de France (T1)",
    tags: ["T1", "nord Paris", "alternatif"],
  },
  {
    id: "metro-ligne-13",
    category: "Transports",
    name: "Métro Ligne 13 → Basilique",
    description:
      "Terminus à Basilique de Saint-Denis. Compter 15-20 min à pied jusqu'au stade, ou correspondance bus 153/255. Bonne option pour ceux qui veulent éviter les foules sur le RER.",
    address: "Station Basilique de Saint-Denis (Ligne 13)",
    tags: ["Métro 13", "alternatif", "marche"],
  },
  {
    id: "vtc-zone",
    category: "Transports",
    name: "VTC & Taxis — Stratégie post-concert",
    description:
      "Zone de dépose officielle côté rue du Cornillon. Éviter de commander un VTC juste à la fin — attente 30-60 min garantie. Meilleure stratégie : prendre le RER jusqu'à Gare du Nord puis commander.",
    address: "Rue du Cornillon, Saint-Denis (zone VTC officielle)",
    tags: ["VTC", "Uber", "taxi", "anticiper"],
    tip: "Commander votre Uber/Bolt depuis la station RER, jamais depuis le parvis du stade.",
  },
  {
    id: "navette-communautaire",
    category: "Transports",
    name: "Navettes & covoiturages communautaires",
    description:
      "Des navettes privées sont régulièrement organisées par la communauté depuis Matonge (Bruxelles), Château-Rouge et Barbès. Consulter les groupes WhatsApp et les annonces sur Mboka Hub.",
    address: "Points de départ annoncés sur Mboka Hub",
    tags: ["navette", "communauté", "covoiturage"],
  },

  // ── RESTOS & MARCHÉS AFRICAINS ────────────────────────────────────────────
  {
    id: "chateau-rouge-quartier",
    category: "Restos & marchés africains",
    name: "Quartier Château-Rouge",
    description:
      "Le cœur de la diaspora africaine à Paris. Rue Dejean, rue Poulet : épiceries, traiteurs, restaurants congolais, camerounais, sénégalais. Le quartier sera en ébullition le week-end du concert.",
    address: "Château-Rouge, Paris 18e — M° Château Rouge (ligne 4)",
    tags: ["incontournable", "congolais", "marché"],
    highlight: true,
    tip: "Arriver tôt le matin — le samedi après-midi, les files d'attente dans les restos seront longues.",
  },
  {
    id: "rue-dejean-restos",
    category: "Restos & marchés africains",
    name: "Rue Dejean — Restaurants & traiteurs",
    description:
      "Spécialités congolaises (pondu, fumbwa, poisson braisé, makemba), camerounaises et ivoiriennes. Plusieurs adresses de restauration rapide et familiale autour de 10-20€ le plat.",
    address: "Rue Dejean, Paris 18e",
    tags: ["congolais", "familial", "10-20€"],
    price: "10–20 €",
  },
  {
    id: "barbes-snacks",
    category: "Restos & marchés africains",
    name: "Barbès — Snacks & plats à emporter",
    description:
      "Boulevard Barbès et ses environs offrent une multitude de snacks africains, tacos et plats chauds à emporter. Ouvert tard le soir, idéal pour le retour après concert.",
    address: "Boulevard Barbès, Paris 18e — M° Barbès-Rochechouart",
    tags: ["snack", "ouvert tard", "abordable"],
    price: "5–12 €",
  },
  {
    id: "saint-denis-restos",
    category: "Restos & marchés africains",
    name: "Restos africains de Saint-Denis",
    description:
      "Rue de la République et alentours concentrent plusieurs restaurants afro-caribéens. Idéal si vous restez dans le secteur stade pour manger avant ou après.",
    address: "Rue de la République, Saint-Denis",
    tags: ["Saint-Denis", "proche stade", "afro"],
  },
  {
    id: "epiceries-afro",
    category: "Restos & marchés africains",
    name: "Épiceries africaines — À emporter",
    description:
      "Plusieurs épiceries africaines dans Château-Rouge proposent plats préparés (ndolé, maboké, makemba), boissons et snacks. Parfait pour préparer sa glacière pour le stade.",
    address: "Rue Poulet / Rue Dejean, Paris 18e",
    tags: ["épicerie", "à emporter", "économique"],
    price: "3–10 €",
  },

  // ── HÔTELS ────────────────────────────────────────────────────────────────
  {
    id: "hotels-la-plaine",
    category: "Hôtels proches stade",
    name: "La Plaine Saint-Denis — Ibis, B&B, Campanile",
    description:
      "La zone La Plaine Saint-Denis concentre plusieurs hôtels budget à 5-10 min à pied ou en T1 du stade. Les nuits du 2 et 3 mai sont en rupture très tôt — réserver immédiatement.",
    address: "La Plaine Saint-Denis (93)",
    tags: ["budget", "proche stade", "pratique"],
    highlight: true,
    price: "80–140 € / nuit",
    tip: "Les hôtels proches du stade se réservent des mois à l'avance pour les grands concerts. Ne pas attendre.",
  },
  {
    id: "hotels-porte-chapelle",
    category: "Hôtels proches stade",
    name: "Porte de la Chapelle — Ibis, Mercure",
    description:
      "Secteur bien connecté via le Métro 12 et le T1 vers Saint-Denis. Hôtels de chaîne fiables avec bonne connexion transport. Légèrement moins cher que les hôtels collés au stade.",
    address: "Porte de la Chapelle, Paris 18e",
    tags: ["Métro 12", "connexion T1", "Paris"],
    price: "90–160 € / nuit",
  },
  {
    id: "hotels-gare-du-nord",
    category: "Hôtels proches stade",
    name: "Gare du Nord / Paris 10e",
    description:
      "Nombreux hôtels avec connexion directe RER B ou D vers le stade (10 min). Idéal si vous arrivez de l'Eurostar, du Thalys ou d'un TGV province. Quartier animé et bien desservi.",
    address: "Gare du Nord, Paris 10e",
    tags: ["Gare du Nord", "Eurostar", "RER B/D"],
    price: "100–200 € / nuit",
  },
  {
    id: "hotels-saint-denis-centre",
    category: "Hôtels proches stade",
    name: "Centre-ville Saint-Denis",
    description:
      "Hôtels indépendants proches de la Basilique. Accès stade en 10-15 min à pied. Proches des restos africains de Saint-Denis — bonne option pour s'immerger dans l'ambiance locale.",
    address: "Centre-ville, Saint-Denis (93)",
    tags: ["central", "indépendant", "Saint-Denis"],
    price: "70–120 € / nuit",
  },

  // ── PARKINGS ────────────────────────────────────────────────────────────
  {
    id: "parking-stade-officiel",
    category: "Parkings",
    name: "Parkings officiels Stade de France",
    description:
      "Plusieurs parkings réservables en ligne sur stadefrance.com. Capacité très limitée — à réserver dès maintenant. Accès restreint 3h avant le concert, plan de circulation modifié.",
    address: "Abords du Stade de France, Saint-Denis",
    tags: ["officiel", "réservation", "limité"],
    highlight: true,
    link: "https://www.stadefrance.com",
    tip: "Arriver minimum 2h avant le début pour éviter les embouteillages sur l'A1 et le boulevard Anatole France.",
  },
  {
    id: "parking-park-and-ride",
    category: "Parkings",
    name: "Park+Ride — Porte de la Villette",
    description:
      "Garer la voiture au parking Porte de la Villette (Paris 19e), puis Métro 7 vers Gare du Nord, puis RER B ou D vers le stade. Évite totalement les embouteillages autour de Saint-Denis.",
    address: "Porte de la Villette, Paris 19e",
    tags: ["Park+Ride", "Métro 7", "stratégique"],
    tip: "La meilleure stratégie voiture : ne pas aller jusqu'au stade en voiture.",
  },
  {
    id: "parking-dimanche-gratuit",
    category: "Parkings",
    name: "Zones bleues gratuites — Dimanche 3 mai",
    description:
      "Dans Paris intra-muros, le stationnement en zone bleue est gratuit le dimanche et jours fériés. Le 3 mai (dimanche) : stationnement gratuit dans Paris. Vérifier les panneaux selon l'arrondissement.",
    address: "Paris intra-muros (vérifier panneaux locaux)",
    tags: ["gratuit", "dimanche", "zone bleue"],
  },

  // ── INFOS STADE ──────────────────────────────────────────────────────────
  {
    id: "stade-acces-consignes",
    category: "Infos stade",
    name: "Stade de France — Règles d'accès",
    description:
      "Capacité 80 000 places. Portiques de sécurité obligatoires : arriver 1h30 à 2h avant. Interdits : bouteilles en verre, canettes, valises > cabin size, drones, appareils photo avec objectif amovible. Consigne bagages disponible à l'extérieur contre paiement.",
    address: "Rue Francis de Pressensé, Saint-Denis (93)",
    tags: ["sécurité", "accès", "essentiel"],
    highlight: true,
    tip: "L'entrée indiquée sur votre billet est obligatoire — inutile d'essayer une autre porte.",
  },
  {
    id: "stade-trajet-recommande",
    category: "Infos stade",
    name: "Trajets recommandés vers le stade",
    description:
      "Depuis Paris centre : RER B ou D direct. Depuis Bruxelles/Londres : Eurostar → Gare du Nord → RER B (10 min). Depuis province : TGV → Gare du Nord ou Gare de Lyon → RER. Depuis aéroports CDG/Orly : RER B direct ou correspondance.",
    address: "Stade de France, Saint-Denis",
    tags: ["plan", "trajet", "international"],
  },
  {
    id: "stade-checklist",
    category: "Infos stade",
    name: "Checklist pour le concert",
    description:
      "Billet téléchargé en mode offline (réseau saturé dans le stade). Pièce d'identité. Carte bancaire sans contact (paiements inside uniquement). Coupe-vent léger (mai peut être frais le soir à Saint-Denis). Chargeur portable. Oreilles protégées si vous avez des enfants.",
    address: "Stade de France",
    tags: ["checklist", "conseils", "à prévoir"],
  },

  // ── NUMÉROS UTILES & URGENCES ─────────────────────────────────────────────
  {
    id: "urgences-112",
    category: "Numéros utiles",
    name: "112 — Urgences européen (tous secours)",
    description:
      "Le 112 fonctionne depuis n'importe quel téléphone, même sans réseau ou carte SIM, pour joindre pompiers, SAMU ou police. À mémoriser absolument.",
    address: "Partout en France et en Europe",
    tags: ["urgence", "essentiel"],
    highlight: true,
    phone: "112",
  },
  {
    id: "samu-15",
    category: "Numéros utiles",
    name: "15 — SAMU (urgences médicales)",
    description:
      "Malaise, blessure grave, urgence médicale. Le SAMU coordonne les secours médicaux et peut envoyer une ambulance ou vous orienter vers le poste de secours du stade.",
    address: "Partout en France",
    tags: ["médical", "SAMU"],
    phone: "15",
  },
  {
    id: "police-17",
    category: "Numéros utiles",
    name: "17 — Police Secours",
    description:
      "Vol, agression, incident de sécurité. Commissariat central de Saint-Denis : 4 rue Émile Cornet. La police sera en renfort massif les soirs du 2 et 3 mai.",
    address: "4 rue Émile Cornet, Saint-Denis",
    tags: ["police", "sécurité"],
    phone: "17",
  },
  {
    id: "pompiers-18",
    category: "Numéros utiles",
    name: "18 — Pompiers",
    description:
      "Incendie, accident, secours à personne. Un poste avancé des pompiers est présent sur le site du stade lors des grands concerts.",
    address: "Partout en France",
    tags: ["pompiers", "secours"],
    phone: "18",
  },
  {
    id: "ratp-info",
    category: "Numéros utiles",
    name: "RATP Info — Perturbations transports",
    description:
      "Vérifier les perturbations en temps réel sur ratp.fr ou l'appli RATP/Île-de-France Mobilités avant de partir. Les soirées de concert peuvent entraîner des interruptions ou retards sur les RER.",
    address: "ratp.fr — Appli IDFM",
    tags: ["RATP", "perturbations", "appli"],
    phone: "3246",
    link: "https://www.ratp.fr",
  },
  {
    id: "pharmacie-garde",
    category: "Numéros utiles",
    name: "Pharmacies de garde",
    description:
      "Pour trouver la pharmacie de garde la nuit : appeler le 3237 ou consulter le site pharma-urgence.fr. Pharmacie du Parvis ouverte 24h/24 à Saint-Denis. Pharmacie des Halles (Paris 4e) : ouverte la nuit.",
    address: "Saint-Denis centre / Paris 4e (Pharmacie des Halles)",
    tags: ["pharmacie", "garde", "nuit"],
    phone: "3237",
  },
];
