"use client";

import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Flame,
  Music,
  RotateCcw,
  Share2,
  Star,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const artwork = (url: string) =>
  url.replace("/100x100bb.jpg", "/600x600bb.jpg");

const ALBUMS = {
  droit: {
    title: "Droit chemin",
    year: "2006",
    cover: artwork(
      "https://is1-ssl.mzstatic.com/image/thumb/Music/b2/e5/a9/dj.jxgzxkxt.jpg/100x100bb.jpg",
    ),
  },
  arsenal: {
    title: "Arsenal de belles melodies",
    year: "2009",
    cover: artwork(
      "https://is1-ssl.mzstatic.com/image/thumb/Music/ce/ed/12/mzi.pebybcoo.jpg/100x100bb.jpg",
    ),
  },
  power: {
    title: "Power Kosa Leka",
    year: "2013",
    cover: artwork(
      "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/63/e7/40/63e740ef-b22e-9217-a770-2966240395d6/5060281613868_cover.jpg/100x100bb.jpg",
    ),
  },
  tokooos: {
    title: "Tokooos",
    year: "2017",
    cover: artwork(
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4e/c0/e0/4ec0e064-ea1d-8dca-d37d-698b9fce9290/190295848064.jpg/100x100bb.jpg",
    ),
  },
  control: {
    title: "Control",
    year: "2018",
    cover: artwork(
      "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/17/a5/67/17a567d4-0f1b-7095-442e-16556f2191e9/190295532628.jpg/100x100bb.jpg",
    ),
  },
  formule: {
    title: "Formule 7",
    year: "2022",
    cover: artwork(
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8b/63/8c/8b638cf8-865e-2432-ac32-1907f4409aca/5054197450891.jpg/100x100bb.jpg",
    ),
  },
} as const;

const DISCOGRAPHY = [
  ALBUMS.droit,
  ALBUMS.arsenal,
  ALBUMS.power,
  ALBUMS.tokooos,
  ALBUMS.control,
  ALBUMS.formule,
] as const;

