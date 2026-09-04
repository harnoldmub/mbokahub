export type TrajetDemo = {
  id: string;
  villeDepart: string;
  villeArrivee?: string;
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
      "Des navettes privées sont régulièrement organisées par la communauté depuis Matonge (Bruxelles), Château-Rouge et Barbès. Consulter les groupes WhatsApp et les annonces sur Nevent.",
    address: "Points de départ annoncés sur Nevent",
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
    category: "Où dormir",
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
    category: "Où dormir",
    name: "Porte de la Chapelle — Ibis, Mercure",
    description:
      "Secteur bien connecté via le Métro 12 et le T1 vers Saint-Denis. Hôtels de chaîne fiables avec bonne connexion transport. Légèrement moins cher que les hôtels collés au stade.",
    address: "Porte de la Chapelle, Paris 18e",
    tags: ["Métro 12", "connexion T1", "Paris"],
    price: "90–160 € / nuit",
  },
  {
    id: "hotels-gare-du-nord",
    category: "Où dormir",
    name: "Gare du Nord / Paris 10e",
    description:
      "Nombreux hôtels avec connexion directe RER B ou D vers le stade (10 min). Idéal si vous arrivez de l'Eurostar, du Thalys ou d'un TGV province. Quartier animé et bien desservi.",
    address: "Gare du Nord, Paris 10e",
    tags: ["Gare du Nord", "Eurostar", "RER B/D"],
    price: "100–200 € / nuit",
  },
  {
    id: "hotels-saint-denis-centre",
    category: "Où dormir",
    name: "Centre-ville Saint-Denis",
    description:
      "Hôtels indépendants proches de la Basilique. Accès stade en 10-15 min à pied. Proches des restos africains de Saint-Denis — bonne option pour s'immerger dans l'ambiance locale.",
    address: "Centre-ville, Saint-Denis (93)",
    tags: ["central", "indépendant", "Saint-Denis"],
    price: "70–120 € / nuit",
  },

  // ── PARKINGS ────────────────────────────────────────────────────────────
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
    name: "Zones bleues gratuites — Dimanche et jours fériés",
    description:
      "Dans Paris intra-muros, le stationnement en zone bleue est gratuit le dimanche et les jours fériés. Vérifier les panneaux selon l'arrondissement.",
    address: "Paris intra-muros (vérifier panneaux locaux)",
    tags: ["gratuit", "dimanche", "zone bleue"],
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
