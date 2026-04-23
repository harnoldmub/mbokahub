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

// ── Questions ──────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question: "Quel est le vrai nom de famille de Fally Ipupa ?",
    options: [
      "Fally Ipupa Mutuani",
      "Fally Ipupa Diamond Gode",
      "Fally Ipupa Nsimba",
      "Fally Ipupa Ngimbi",
    ],
    correct: 2,
    image: "/images/fally/fally-paris.jpg",
    album: ALBUMS.droit,
    anecdote:
      "Son vrai nom est Fally Ipupa Nsimba. Il a grandi dans la commune de Bandalingwa, à Kinshasa, avant de conquérir le monde.",
    category: "Identité",
  },
  {
    id: 2,
    question: "Dans quelle commune de Kinshasa Fally Ipupa a-t-il grandi ?",
    options: ["Gombe", "Bandalingwa", "Limete", "Ndjili"],
    correct: 1,
    image: "/images/fally/fally-cameroun-2021.jpg",
    album: ALBUMS.arsenal,
    anecdote:
      "Fally Ipupa Nsimba passe son enfance dans la commune de Bandalingwa, intégrée à Kinshasa, capitale de la RD Congo.",
    category: "Biographie",
  },
  {
    id: 3,
    question: "Avec quel groupe Fally a-t-il débuté avant sa carrière solo ?",
    options: [
      "Wenge Musica BCBG",
      "Extra Musica",
      "Victoria Eleison",
      "Quartier Latin de Koffi Olomidé",
    ],
    correct: 3,
    image: "/images/fally/fally-global-citizen.jpg",
    album: ALBUMS.power,
    anecdote:
      "Fally a brillé dans le Quartier Latin International de Koffi Olomidé à la fin des années 1990 et au début des années 2000, avant son envol solo en 2006.",
    category: "Carrière",
  },
  {
    id: 4,
    question: "Quel est le titre du premier album solo de Fally Ipupa ?",
    options: [
      "Arsenal de Belles Mélodies",
      "Droit Chemin",
      "Power Kosa Leka",
      "Tokooos",
    ],
    correct: 1,
    image: "/images/fally/fally-paris.jpg",
    album: ALBUMS.droit,
    anecdote:
      "« Droit Chemin » sort en 2006 et pose la première pierre de sa carrière solo, marquant sa rupture avec le Quartier Latin.",
    category: "Discographie",
  },
  {
    id: 5,
    question:
      "Pour quelle organisation internationale Fally est-il ambassadeur de bonne volonté ?",
    options: ["UNESCO", "OMS", "ONU Femmes", "UNICEF"],
    correct: 3,
    image: "/images/fally/fally-cameroun-2021.jpg",
    album: ALBUMS.control,
    anecdote:
      "Fally Ipupa est ambassadeur de bonne volonté de l'UNICEF, s'engageant pour la protection des droits des enfants en Afrique et dans le monde.",
    category: "Engagement",
  },
  {
    id: 6,
    question: "Quel est le surnom légendaire de Fally Ipupa ?",
    options: [
      "Le Saphir de Kinshasa",
      "Diamond Boy",
      "Le Lion de Bandalingwa",
      "Power Icarius",
    ],
    correct: 3,
    image: "/images/fally/fally-global-citizen.jpg",
    album: ALBUMS.power,
    anecdote:
      "« Power Icarius » — un surnom qui incarne à la fois la puissance vocale et l'énergie scénique incomparable de Fally Ipupa.",
    category: "Identité",
  },
  {
    id: 7,
    question:
      "Dans quelle grande salle parisienne Fally a-t-il triomphé avant le Stade de France ?",
    options: [
      "La Cigale",
      "Zénith de Paris",
      "Salle Pleyel",
      "Accor Arena (Bercy)",
    ],
    correct: 3,
    image: "/images/fally/fally-paris.jpg",
    album: ALBUMS.formule,
    anecdote:
      "Fally a rempli l'Accor Arena (anciennement Bercy) à plusieurs reprises — une étape majeure avant l'historique Stade de France 2026.",
    category: "Concerts",
  },
  {
    id: 8,
    question:
      "Avec quel artiste Fally a-t-il sorti le hit « Jaloux » en 2017 ?",
    options: ["Stromae", "Maître Gims", "Dadju", "Aya Nakamura"],
    correct: 2,
    image: "/images/fally/fally-cameroun-2021.jpg",
    album: ALBUMS.tokooos,
    anecdote:
      "Le duo « Jaloux » avec Dadju, sorti sur l'album Tokooos en 2017, a conquis la France entière et propulsé Fally vers un public francophone encore plus large.",
    category: "Collaborations",
  },
  {
    id: 9,
    question: "Quel style musical est au cœur de l'identité artistique de Fally Ipupa ?",
    options: [
      "Coupé-Décalé ivoirien",
      "Afrobeats nigérian",
      "Mbalax sénégalais",
      "Ndombolo / Rumba congolaise",
    ],
    correct: 3,
    image: "/images/fally/fally-global-citizen.jpg",
    album: ALBUMS.arsenal,
    anecdote:
      "Fally est le maître incontesté du Ndombolo, dérivé énergique de la rumba congolaise — un genre inscrit au patrimoine immatériel de l'UNESCO.",
    category: "Musique",
  },
  {
    id: 10,
    question:
      "Les 2 et 3 mai 2026, Fally entre dans l'histoire en devenant quoi ?",
    options: [
      "Le premier Africain à chanter à l'Élysée",
      "Le premier artiste congolais au Stade de France",
      "L'artiste le plus streamé de France",
      "Producteur officiel de la Coupe du Monde 2026",
    ],
    correct: 1,
    image: "/images/fally/fally-paris.jpg",
    album: ALBUMS.formule,
    anecdote:
      "Fally Ipupa Nsimba devient le premier artiste congolais — et l'un des rares Africains — à se produire au Stade de France, deux nuits consécutives devant plus de 160 000 spectateurs.",
    category: "Histoire",
  },
] as const;

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

  const q = QUESTIONS[current];
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
      setScore((s) => Math.min(QUESTIONS.length, s + bonus));
      setCombo((c) => c + 1);
    } else {
      setCombo(0);
    }
    setAnswers((a) => [...a, { correct, id: q.id }]);
    setPhase("feedback");
  }

  function handleNext() {
    if (current + 1 >= QUESTIONS.length) {
      setPhase("results");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setPhase("question");
    }
  }

  function handleRestart() {
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
            /{QUESTIONS.length}
          </span>
        </div>

        {/* Answer trail */}
        <div className="mb-10 flex justify-center gap-1.5">
          {answers.map((answer) => (
            <div
              key={answer.id}
              className={cn(
                "h-2 w-6 rounded-full transition-all",
                answer.correct ? "bg-blood" : "bg-white/15",
              )}
            />
          ))}
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
            Rejouer
          </button>
          <button
            onClick={() => {
              const text = `Je suis "${profile.title}" sur le Quiz Fally Ipupa ! ${score}/${QUESTIONS.length} 🎵 #FallyStadeDeFrance #MbokaHub`;
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
              {current + 1} / {QUESTIONS.length}
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
          {answers.map((answer) => (
            <div
              key={answer.id}
              className={cn(
                "h-1 flex-1 rounded-full",
                answer.correct ? "bg-blood" : "bg-white/20",
              )}
            />
          ))}
          {QUESTIONS.slice(answers.length).map((question) => (
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

        <div className="relative z-10 grid gap-7 p-5 sm:grid-cols-[170px_1fr] sm:p-8">
          <div className="relative mx-auto w-full max-w-[180px] sm:mx-0">
            <div className="absolute left-8 top-1/2 hidden size-32 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,transparent_0_15%,rgba(245,239,228,0.18)_16%_17%,rgba(8,8,8,0.92)_18%_100%)] shadow-[0_16px_60px_rgba(0,0,0,0.55)] sm:block" />
            <div
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border border-white/15 bg-smoke shadow-[0_24px_70px_rgba(0,0,0,0.55)] transition-all duration-500",
                phase === "feedback"
                  ? "rotate-0 scale-100"
                  : "-rotate-3 hover:rotate-0 hover:scale-[1.02]",
              )}
            >
              <Image
                alt={`Pochette ${q.album.title}`}
                className="object-cover"
                fill
                priority
                sizes="180px"
                src={q.album.cover}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-70" />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-ink/70 px-3 py-2 backdrop-blur">
              <span className="truncate font-mono text-[9px] uppercase tracking-wider text-paper-dim">
                {q.album.title}
              </span>
              <span className="font-display text-lg leading-none text-blood">
                {q.album.year}
              </span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <div className="mb-6 flex flex-wrap items-center gap-3">
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
                    "ml-auto font-display text-3xl leading-none tabular-nums",
                    timeLeft <= 5
                      ? "animate-pulse text-red-400"
                      : "text-paper-mute",
                  )}
                >
                  {timeLeft}
                </span>
              )}
            </div>

            <h2 className="font-display text-3xl uppercase leading-tight text-paper sm:text-4xl">
              {q.question}
            </h2>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((option, idx) => {
          const isSelected = selected === idx;
          const isCorrect = phase === "feedback" && idx === q.correct;
          const isWrong =
            phase === "feedback" && isSelected && idx !== q.correct;
          const isElim =
            phase === "feedback" && !isSelected && idx !== q.correct;

          return (
            <button
              key={option}
              onClick={() => handleSelect(idx)}
              disabled={phase === "feedback"}
              type="button"
              className={cn(
                "group relative flex min-h-[96px] items-center gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200",
                phase === "question" &&
                  !isSelected &&
                  "border-white/5 bg-coal/40 hover:-translate-y-0.5 hover:border-white/20 hover:bg-coal/70",
                phase === "question" &&
                  isSelected &&
                  "border-blood bg-blood/10 shadow-[0_0_24px_rgba(230,57,70,0.26)]",
                isCorrect && "border-emerald-500/50 bg-emerald-500/10",
                isWrong && "border-red-500/30 bg-red-500/5",
                isElim && "border-white/5 bg-coal/20 opacity-40",
              )}
            >
              <div
                className={cn(
                  "absolute inset-y-0 left-0 w-1 bg-white/10 transition-colors",
                  isSelected && phase === "question" && "bg-blood",
                  isCorrect && "bg-emerald-500",
                  isWrong && "bg-red-500",
                )}
              />

              {/* Letter badge */}
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-bold transition-all",
                  phase === "question" &&
                    !isSelected &&
                    "border-white/10 text-paper-mute",
                  phase === "question" &&
                    isSelected &&
                    "border-blood bg-blood text-white",
                  isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                  isWrong && "border-red-500/50 text-red-400 bg-red-500/10",
                  isElim && "border-white/5 text-white/20",
                )}
              >
                {isCorrect ? (
                  <CheckCircle2 className="size-5" />
                ) : isWrong ? (
                  <XCircle className="size-5" />
                ) : (
                  String.fromCharCode(65 + idx)
                )}
              </div>

              <span
                className={cn(
                  "font-body text-base leading-snug",
                  phase === "question" && !isSelected && "text-paper-dim",
                  phase === "question" && isSelected && "text-paper",
                  isCorrect && "font-medium text-emerald-400",
                  isWrong && "text-red-400",
                  isElim && "text-white/25",
                )}
              >
                {option}
              </span>

              {/* Glow on correct */}
              {isCorrect && (
                <div className="absolute inset-0 -z-10 animate-pulse bg-emerald-500/5 rounded-2xl" />
              )}
            </button>
          );
        })}
      </div>

      {/* Anecdote / CTA */}
      {phase === "feedback" ? (
        <div className="space-y-4">
          <div
            className={cn(
              "grid gap-4 rounded-2xl border p-5 sm:grid-cols-[76px_1fr]",
              selected === q.correct
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/15 bg-red-500/5",
            )}
          >
            <div className="relative aspect-square w-20 overflow-hidden rounded-xl border border-white/10 bg-smoke">
              <Image
                alt={`Pochette ${q.album.title}`}
                className="object-cover"
                fill
                sizes="80px"
                src={q.album.cover}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
                {selected === q.correct ? (
                  <CheckCircle2 className="size-7 text-emerald-400" />
                ) : (
                  <XCircle className="size-7 text-red-400" />
                )}
              </div>
            </div>
            <div>
              <p
                className={cn(
                  "mb-1 font-mono text-[9px] uppercase tracking-widest",
                  selected === q.correct ? "text-emerald-400" : "text-red-400",
                )}
              >
                {selected === q.correct
                  ? "Bonne réponse !"
                  : selected === -1
                    ? "Temps écoulé !"
                    : "Pas tout à fait…"}
              </p>
              <p className="font-body text-sm leading-relaxed text-paper-dim italic">
                {q.anecdote}
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blood py-5 font-mono text-sm uppercase tracking-wider text-white shadow-glow-blood hover:bg-blood/90 transition-all"
          >
            {current + 1 >= QUESTIONS.length
              ? "Voir mon profil fan"
              : "Question suivante"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleConfirm()}
          disabled={selected === null}
          type="button"
          className={cn(
            "w-full rounded-2xl py-5 font-mono text-sm uppercase tracking-wider transition-all",
            selected !== null
              ? "bg-blood text-white shadow-glow-blood hover:bg-blood/90"
              : "cursor-not-allowed bg-smoke/30 text-paper-mute",
          )}
        >
          Valider
        </button>
      )}
    </div>
  );
}