// ── 100-question bank ───────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  // ── IDENTITÉ ─────────────────────────────────────────────────────────────────
  {
    id: 1,
    question: "Quel est le vrai nom de famille de Fally Ipupa ?",
    options: ["Mutuani", "Diamond Gode", "Nsimba", "Ngimbi"],
    correct: 2,
    anecdote:
      "Son vrai nom est Fally Ipupa Nsimba. Il a grandi dans la commune de Bandalungwa, à Kinshasa, avant de conquérir le monde.",
    category: "Identité",
    album: ALBUMS.droit,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 2,
    question: "Quel est le surnom légendaire de Fally Ipupa ?",
    options: [
      "Le Saphir de Kinshasa",
      "Diamond Boy",
      "Power Icarius",
      "Le Lion du Congo",
    ],
    correct: 2,
    anecdote:
      "« Power Icarius » est le surnom qui incarne la puissance vocale et l'énergie scénique incomparable de Fally.",
    category: "Identité",
    album: ALBUMS.power,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 3,
    question: "Quelle est la nationalité de Fally Ipupa ?",
    options: [
      "Congolaise (Congo-Brazzaville)",
      "Camerounaise",
      "Congolaise (RD Congo)",
      "Ivoirienne",
    ],
    correct: 2,
    anecdote:
      "Fally Ipupa est Congolais de la République Démocratique du Congo (RDC), anciennement appelée Zaïre.",
    category: "Identité",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 4,
    question: "À quelle date Fally Ipupa est-il né ?",
    options: [
      "14 janvier 1980",
      "24 novembre 1975",
      "14 décembre 1977",
      "3 mars 1982",
    ],
    correct: 2,
    anecdote:
      "Fally Ipupa Nsimba est né le 14 décembre 1977 à Kinshasa, en RD Congo.",
    category: "Identité",
    album: ALBUMS.droit,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 5,
    question: "Dans quelle commune de Kinshasa Fally Ipupa a-t-il grandi ?",
    options: ["Gombe", "Bandalungwa", "Limete", "Ndjili"],
    correct: 1,
    anecdote:
      "Fally Ipupa Nsimba passe son enfance dans la commune de Bandalungwa, intégrée à Kinshasa, capitale de la RD Congo.",
    category: "Biographie",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 6,
    question: "En quelle décennie Fally Ipupa naît-il ?",
    options: [
      "Années 1960",
      "Années 1970",
      "Années 1980",
      "Années 1990",
    ],
    correct: 1,
    anecdote:
      "Fally est né en 1977, en pleine période de gloire de la musique congolaise des années 70.",
    category: "Biographie",
    album: ALBUMS.droit,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 7,
    question: "Dans quelle ville Fally Ipupa est-il né ?",
    options: ["Brazzaville", "Lubumbashi", "Kinshasa", "Lomé"],
    correct: 2,
    anecdote:
      "Fally est né et a grandi à Kinshasa, la capitale de la République Démocratique du Congo.",
    category: "Biographie",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 8,
    question: "Quel pays est la RD Congo, patrie de Fally ?",
    options: [
      "Un pays d'Afrique de l'Ouest",
      "Un pays d'Afrique centrale, anciennement le Zaïre",
      "Un pays d'Afrique australe",
      "Un pays d'Afrique du Nord",
    ],
    correct: 1,
    anecdote:
      "La RD Congo est un pays d'Afrique centrale, anciennement appelé Zaïre. Sa capitale Kinshasa est le berceau de la rumba congolaise.",
    category: "Biographie",
    album: ALBUMS.power,
    image: "/images/fally/fally-global-citizen.jpg",
  },

  // ── CARRIÈRE ─────────────────────────────────────────────────────────────────
  {
    id: 9,
    question:
      "Avec quel groupe Fally a-t-il débuté avant sa carrière solo ?",
    options: [
      "Wenge Musica BCBG",
      "Extra Musica",
      "Victoria Eleison",
      "Quartier Latin de Koffi Olomidé",
    ],
    correct: 3,
    anecdote:
      "Fally a brillé dans le Quartier Latin International de Koffi Olomidé à la fin des années 1990 et au début des années 2000, avant son envol solo en 2006.",
    category: "Carrière",
    album: ALBUMS.power,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 10,
    question:
      "Qui était le patron du groupe dans lequel Fally a fait ses débuts ?",
    options: ["Werrason", "Papa Wemba", "Koffi Olomidé", "Awilo Longomba"],
    correct: 2,
    anecdote:
      "Koffi Olomidé, légende de la rumba congolaise, a été le mentor de Fally au sein du Quartier Latin International.",
    category: "Carrière",
    album: ALBUMS.droit,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 11,
    question: "En quelle année Fally Ipupa se lance-t-il en solo ?",
    options: ["2003", "2004", "2005", "2006"],
    correct: 3,
    anecdote:
      "Fally quitte le Quartier Latin et sort son premier album solo « Droit Chemin » en 2006, lançant sa carrière internationale.",
    category: "Carrière",
    album: ALBUMS.droit,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 12,
    question: "Qu'est-ce que le « Quartier Latin » dans la carrière de Fally ?",
    options: [
      "Un quartier de Kinshasa où il a grandi",
      "Son premier label de musique",
      "Le groupe de rumba congolaise de Koffi Olomidé",
      "Le nom de son premier concert à Paris",
    ],
    correct: 2,
    anecdote:
      "Le Quartier Latin International est le groupe légendaire fondé par Koffi Olomidé — l'école musicale qui a formé Fally avant son envol solo.",
    category: "Carrière",
    album: ALBUMS.droit,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 13,
    question: "Combien d'albums studio Fally Ipupa a-t-il sortis entre 2006 et 2022 ?",
    options: ["4", "5", "6", "7"],
    correct: 2,
    anecdote:
      "Fally a sorti 6 albums studio : Droit Chemin (2006), Arsenal (2009), Power Kosa Leka (2013), Tokooos (2017), Control (2018), Formule 7 (2022).",
    category: "Discographie",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },

  // ── DISCOGRAPHIE ─────────────────────────────────────────────────────────────
  {
    id: 14,
    question: "Quel est le titre du premier album solo de Fally Ipupa ?",
    options: [
      "Arsenal de Belles Mélodies",
      "Droit Chemin",
      "Power Kosa Leka",
      "Tokooos",
    ],
    correct: 1,
    anecdote:
      "« Droit Chemin » sort en 2006 et pose la première pierre de sa carrière solo, marquant sa rupture avec le Quartier Latin.",
    category: "Discographie",
    album: ALBUMS.droit,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 15,
    question: "En quelle année sort « Droit Chemin », le premier album de Fally ?",
    options: ["2004", "2005", "2006", "2007"],
    correct: 2,
    anecdote:
      "« Droit Chemin » est sorti en 2006, inaugurant la discographie solo de Fally Ipupa Nsimba.",
    category: "Discographie",
    album: ALBUMS.droit,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 16,
    question: "Quel est le deuxième album studio de Fally Ipupa ?",
    options: [
      "Power Kosa Leka",
      "Tokooos",
      "Arsenal de Belles Mélodies",
      "Control",
    ],
    correct: 2,
    anecdote:
      "« Arsenal de Belles Mélodies » sort en 2009 et confirme le statut de superstar international de Fally.",
    category: "Discographie",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 17,
    question: "En quelle année sort « Arsenal de Belles Mélodies » ?",
    options: ["2007", "2008", "2009", "2010"],
    correct: 2,
    anecdote:
      "Le deuxième album de Fally, « Arsenal de Belles Mélodies », est sorti en 2009.",
    category: "Discographie",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 18,
    question: "Quel est le troisième album de Fally Ipupa ?",
    options: ["Tokooos", "Power Kosa Leka", "Control", "Formule 7"],
    correct: 1,
    anecdote:
      "« Power Kosa Leka » (2013) est le troisième album de Fally. Le titre signifie « Power ne se trompe pas » en lingala.",
    category: "Discographie",
    album: ALBUMS.power,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 19,
    question: "En quelle année sort « Power Kosa Leka » ?",
    options: ["2011", "2012", "2013", "2014"],
    correct: 2,
    anecdote:
      "« Power Kosa Leka » est sorti en 2013. « Kosa Leka » signifie « ne se trompe pas » en lingala.",
    category: "Discographie",
    album: ALBUMS.power,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 20,
    question: "Quel est le quatrième album de Fally Ipupa ?",
    options: ["Control", "Tokooos", "Formule 7", "Arsenal de Belles Mélodies"],
    correct: 1,
    anecdote:
      "« Tokooos » sort en 2017 et contient notamment le célèbre duo « Jaloux » avec Dadju.",
    category: "Discographie",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 21,
    question: "En quelle année sort l'album « Tokooos » ?",
    options: ["2015", "2016", "2017", "2018"],
    correct: 2,
    anecdote:
      "« Tokooos » est sorti en 2017. Le mot évoque l'énergie et l'effervescence de la danse congolaise.",
    category: "Discographie",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 22,
    question: "Quel est le cinquième album studio de Fally Ipupa ?",
    options: ["Tokooos", "Formule 7", "Control", "Power Kosa Leka"],
    correct: 2,
    anecdote:
      "« Control » sort en 2018, un an après Tokooos, et démontre la prolificité créative de Fally.",
    category: "Discographie",
    album: ALBUMS.control,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 23,
    question: "En quelle année sort l'album « Control » de Fally ?",
    options: ["2017", "2018", "2019", "2020"],
    correct: 1,
    anecdote:
      "« Control » est sorti en 2018, confirmant la maîtrise artistique de Fally Ipupa.",
    category: "Discographie",
    album: ALBUMS.control,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 24,
    question:
      "Quel est le sixième et dernier album de Fally Ipupa (à ce jour) ?",
    options: ["Control", "Tokooos II", "Formule 7", "Stade de France Live"],
    correct: 2,
    anecdote:
      "« Formule 7 » sort en 2022 et représente le 6e album studio de Fally, où il explore de nouvelles sonorités.",
    category: "Discographie",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 25,
    question: "En quelle année sort « Formule 7 » ?",
    options: ["2020", "2021", "2022", "2023"],
    correct: 2,
    anecdote:
      "« Formule 7 », le sixième album studio de Fally Ipupa, est sorti en 2022.",
    category: "Discographie",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 26,
    question: "Quel album contient le hit « Jaloux » feat. Dadju ?",
    options: ["Control", "Droit Chemin", "Tokooos", "Power Kosa Leka"],
    correct: 2,
    anecdote:
      "« Jaloux » avec Dadju figure sur l'album « Tokooos » (2017) et a conquis la France entière.",
    category: "Discographie",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 27,
    question: "Quel album de Fally sort entre « Tokooos » et « Formule 7 » ?",
    options: [
      "Arsenal de Belles Mélodies",
      "Power Kosa Leka",
      "Control",
      "Droit Chemin",
    ],
    correct: 2,
    anecdote:
      "« Control » (2018) est sorti entre « Tokooos » (2017) et « Formule 7 » (2022), constituant le 5e album studio de Fally.",
    category: "Discographie",
    album: ALBUMS.control,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 28,
    question:
      "Quel album suit directement « Power Kosa Leka » dans la discographie de Fally ?",
    options: [
      "Droit Chemin",
      "Arsenal de Belles Mélodies",
      "Formule 7",
      "Tokooos",
    ],
    correct: 3,
    anecdote:
      "Après « Power Kosa Leka » (2013), Fally sort « Tokooos » en 2017, soit quatre ans plus tard.",
    category: "Discographie",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 29,
    question:
      "Quel album précède directement « Control » dans la discographie de Fally ?",
    options: [
      "Droit Chemin",
      "Arsenal de Belles Mélodies",
      "Tokooos",
      "Formule 7",
    ],
    correct: 2,
    anecdote:
      "« Tokooos » (2017) précède « Control » (2018) — deux albums en deux ans consécutifs, une prouesse créative.",
    category: "Discographie",
    album: ALBUMS.control,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 30,
    question:
      "Combien d'années s'écoulent entre « Droit Chemin » et « Formule 7 » ?",
    options: ["10 ans", "12 ans", "16 ans", "18 ans"],
    correct: 2,
    anecdote:
      "De 2006 (Droit Chemin) à 2022 (Formule 7), 16 ans de carrière solo jalonnent la discographie de Fally Ipupa.",
    category: "Discographie",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },

  // ── COLLABORATIONS ────────────────────────────────────────────────────────────
  {
    id: 31,
    question:
      "Avec quel artiste Fally a-t-il sorti le hit « Jaloux » en 2017 ?",
    options: ["Stromae", "Maître Gims", "Dadju", "Aya Nakamura"],
    correct: 2,
    anecdote:
      "Le duo « Jaloux » avec Dadju, sorti en 2017, a ouvert Fally à un public francophone encore plus large.",
    category: "Collaborations",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 32,
    question:
      "Dadju, partenaire de Fally sur « Jaloux », est le frère de quel artiste célèbre ?",
    options: ["Booba", "Lacrim", "Maître Gims", "Rohff"],
    correct: 2,
    anecdote:
      "Dadju est le frère de Maître Gims (Gandhi Djuna), l'un des artistes francophones les plus streamés au monde.",
    category: "Collaborations",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 33,
    question:
      "En quelle année Fally et Dadju sortent-ils « Jaloux » ensemble ?",
    options: ["2015", "2016", "2017", "2018"],
    correct: 2,
    anecdote:
      "« Jaloux » est sorti en 2017 sur l'album Tokooos et est devenu un tube incontournable en France et en Afrique.",
    category: "Collaborations",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },

  // ── MUSIQUE ───────────────────────────────────────────────────────────────────
  {
    id: 34,
    question:
      "Quel style musical est au cœur de l'identité artistique de Fally Ipupa ?",
    options: [
      "Coupé-Décalé ivoirien",
      "Afrobeats nigérian",
      "Mbalax sénégalais",
      "Ndombolo / Rumba congolaise",
    ],
    correct: 3,
    anecdote:
      "Fally est le maître incontesté du Ndombolo, dérivé énergique de la rumba congolaise — un genre inscrit au patrimoine de l'UNESCO.",
    category: "Musique",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 35,
    question:
      "La rumba congolaise a été inscrite au patrimoine immatériel de l'UNESCO en quelle année ?",
    options: ["2017", "2019", "2021", "2023"],
    correct: 2,
    anecdote:
      "La rumba congolaise a été inscrite au patrimoine culturel immatériel de l'UNESCO en 2021 — une reconnaissance historique.",
    category: "Musique",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 36,
    question:
      "Quelle est la langue principale utilisée par Fally dans ses chansons ?",
    options: ["Le français", "Le swahili", "Le lingala", "Le kikongo"],
    correct: 2,
    anecdote:
      "Fally chante principalement en lingala, la langue véhiculaire de Kinshasa et de l'ouest de la RDC, mêlée parfois de français.",
    category: "Musique",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 37,
    question:
      "Quel instrument est central dans la musique de Fally et la rumba congolaise ?",
    options: ["Le djembé", "La guitare électrique", "Le balafon", "La kora"],
    correct: 1,
    anecdote:
      "La guitare électrique est au cœur de la rumba congolaise. Les guitaristes de Kinshasa sont réputés dans le monde entier pour leur virtuosité.",
    category: "Musique",
    album: ALBUMS.power,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 38,
    question:
      "Quel genre de danse est souvent associé aux concerts de Fally Ipupa ?",
    options: [
      "Le Coupé-Décalé",
      "Le Ndombolo",
      "Le Azonto",
      "Le Gwara Gwara",
    ],
    correct: 1,
    anecdote:
      "Le Ndombolo est une danse énergique née de la rumba congolaise, caractérisée par des mouvements de hanches rapides — signature des concerts de Fally.",
    category: "Musique",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 39,
    question:
      "Quel style musical est aussi appelé « soukous » dans certains pays ?",
    options: [
      "Coupé-Décalé",
      "Afrobeats",
      "Rumba congolaise",
      "Bikutsi",
    ],
    correct: 2,
    anecdote:
      "La rumba congolaise est parfois appelée « soukous » dans les pays anglophones — le genre musical emblématique de Fally Ipupa.",
    category: "Musique",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-global-citizen.jpg",
  },

  // ── ENGAGEMENT ────────────────────────────────────────────────────────────────
  {
    id: 40,
    question:
      "Pour quelle organisation internationale Fally est-il ambassadeur de bonne volonté ?",
    options: ["UNESCO", "OMS", "ONU Femmes", "UNICEF"],
    correct: 3,
    anecdote:
      "Fally Ipupa est ambassadeur de bonne volonté de l'UNICEF, s'engageant pour la protection des droits des enfants en Afrique et dans le monde.",
    category: "Engagement",
    album: ALBUMS.control,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 41,
    question: "Quel rôle Fally occupe-t-il au sein de l'UNICEF ?",
    options: [
      "Parrain ponctuel",
      "Donateur officiel",
      "Ambassadeur de bonne volonté",
      "Directeur Afrique",
    ],
    correct: 2,
    anecdote:
      "Fally Ipupa est ambassadeur de bonne volonté de l'UNICEF, s'engageant pour la protection des droits des enfants en Afrique.",
    category: "Engagement",
    album: ALBUMS.control,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },

  // ── CONCERTS & HISTOIRE ───────────────────────────────────────────────────────
  {
    id: 42,
    question:
      "Dans quelle grande salle parisienne Fally a-t-il triomphé avant le Stade de France ?",
    options: [
      "La Cigale",
      "Zénith de Paris",
      "Salle Pleyel",
      "Accor Arena (Bercy)",
    ],
    correct: 3,
    anecdote:
      "Fally a rempli l'Accor Arena (anciennement Bercy) à plusieurs reprises — une étape majeure avant l'historique Stade de France 2026.",
    category: "Concerts",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 43,
    question:
      "Les 2 et 3 mai 2026, Fally entre dans l'histoire en devenant quoi ?",
    options: [
      "Le premier Africain à chanter à l'Élysée",
      "Le premier artiste congolais au Stade de France",
      "L'artiste le plus streamé de France",
      "Producteur officiel de la Coupe du Monde 2026",
    ],
    correct: 1,
    anecdote:
      "Fally Ipupa Nsimba devient le premier artiste congolais — et l'un des rares artistes africains — à se produire au Stade de France, deux nuits consécutives.",
    category: "Histoire",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 44,
    question: "En quelle année Fally Ipupa se produit-il au Stade de France ?",
    options: ["2024", "2025", "2026", "2027"],
    correct: 2,
    anecdote:
      "Les 2 et 3 mai 2026, Fally Ipupa entre dans l'histoire avec deux concerts au Stade de France à Paris.",
    category: "Histoire",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 45,
    question: "Combien de nuits Fally se produit-il au Stade de France en 2026 ?",
    options: ["1 nuit", "2 nuits", "3 nuits", "4 nuits"],
    correct: 1,
    anecdote:
      "Fally Ipupa réalise deux nuits consécutives au Stade de France les 2 et 3 mai 2026 — un record pour un artiste africain.",
    category: "Histoire",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 46,
    question: "À quel mois ont lieu les concerts de Fally au Stade de France ?",
    options: ["Mars 2026", "Avril 2026", "Mai 2026", "Juin 2026"],
    correct: 2,
    anecdote:
      "Les concerts historiques de Fally au Stade de France ont lieu les 2 et 3 mai 2026.",
    category: "Histoire",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 47,
    question:
      "Dans quelle ville se situe le Stade de France où Fally se produit en 2026 ?",
    options: [
      "Saint-Denis (région parisienne)",
      "Lyon",
      "Marseille",
      "Bordeaux",
    ],
    correct: 0,
    anecdote:
      "Le Stade de France est situé à Saint-Denis, en périphérie nord de Paris — la scène la plus emblématique de France.",
    category: "Histoire",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 48,
    question: "Quelle est la capitale de la RD Congo, pays natal de Fally ?",
    options: ["Brazzaville", "Kinshasa", "Lubumbashi", "Kisangani"],
    correct: 1,
    anecdote:
      "Kinshasa est la capitale de la RD Congo et l'une des plus grandes villes d'Afrique. C'est le berceau de la rumba congolaise.",
    category: "Biographie",
    album: ALBUMS.droit,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 49,
    question:
      "Quel autre grand artiste congolais est souvent cité aux côtés de Fally comme figure de la rumba moderne ?",
    options: ["Youssou N'Dour", "Ferre Gola", "Davido", "Burna Boy"],
    correct: 1,
    anecdote:
      "Ferre Gola, comme Fally, est issu du Quartier Latin de Koffi Olomidé. Les deux artistes sont les ambassadeurs mondiaux de la nouvelle rumba congolaise.",
    category: "Carrière",
    album: ALBUMS.power,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 50,
    question:
      "Quelle expression lingala donne son nom à l'album « Power Kosa Leka » ?",
    options: [
      "« Power dort jamais »",
      "« Power ne se trompe pas »",
      "« Power c'est la vie »",
      "« Power toujours debout »",
    ],
    correct: 1,
    anecdote:
      "« Kosa Leka » signifie littéralement « ne se trompe pas » en lingala — Power Icarius ne se trompe jamais.",
    category: "Musique",
    album: ALBUMS.power,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  // ── 51-100 : EXTENSION FAN HARDCORE ──────────────────────────────────────────
  {
    id: 51,
    question: "Dans quelle commune de Kinshasa Fally a-t-il grandi ?",
    options: ["Lemba", "Bandalungwa", "Matete", "Kintambo"],
    correct: 1,
    anecdote: "Fally a grandi à Bandalungwa (« Bandal »), commune mythique pour la rumba congolaise.",
    category: "Identité",
    album: ALBUMS.droit,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 52,
    question: "Sur quel album figure le titre « Bad Boy » feat. Aya Nakamura ?",
    options: ["Power Kosa Leka", "Tokooos", "Control", "Formule 7"],
    correct: 1,
    anecdote: "« Bad Boy » feat. Aya Nakamura est extrait de l'album Tokooos (2017) — le duo qui a conquis la France.",
    category: "Discographie",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 53,
    question: "En quelle année Fally remplit-il l'AccorHotels Arena (Bercy) pour la première fois ?",
    options: ["2017", "2019", "2020", "2022"],
    correct: 2,
    anecdote: "Le 28 février 2020, Fally Ipupa remplit l'Accor Arena (Bercy) à guichet fermé — premier artiste congolais à le faire seul.",
    category: "Concert",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 54,
    question: "Quel single a explosé en 2017 et marqué le début de l'ère pop urbaine de Fally ?",
    options: ["Eloko Oyo", "Kiname", "Sweet Life", "Original"],
    correct: 0,
    anecdote: "« Eloko Oyo » (« Cette chose-là ») a propulsé Fally au sommet du afro-pop francophone.",
    category: "Musique",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-performance.jpg",
  },
  {
    id: 55,
    question: "Sur quel album figure le titre « Associé » ?",
    options: ["Droit chemin", "Arsenal de belles mélodies", "Power Kosa Leka", "Tokooos"],
    correct: 2,
    anecdote: "« Associé » est un sebene culte extrait de l'album Power Kosa Leka (2013).",
    category: "Discographie",
    album: ALBUMS.power,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 56,
    question: "Quel album de Fally est sorti en 2022 ?",
    options: ["Tokooos II", "Formule 7", "Control", "Power Kosa Leka"],
    correct: 1,
    anecdote: "« Formule 7 » (2022) marque l'aboutissement de son virage afro-pop international.",
    category: "Discographie",
    album: ALBUMS.formule,
    image: "/images/fally/fally-afcon.jpg",
  },
  {
    id: 57,
    question: "Quel groupe légendaire Fally a-t-il rejoint à ses débuts ?",
    options: ["Wenge Musica BCBG", "Quartier Latin International", "Zaïko Langa Langa", "Empire Bakuba"],
    correct: 1,
    anecdote: "Fally a fait ses classes au Quartier Latin International de Koffi Olomidé avant le solo.",
    category: "Carrière",
    album: ALBUMS.droit,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 58,
    question: "Quel est le titre de la chanson devenue un hymne lors de la CAN 2024 ?",
    options: ["Mayday", "Mannequin", "Likolo", "Allô"],
    correct: 0,
    anecdote: "« Mayday » a accompagné les Léopards de RDC pendant toute la CAN 2024.",
    category: "Culture",
    album: ALBUMS.formule,
    image: "/images/fally/fally-afcon.jpg",
  },
  {
    id: 59,
    question: "Quel titre de l'album Tokooos réunit Fally Ipupa et R. Kelly ?",
    options: ["Original", "Bad Like Me", "Nidja", "Likolo"],
    correct: 2,
    anecdote: "« Nidja » feat. R. Kelly figure sur l'album Tokooos (2017) — une rencontre historique entre rumba congolaise et R&B américain.",
    category: "Collaborations",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 60,
    question: "Comment s'appelle la fondation de Fally Ipupa ?",
    options: ["FIF — Fally Ipupa Foundation", "Power Kosa Leka", "Mboka Foundation", "Diamond Heart"],
    correct: 0,
    anecdote: "La FIF (Fally Ipupa Foundation) œuvre pour l'éducation et la jeunesse en RDC.",
    category: "Engagement",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 61,
    question: "Comment appelle-t-on les fans hardcore de Fally Ipupa ?",
    options: ["Les Pélicans", "Les Diamants", "Les Power", "Les Warriors"],
    correct: 3,
    anecdote: "« Les Warriors » est la communauté de fans de l'Aigle, omniprésente à chaque concert mondial — du Zénith au Stade de France.",
    category: "Culture",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 62,
    question: "Combien de CD contient l'album « Control » de Fally Ipupa ?",
    options: ["1 CD", "2 CD", "3 CD", "4 CD"],
    correct: 2,
    anecdote: "Control (2018) est un triple album de 31 titres — un monument de la rumba moderne, son œuvre la plus ambitieuse.",
    category: "Discographie",
    album: ALBUMS.control,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 63,
    question: "Comment s'appelle la danse popularisée par Fally au début des années 2010 ?",
    options: ["Kotazo", "Mayele", "Bofele", "Kibinda Nkoy"],
    correct: 0,
    anecdote: "« Kotazo » est la danse signature qui a accompagné l'explosion de l'album Power Kosa Leka.",
    category: "Culture",
    album: ALBUMS.power,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 64,
    question: "Quelle ville africaine a accueilli un mémorable concert de Fally au stade Ahmadou Ahidjo ?",
    options: ["Abidjan", "Yaoundé", "Dakar", "Brazzaville"],
    correct: 1,
    anecdote: "Yaoundé (Cameroun) a vu Fally remplir le stade Ahmadou Ahidjo en 2021.",
    category: "Concert",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 65,
    question: "Quel hit de 2009 a fait connaître Fally en Afrique de l'Ouest ?",
    options: ["Droit chemin", "Sexy Dance", "Associé", "Service"],
    correct: 1,
    anecdote: "« Sexy Dance » (Arsenal de belles mélodies, 2009) a été un succès panafricain massif.",
    category: "Musique",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 66,
    question: "Quelle chanson de Fally fait référence à un cocktail tropical ?",
    options: ["Mojito", "Daiquiri", "Mai Tai", "Caïpi"],
    correct: 0,
    anecdote: "« Mojito » est un featuring exotique sorti dans la mouvance Tokooos.",
    category: "Musique",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-performance.jpg",
  },
  {
    id: 67,
    question: "Quel album marque la fusion entre rumba congolaise et afro-pop urbain ?",
    options: ["Droit chemin", "Tokooos", "Power Kosa Leka", "Arsenal de belles mélodies"],
    correct: 1,
    anecdote: "« Tokooos » (2017) est l'album-pivot qui a redéfini la rumba moderne.",
    category: "Discographie",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 68,
    question: "Sur quel album figure le titre « Likolo » ?",
    options: ["Tokooos", "Control", "Power Kosa Leka", "Formule 7"],
    correct: 3,
    anecdote: "« Likolo » est extrait de l'album Formule 7 (2022).",
    category: "Discographie",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 69,
    question: "Quelle expression caractérise le style musical signature de Fally ?",
    options: ["Soukous moderne", "Afro-trap", "Coupé-décalé", "Ndombolo classique"],
    correct: 0,
    anecdote: "Fally a modernisé le soukous en y mêlant pop, R&B et électro — un soukous moderne unique.",
    category: "Musique",
    album: ALBUMS.power,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 70,
    question: "Quel chiffre d'or a Fally atteint sur YouTube avec « Eloko Oyo » ?",
    options: ["10 millions", "50 millions", "100 millions+", "1 milliard"],
    correct: 2,
    anecdote: "« Eloko Oyo » a dépassé les 100 millions de vues sur YouTube — un record africain à sa sortie.",
    category: "Carrière",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-performance.jpg",
  },
  {
    id: 71,
    question: "Quel instrument est emblématique de la rumba congolaise ?",
    options: ["Saxophone", "Guitare sèche (mi-solo)", "Accordéon", "Piano"],
    correct: 1,
    anecdote: "La guitare mi-solo (« sebene ») est l'âme de la rumba — Fally en use et abuse magistralement.",
    category: "Culture",
    album: ALBUMS.droit,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 72,
    question: "Quel pays voisin de la RDC a inspiré le titre « Service » ?",
    options: ["Angola", "Congo-Brazzaville", "Cameroun", "Centrafrique"],
    correct: 1,
    anecdote: "« Service » fait écho à la culture nyokas des deux Congos, frères de rumba.",
    category: "Culture",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 73,
    question: "Combien de fois Fally a-t-il rempli l'Olympia de Paris ?",
    options: ["1 fois", "2 fois", "3 fois", "Plus de 5 fois"],
    correct: 3,
    anecdote: "Fally a écumé l'Olympia plus de 5 fois — c'est devenu son terrain parisien historique.",
    category: "Concert",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 74,
    question: "Quel est le surnom donné à Kinshasa par les fans de rumba ?",
    options: ["Kin la Belle", "Kin Capitale", "Lipopo", "Ville Lumière"],
    correct: 0,
    anecdote: "« Kin la Belle » est l'appellation affectueuse de Kinshasa, capitale mondiale de la rumba.",
    category: "Culture",
    album: ALBUMS.droit,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 75,
    question: "Sur quel album figure le titre « Mayday » ?",
    options: ["Tokooos", "Control", "Power Kosa Leka", "Formule 7"],
    correct: 3,
    anecdote: "« Mayday » figure sur Formule 7 (2022) — devenu hymne CAN 2024.",
    category: "Discographie",
    album: ALBUMS.formule,
    image: "/images/fally/fally-afcon.jpg",
  },
  {
    id: 76,
    question: "Quel concert parisien a précédé le Stade de France 2026 dans la stratégie de Fally ?",
    options: ["Bercy 2020", "Olympia 2015", "Zénith 2018", "Paris La Défense Arena 2023"],
    correct: 0,
    anecdote: "Le concert mythique de Bercy 2020 a posé les fondations de l'évènement Stade de France.",
    category: "Concert",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 77,
    question: "Quel est le titre du premier album solo de Fally ?",
    options: ["Arsenal de belles mélodies", "Droit chemin", "Power Kosa Leka", "Tokooos"],
    correct: 1,
    anecdote: "« Droit chemin » (2006) est l'album solo qui marque l'envol post-Quartier Latin.",
    category: "Discographie",
    album: ALBUMS.droit,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 78,
    question: "Quel mot lingala signifie « la bonne chose » et titre un album ?",
    options: ["Eloko", "Tokooos", "Mayele", "Bondoki"],
    correct: 1,
    anecdote: "« Tokooos » signifie « c'est bon » / « c'est génial » en lingala. Album culte de 2017.",
    category: "Discographie",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 79,
    question: "Sur quel album figure le titre « Original » ?",
    options: ["Tokooos", "Control", "Power Kosa Leka", "Formule 7"],
    correct: 1,
    anecdote: "« Original » est extrait de l'album Control (2018) — refrain mantra culte.",
    category: "Discographie",
    album: ALBUMS.control,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 80,
    question: "Quel prix prestigieux Fally a-t-il remporté plusieurs fois ?",
    options: ["Grammy Award", "Kora Award", "BRIT Award", "Latin Grammy"],
    correct: 1,
    anecdote: "Les KORA Awards distinguent les meilleurs artistes africains — Fally en a raflé plusieurs.",
    category: "Carrière",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 81,
    question: "Quel titre de Fally a été utilisé dans le générique d'une série Netflix africaine ?",
    options: ["Eloko Oyo", "Bloqué", "Likolo", "Allô"],
    correct: 1,
    anecdote: "« Bloqué » a été reprise dans plusieurs productions africaines, dont une série Netflix.",
    category: "Culture",
    album: ALBUMS.control,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 82,
    question: "Quel est le nom du label personnel de Fally Ipupa ?",
    options: ["FIF Music", "Mboka Records", "Elektra Africa", "Power Records"],
    correct: 0,
    anecdote: "FIF Music (du nom de la fondation) gère certaines productions et campagnes de Fally.",
    category: "Carrière",
    album: ALBUMS.control,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 83,
    question: "Quelle métropole africaine accueille systématiquement les premières dates de tournée de Fally ?",
    options: ["Lagos", "Abidjan", "Kinshasa", "Dakar"],
    correct: 2,
    anecdote: "Kinshasa, sa ville natale, est toujours le point de départ symbolique de ses tournées.",
    category: "Concert",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 84,
    question: "À quel mythique artiste congolais Fally rend-il régulièrement hommage ?",
    options: ["Papa Wemba", "Tabu Ley Rochereau", "Franco Luambo", "Tous les trois"],
    correct: 3,
    anecdote: "Fally cite Papa Wemba, Tabu Ley et Franco comme ses maîtres absolus de la rumba.",
    category: "Culture",
    album: ALBUMS.power,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 85,
    question: "Combien de soirs Fally se produira-t-il au Stade de France en 2026 ?",
    options: ["1 soir", "2 soirs", "3 soirs", "4 soirs"],
    correct: 1,
    anecdote: "2 soirs : samedi 2 et dimanche 3 mai 2026 — un évènement historique.",
    category: "Concert",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 86,
    question: "Combien de places compte le Stade de France en configuration concert ?",
    options: ["≈ 50 000", "≈ 80 000", "≈ 100 000", "≈ 120 000"],
    correct: 1,
    anecdote: "Environ 80 000 places en configuration concert — le plus grand stade de France.",
    category: "Concert",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 87,
    question: "Quel RER permet d'accéder le plus directement au Stade de France ?",
    options: ["RER A", "RER B", "RER D", "RER C"],
    correct: 2,
    anecdote: "Le RER D dépose à la station « Stade de France — Saint-Denis », à 5 min à pied.",
    category: "Concert",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 88,
    question: "Dans quel département se situe le Stade de France ?",
    options: ["75 — Paris", "92 — Hauts-de-Seine", "93 — Seine-Saint-Denis", "94 — Val-de-Marne"],
    correct: 2,
    anecdote: "Le Stade de France est à Saint-Denis, en Seine-Saint-Denis (93).",
    category: "Concert",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 89,
    question: "Quel grand artiste a été le dernier à remplir 2 soirs au Stade de France avant Fally ?",
    options: ["Indochine", "Mylène Farmer", "PNL", "Aya Nakamura"],
    correct: 1,
    anecdote: "Mylène Farmer fait partie des très rares artistes français à enchaîner 2 soirs au SDF.",
    category: "Culture",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 90,
    question: "Combien d'albums solo Fally a-t-il publié à ce jour ?",
    options: ["6", "8", "10", "12"],
    correct: 2,
    anecdote: "Une dizaine d'albums solo en 20 ans de carrière — discographie d'une régularité rare.",
    category: "Discographie",
    album: ALBUMS.formule,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 91,
    question: "Quel titre marque l'entrée fracassante de Fally dans le grand public francophone ?",
    options: ["Droit chemin", "Sexy Dance", "Associé", "Eloko Oyo"],
    correct: 3,
    anecdote: "« Eloko Oyo » est LE titre qui a explosé toutes les frontières francophones en 2017.",
    category: "Musique",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-performance.jpg",
  },
  {
    id: 92,
    question: "Quel pays européen a accueilli plusieurs grandes dates de Fally avant 2026 ?",
    options: ["Allemagne", "Belgique", "Italie", "Espagne"],
    correct: 1,
    anecdote: "La Belgique (Bruxelles, Liège) est un fief diaspora majeur — Fally y joue régulièrement.",
    category: "Concert",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 93,
    question: "Quel objet est emblématique du dress-code des fans de rumba en concert ?",
    options: ["La SAPE (costume)", "Le maillot de foot", "Le boubou wax", "Le bob"],
    correct: 0,
    anecdote: "La SAPE — Société des Ambianceurs et des Personnes Élégantes — est culte chez les fans.",
    category: "Culture",
    album: ALBUMS.control,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 94,
    question: "Quelle ville française abrite la plus grande communauté congolaise de France ?",
    options: ["Marseille", "Lyon", "Paris (Île-de-France)", "Bordeaux"],
    correct: 2,
    anecdote: "L'Île-de-France concentre la majorité de la diaspora congolaise francophone.",
    category: "Culture",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 95,
    question: "Quel mot lingala signifie « venez » et est souvent crié en concert ?",
    options: ["Bonga", "Yaka", "Kotazo", "Tokomi"],
    correct: 1,
    anecdote: "« Yaka » (« viens » / « venez ») est l'appel collectif lancé par Fally à son public.",
    category: "Culture",
    album: ALBUMS.power,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 96,
    question: "Quel album de Fally porte un titre en référence à la musique militaire ?",
    options: ["Power Kosa Leka", "Arsenal de belles mélodies", "Control", "Formule 7"],
    correct: 1,
    anecdote: "« Arsenal de belles mélodies » (2009) — la métaphore guerrière au service de la rumba.",
    category: "Discographie",
    album: ALBUMS.arsenal,
    image: "/images/fally/fally-global-citizen.jpg",
  },
  {
    id: 97,
    question: "Quel chanteur congolais a influencé Fally dans son adolescence ?",
    options: ["Koffi Olomidé", "Werrason", "JB Mpiana", "Tous les trois"],
    correct: 3,
    anecdote: "Koffi, Werra, JB Mpiana — la sainte trinité que Fally cite dans toutes ses interviews.",
    category: "Culture",
    album: ALBUMS.droit,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 98,
    question: "Quel mot désigne en lingala le break instrumental dansé en rumba ?",
    options: ["Sebene", "Mayele", "Bofele", "Ndombolo"],
    correct: 0,
    anecdote: "Le « sebene » est ce moment de pure transe instrumentale qui fait lever les stades.",
    category: "Culture",
    album: ALBUMS.power,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 99,
    question: "Quelle plateforme de streaming a vu Fally franchir le cap du milliard de streams cumulés ?",
    options: ["Apple Music", "Deezer", "Spotify", "Boomplay"],
    correct: 2,
    anecdote: "Sur Spotify, Fally cumule plusieurs centaines de millions d'écoutes — référence africaine.",
    category: "Carrière",
    album: ALBUMS.formule,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 100,
    question: "Quel est le prénom de l'épouse de Fally Ipupa ?",
    options: ["Olivia", "Nana", "Charlotte", "Esther"],
    correct: 1,
    anecdote: "Nana Ipupa, son épouse, l'accompagne discrètement dans sa carrière depuis des années.",
    category: "Identité",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  // ── 101-110 : PAROLES & DÉDICACES ────────────────────────────────────────────
  {
    id: 101,
    question: "Dans « Eloko Oyo », que signifie littéralement le titre en lingala ?",
    options: ["« Ce moment-là »", "« Cette chose-là »", "« Cette nuit-là »", "« Cette femme-là »"],
    correct: 1,
    anecdote: "« Eloko oyo » = « cette chose-là » — Fally l'utilise comme refrain hypnotique.",
    category: "Paroles",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-performance.jpg",
  },
  {
    id: 102,
    question: "Sur quel album figure le titre « Mannequin » de Fally Ipupa ?",
    options: ["Control", "Power Kosa Leka", "Tokooos", "Formule 7"],
    correct: 2,
    anecdote: "« Mannequin » figure sur l'album Tokooos (2017) — le titre phare de son virage pop.",
    category: "Discographie",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 103,
    question: "Quelle interjection lingala revient souvent en intro de chansons de Fally ?",
    options: ["« Yaka ! »", "« Tokomi ! »", "« Hé hé ! »", "« Mboka na ngai ! »"],
    correct: 3,
    anecdote: "« Mboka na ngai » (« mon pays ») — la signature affective adressée à la RDC.",
    category: "Dédicaces",
    album: ALBUMS.power,
    image: "/images/fally/fally-cameroun-2021.jpg",
  },
  {
    id: 104,
    question: "Dans « Bloqué », à quoi le narrateur est-il « bloqué » ?",
    options: ["À ses pensées d'elle", "À son téléphone", "À l'aéroport", "À la douane"],
    correct: 0,
    anecdote: "« Bloqué dans tes pensées » — la métaphore d'un amour obsessionnel.",
    category: "Paroles",
    album: ALBUMS.control,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 105,
    question: "À qui Fally dédie-t-il régulièrement des shoutouts (« mabanga ») dans ses morceaux ?",
    options: ["Uniquement aux producteurs", "Aux fans, mécènes et personnalités", "Aux journalistes", "Aux politiques"],
    correct: 1,
    anecdote: "Le « mabanga » est la tradition rumba des dédicaces payantes ou affectives à des fans/mécènes.",
    category: "Dédicaces",
    album: ALBUMS.tokooos,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 106,
    question: "Comment s'appelle la pratique culturelle des dédicaces en pleine chanson congolaise ?",
    options: ["Le sebene", "Le mabanga", "Le kwassa", "Le ndombolo"],
    correct: 1,
    anecdote: "Le « mabanga » (littéralement « pierre ») est la dédicace lancée comme une signature sonore.",
    category: "Dédicaces",
    album: ALBUMS.power,
    image: "/images/fally/fally-2014.jpg",
  },
  {
    id: 107,
    question: "Dans « Mannequin », à quoi Fally compare-t-il sa muse ?",
    options: ["À une déesse", "À un mannequin", "À une reine", "À une étoile"],
    correct: 1,
    anecdote: "« Mannequin » file la métaphore de la femme idéale — défilé visuel sur fond de rumba moderne.",
    category: "Paroles",
    album: ALBUMS.control,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 108,
    question: "Quel sous-titre accompagne le morceau « Sweet Life » de Fally ?",
    options: ["« Mon Afrique »", "« La vie est belle »", "« Pour toujours »", "« Just Like You »"],
    correct: 1,
    anecdote: "Le titre complet est « Sweet Life (La vie est belle) » — référence directe à l'album-culte de Khadja Nin.",
    category: "Paroles",
    album: ALBUMS.power,
    image: "/images/fally/fally-paris.jpg",
  },
  {
    id: 109,
    question: "Dans « Mayday », quel cri d'alerte international donne son nom au titre ?",
    options: ["« SOS »", "« Mayday »", "« Help »", "« Pan-pan »"],
    correct: 1,
    anecdote: "« Mayday » est le code de détresse aérien — Fally en fait un appel d'urgence en chanson.",
    category: "Paroles",
    album: ALBUMS.formule,
    image: "/images/fally/fally-afcon.jpg",
  },
  {
    id: 110,
    question: "Quelle expression lingala Fally crie souvent pour faire monter le sebene ?",
    options: ["« Yaka ! »", "« Bonga ! »", "« Tokomi ! »", "« Hé wana ! »"],
    correct: 0,
    anecdote: "« Yaka ! » (« viens ! ») est l'appel collectif lancé pour faire exploser le public.",
    category: "Dédicaces",
    album: ALBUMS.power,
    image: "/images/fally/fally-2014.jpg",
  },
] as const;

type Question = (typeof ALL_QUESTIONS)[number];

const QUESTIONS_PER_SESSION = 10;

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickQuestions(): Question[] {
  return shuffle(ALL_QUESTIONS).slice(0, QUESTIONS_PER_SESSION);
}

// ── Fan profiles ───────────────────────────────────────────────────────────────
const PROFILES = [
  {
    range: [0, 3] as const,
    title: "Nouveau Fan",
    subtitle: "Bienvenue dans la famille Fally !",
    description:
      "Le concert du Stade de France va être une vraie révélation pour toi.",
    icon: Star,
    color: "text-paper-dim",
    accent: "from-smoke/50 to-smoke/20",
    border: "border-white/10",
  },
  {
    range: [4, 6] as const,
    title: "Fan Certifié",
    subtitle: "Tu connais bien ton Power Icarius.",
    description:
      "Tu suis Fally depuis un moment. Le Stade de France va être une soirée inoubliable.",
    icon: Flame,
    color: "text-ember",
    accent: "from-ember/20 to-ember/5",
    border: "border-ember/30",
  },
  {
    range: [7, 8] as const,
    title: "Vrai Mbokaman",
    subtitle: "Un fan de la première heure !",
    description:
      "Tu maîtrises l'histoire et la culture Fally. Tu fais partie de ceux qui ont suivi l'ascension depuis le début.",
    icon: Trophy,
    color: "text-gold",
    accent: "from-gold/20 to-gold/5",
    border: "border-gold/30",
  },
  {
    range: [9, 10] as const,
    title: "Légende Vivante",
    subtitle: "Power Icarius lui-même t'approuverait !",
    description:
      "Score parfait ou quasi-parfait. Tu es l'encyclopédie vivante de Mboka Hub.",
    icon: Crown,
    color: "text-blood",
    accent: "from-blood/20 to-blood/5",
    border: "border-blood/30",
  },
] as const;

const TIMER_SECONDS = 20;
const CATEGORY_COLORS: Record<string, string> = {
  Identité: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Biographie: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Carrière: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Discographie: "bg-blood/20 text-blood border-blood/30",
  Engagement: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Concerts: "bg-gold/20 text-gold border-gold/30",
  Collaborations: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Musique: "bg-ember/20 text-ember border-ember/30",
  Histoire: "bg-blood/20 text-blood border-blood/30",
};

// ── Component ──────────────────────────────────────────────────────────────────
export function QuizClient() {
  const [questions, setQuestions] = useState<Question[]>(() => pickQuestions());
  const [phase, setPhase] = useState<"question" | "feedback" | "results">(
    "question",
  );
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ correct: boolean; id: number }>
  >([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = questions[current];
  const profile =
    PROFILES.find((p) => score >= p.range[0] && score <= p.range[1]) ??
    PROFILES[0];
  const ProfileIcon = profile.icon;

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // Timer
  // biome-ignore lint/correctness/useExhaustiveDependencies: The timer must restart only when the question or phase changes.
  useEffect(() => {
    if (phase !== "question") return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          handleConfirm(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [current, phase]);

  function handleSelect(idx: number) {
    if (phase !== "question") return;
    setSelected(idx);
  }

  function handleConfirm(forcedIdx?: number) {
    if (phase === "feedback") return;
    clearTimer();
    const choice = forcedIdx !== undefined ? forcedIdx : selected;
    if (choice === null) return;
    const correct = choice === q.correct;
    setSelected(choice);
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    if (correct) {
      const bonus = combo >= 2 ? 2 : 1;
      setScore((s) => Math.min(questions.length, s + bonus));
      setCombo((c) => c + 1);
    } else {
      setCombo(0);
    }
    setAnswers((a) => [...a, { correct, id: q.id }]);
    setPhase("feedback");
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setPhase("results");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setPhase("question");
    }
  }

  function handleRestart() {
    setQuestions(pickQuestions());
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setCombo(0);
    setAnswers([]);
    setPhase("question");
  }

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor =
    timerPct > 50 ? "bg-blood" : timerPct > 25 ? "bg-amber-400" : "bg-red-600";

  // ── Results ──────────────────────────────────────────────────────────────────
  if (phase === "results") {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <div
          className={cn(
            "relative mx-auto mb-8 flex size-36 items-center justify-center overflow-hidden rounded-[2.5rem] border bg-gradient-to-br",
            profile.accent,
            profile.border,
          )}
        >
          <ProfileIcon
            className={cn("size-16 drop-shadow-lg", profile.color)}
          />
          {score >= 9 && (
            <div className="absolute inset-0 animate-pulse bg-blood/10" />
          )}
        </div>

        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-paper-mute">
          Profil Fally
        </p>
        <h2
          className={cn(
            "mb-1 font-display text-6xl uppercase leading-none sm:text-7xl",
            profile.color,
          )}
        >
          {profile.title}
        </h2>
        <p className="mb-6 font-serif italic text-xl text-paper-dim">
          {profile.subtitle}
        </p>
        <p className="mx-auto mb-10 max-w-xs font-body text-sm leading-relaxed text-paper-mute">
          {profile.description}
        </p>

        {/* Score display */}
        <div className="mb-8 inline-flex items-end gap-2 rounded-3xl border border-white/10 bg-smoke/50 px-10 py-6">
          <span className="font-display text-7xl text-paper leading-none">
            {score}
          </span>
          <span className="mb-1 font-display text-3xl text-paper-mute leading-none">
            /{questions.length}
          </span>
        </div>

        {/* Answer trail */}
        <div className="mb-10 flex justify-center gap-1.5">
          {answers.map((answer, idx) => (
            <div
              key={idx}
              className={cn(
                "h-2 w-6 rounded-full transition-all",
                answer.correct ? "bg-blood" : "bg-white/15",
              )}
            />
          ))}
        </div>

        <div className="mb-4 text-center">
          <p className="font-mono text-[9px] uppercase tracking-widest text-paper-mute/60">
            {ALL_QUESTIONS.length} questions dans la banque · 10 tirées au hasard à chaque partie · rejoue pour les voir toutes
          </p>
        </div>

        <div className="mb-10 grid grid-cols-6 gap-2">
          {DISCOGRAPHY.map((album) => (
            <div
              className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-smoke shadow-[0_14px_28px_rgba(0,0,0,0.25)]"
              key={album.title}
            >
              <Image
                alt={`Pochette ${album.title}`}
                className="object-cover"
                fill
                sizes="80px"
                src={album.cover}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleRestart}
            type="button"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-smoke/50 px-8 py-4 font-mono text-[11px] uppercase tracking-wider text-paper transition-all hover:border-white/30 hover:bg-smoke"
          >
            <RotateCcw className="size-4" />
            Nouvelle partie
          </button>
          <button
            onClick={() => {
              const text = `Je suis "${profile.title}" sur le Quiz Fally Ipupa ! ${score}/${questions.length} 🎵 #FallyStadeDeFrance #MbokaHub`;
              if (navigator.share)
                navigator.share({ text, title: "Quiz Fally Ipupa" });
              else {
                navigator.clipboard.writeText(text);
                alert("Résultat copié !");
              }
            }}
            type="button"
            className="flex items-center gap-2 rounded-2xl bg-blood px-8 py-4 font-mono text-[11px] uppercase tracking-wider text-white shadow-glow-blood hover:bg-blood/90 transition-all"
          >
            <Share2 className="size-4" />
            Partager
          </button>
        </div>
      </div>
    );
  }

  // ── Question card ─────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl px-4">
      {/* Progress header */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
              {current + 1} / {questions.length}
            </span>
            {combo >= 2 && (
              <span className="flex items-center gap-1 rounded-lg bg-gold/15 border border-gold/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold">
                <Zap className="size-3 fill-current" />
                Combo ×{combo}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Star className="size-3 text-blood fill-blood" />
            <span className="font-display text-lg text-paper leading-none">
              {score}
            </span>
          </div>
        </div>

        {/* Answer trail dots */}
        <div className="flex gap-1">
          {answers.map((answer, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1 flex-1 rounded-full",
                answer.correct ? "bg-blood" : "bg-white/20",
              )}
            />
          ))}
          {questions.slice(answers.length).map((question) => (
            <div
              key={`empty-${question.id}`}
              className="h-1 flex-1 rounded-full bg-white/5"
            />
          ))}
        </div>

        {/* Timer bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              timerColor,
              phase === "feedback" && "opacity-30",
            )}
            style={{ width: `${timerPct}%`, transitionDuration: "1000ms" }}
          />
        </div>

        <div className="grid grid-cols-6 gap-2">
          {DISCOGRAPHY.map((album, index) => {
            const isActive = album.title === q.album.title;
            const isPast = index < Math.min(current, DISCOGRAPHY.length);

            return (
              <div
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border bg-smoke transition-all duration-300",
                  isActive
                    ? "scale-105 border-blood shadow-[0_0_28px_rgba(230,57,70,0.35)]"
                    : "border-white/10 opacity-45",
                  isPast && !isActive && "opacity-75",
                )}
                key={album.title}
              >
                <Image
                  alt={`Pochette ${album.title}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 14vw, 88px"
                  src={album.cover}
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-ink/30",
                    isActive && "bg-transparent",
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Question card */}
      <div
        className={cn(
          "relative mb-6 overflow-hidden rounded-[2rem] border border-white/10",
          shake && "animate-[shake_0.4s_ease-in-out]",
        )}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            alt=""
            className="object-cover object-top opacity-20"
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            src={q.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 flex gap-6 p-5 sm:p-7">
          {/* LEFT — Question + options (always full-width on mobile, flex-1 on desktop) */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "rounded-lg border px-3 py-1 font-mono text-[9px] uppercase tracking-widest",
                  CATEGORY_COLORS[q.category] ??
                    "bg-white/10 text-paper-mute border-white/10",
                )}
              >
                {q.category}
              </span>
              <div className="flex items-center gap-1.5">
                <Music className="size-3 text-blood/60" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-paper-mute/60">
                  Fally Ipupa
                </span>
              </div>
              {phase === "question" && (
                <span
                  className={cn(
                    "ml-auto font-mono text-[11px] tabular-nums",
                    timerPct > 50
                      ? "text-paper-mute"
                      : timerPct > 25
                        ? "text-amber-400"
                        : "text-red-400 animate-pulse",
                  )}
                >
                  {timeLeft}s
                </span>
              )}
            </div>

            <h2 className="mb-7 font-display text-2xl text-paper uppercase leading-tight sm:text-3xl">
              {q.question}
            </h2>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {q.options.map((option, idx) => {
                const isSelected = selected === idx;
                const isCorrect = idx === q.correct;
                const showResult = phase === "feedback";

                return (
                  <button
                    key={option}
                    onClick={() =>
                      phase === "question" ? handleSelect(idx) : undefined
                    }
                    type="button"
                    className={cn(
                      "relative overflow-hidden rounded-xl border px-4 py-3 text-left font-body text-sm transition-all duration-200",
                      !showResult && [
                        "border-white/10 bg-smoke/50 text-paper hover:border-white/30 hover:bg-smoke",
                        isSelected && "border-blood/60 bg-blood/10 text-paper",
                      ],
                      showResult && [
                        isCorrect &&
                          "border-emerald-500/60 bg-emerald-500/10 text-emerald-300",
                        !isCorrect &&
                          isSelected &&
                          "border-red-500/60 bg-red-500/10 text-red-300",
                        !isCorrect &&
                          !isSelected &&
                          "border-white/5 bg-smoke/20 text-paper-mute opacity-50",
                      ],
                    )}
                  >
                    {showResult && isCorrect && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-emerald-400" />
                    )}
                    {showResult && !isCorrect && isSelected && (
                      <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-red-400" />
                    )}
                    <span className="mr-6">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Album cover, appears only when answer is revealed */}
          <div
            className={cn(
              "hidden sm:flex flex-col flex-shrink-0 w-[160px] transition-all duration-500",
              phase === "feedback"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 pointer-events-none",
            )}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/15 bg-smoke shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
              <Image
                alt={`Pochette ${q.album.title}`}
                className="object-cover"
                fill
                priority
                sizes="160px"
                src={q.album.cover}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-70" />
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-ink/70 px-3 py-2 backdrop-blur">
              <span className="truncate font-mono text-[9px] uppercase tracking-wider text-paper-dim">
                {q.album.title}
              </span>
              <span className="font-display text-base leading-none text-blood">
                {q.album.year}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback / Anecdote */}
        {phase === "feedback" && (
          <div className="relative z-10 border-t border-white/10 bg-ink/80 px-6 py-5 backdrop-blur">
            <p className="font-mono text-[9px] uppercase tracking-widest text-paper-mute/60 mb-2">
              Le savais-tu ?
            </p>
            <p className="font-body text-sm leading-relaxed text-paper-dim">
              {q.anecdote}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {phase === "question" && (
          <button
            disabled={selected === null}
            onClick={() => handleConfirm()}
            type="button"
            className={cn(
              "flex items-center gap-2 rounded-2xl px-8 py-4 font-mono text-[11px] uppercase tracking-wider transition-all",
              selected !== null
                ? "bg-blood text-white shadow-glow-blood hover:bg-blood/90"
                : "bg-smoke/50 text-paper-mute border border-white/10 cursor-not-allowed",
            )}
          >
            Valider
            <ArrowRight className="size-4" />
          </button>
        )}
        {phase === "feedback" && (
          <button
            onClick={handleNext}
            type="button"
            className="flex items-center gap-2 rounded-2xl bg-blood px-8 py-4 font-mono text-[11px] uppercase tracking-wider text-white shadow-glow-blood hover:bg-blood/90 transition-all"
          >
            {current + 1 >= questions.length ? "Voir mon résultat" : "Suivant"}
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
