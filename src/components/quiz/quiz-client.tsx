"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, CheckCircle2, Crown, Flame, Music,
  RotateCcw, Share2, Star, Trophy, XCircle, Zap,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ── Questions ──────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question: "Quel est le vrai nom complet de Fally Ipupa ?",
    options: ["Fally Ipupa Ngimbi Loseke", "Fally Ipupa Diamond Gode", "Fally Ipupa Mutuani", "Fally Ipupa Koffi"],
    correct: 1,
    image: "/images/fally/fally-paris.jpg",
    anecdote: "Son nom complet est Fally Ipupa Diamond Gode — le surnom « Diamond » est devenu sa marque de fabrique.",
    category: "Identité",
  },
  {
    id: 2,
    question: "Dans quelle ville Fally Ipupa est-il né ?",
    options: ["Brazzaville", "Lubumbashi", "Kinshasa", "Lomé"],
    correct: 2,
    image: "/images/fally/fally-cameroun-2021.jpg",
    anecdote: "Fally est né à Kinshasa, capitale de la RD Congo, le 14 décembre 1977.",
    category: "Biographie",
  },
  {
    id: 3,
    question: "Avec quel groupe Fally a-t-il débuté avant sa carrière solo ?",
    options: ["Wenge Musica", "Extra Musica", "Victoria Eleison", "Quartier Latin de Koffi Olomidé"],
    correct: 3,
    image: "/images/fally/fally-global-citizen.jpg",
    anecdote: "Fally a brillé dans le Quartier Latin de Koffi Olomidé au début des années 2000 avant son envol solo en 2006.",
    category: "Carrière",
  },
  {
    id: 4,
    question: "Quel est le titre du premier album solo de Fally Ipupa ?",
    options: ["Power", "Tokooos", "Nzimbu", "Arsenal de Belles Mélodies"],
    correct: 3,
    image: "/images/fally/fally-paris.jpg",
    anecdote: "« Arsenal de Belles Mélodies » sorti en 2009 a lancé sa carrière internationale en solo.",
    category: "Discographie",
  },
  {
    id: 5,
    question: "Pour quelle organisation internationale Fally est-il ambassadeur ?",
    options: ["UNESCO", "OMS", "UNICEF", "ONU Femmes"],
    correct: 2,
    image: "/images/fally/fally-cameroun-2021.jpg",
    anecdote: "Fally est ambassadeur de l'UNICEF depuis 2012, s'engageant pour les droits des enfants dans le monde.",
    category: "Engagement",
  },
  {
    id: 6,
    question: "Quel est le surnom légendaire de Fally Ipupa ?",
    options: ["Le Roi du Ndombolo", "Diamond Boy", "Power Icarius", "Le Saphir de Kinshasa"],
    correct: 2,
    image: "/images/fally/fally-global-citizen.jpg",
    anecdote: "« Power Icarius » — une fusion de puissance et de mythologie qui résume l'aura scénique de Fally.",
    category: "Identité",
  },
  {
    id: 7,
    question: "Dans quelle salle parisienne Fally a-t-il performé avant le Stade de France ?",
    options: ["La Cigale", "Zénith de Paris", "Salle Pleyel", "Accor Arena (Bercy)"],
    correct: 3,
    image: "/images/fally/fally-paris.jpg",
    anecdote: "Fally a rempli l'Accor Arena plusieurs fois — avant de franchir l'ultime étape : le Stade de France.",
    category: "Concerts",
  },
  {
    id: 8,
    question: "Avec quel artiste Fally a-t-il sorti le hit « Jaloux » en 2017 ?",
    options: ["Stromae", "Aya Nakamura", "Dadju", "Maître Gims"],
    correct: 2,
    image: "/images/fally/fally-cameroun-2021.jpg",
    anecdote: "Le duo « Jaloux » avec Dadju a conquis la France entière et ouvert Fally à un public francophone encore plus large.",
    category: "Collaborations",
  },
  {
    id: 9,
    question: "Quel style musical est la signature de Fally Ipupa ?",
    options: ["Coupé-Décalé ivoirien", "Afrobeats nigérian", "Ndombolo / Rumba congolaise", "Mbalax sénégalais"],
    correct: 2,
    image: "/images/fally/fally-global-citizen.jpg",
    anecdote: "Fally est le maître du Ndombolo, dérivé énergique de la rumba congolaise — enrichi de sonorités modernes.",
    category: "Musique",
  },
  {
    id: 10,
    question: "Les 2 et 3 mai 2026, Fally entre dans l'histoire en faisant quoi ?",
    options: [
      "Remplir l'Olympia deux soirs",
      "Faire un concert Netflix",
      "Collaborer avec la Comédie-Française",
      "Devenir le 1er artiste congolais au Stade de France",
    ],
    correct: 3,
    image: "/images/fally/fally-paris.jpg",
    anecdote: "Fally Ipupa devient le premier artiste congolais à se produire au Stade de France — deux nuits consécutives !",
    category: "Histoire",
  },
] as const;

// ── Fan profiles ───────────────────────────────────────────────────────────────
const PROFILES = [
  {
    range: [0, 3] as const,
    title: "Nouveau Fan",
    subtitle: "Bienvenue dans la famille Fally !",
    description: "Le concert du Stade de France va être une vraie révélation pour toi.",
    icon: Star,
    color: "text-paper-dim",
    accent: "from-smoke/50 to-smoke/20",
    border: "border-white/10",
  },
  {
    range: [4, 6] as const,
    title: "Fan Certifié",
    subtitle: "Tu connais bien ton Power Icarius.",
    description: "Tu suis Fally depuis un moment. Le Stade de France va être une soirée inoubliable.",
    icon: Flame,
    color: "text-ember",
    accent: "from-ember/20 to-ember/5",
    border: "border-ember/30",
  },
  {
    range: [7, 8] as const,
    title: "Vrai Mbokaman",
    subtitle: "Un fan de la première heure !",
    description: "Tu maîtrises l'histoire et la culture Fally. Tu fais partie de ceux qui ont suivi l'ascension depuis le début.",
    icon: Trophy,
    color: "text-gold",
    accent: "from-gold/20 to-gold/5",
    border: "border-gold/30",
  },
  {
    range: [9, 10] as const,
    title: "Légende Vivante",
    subtitle: "Power Icarius lui-même t'approuverait !",
    description: "Score parfait ou quasi-parfait. Tu es l'encyclopédie vivante de Mboka Hub.",
    icon: Crown,
    color: "text-blood",
    accent: "from-blood/20 to-blood/5",
    border: "border-blood/30",
  },
] as const;

const TIMER_SECONDS = 20;
const CATEGORY_COLORS: Record<string, string> = {
  "Identité": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Biographie": "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "Carrière": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Discographie": "bg-blood/20 text-blood border-blood/30",
  "Engagement": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Concerts": "bg-gold/20 text-gold border-gold/30",
  "Collaborations": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Musique": "bg-ember/20 text-ember border-ember/30",
  "Histoire": "bg-blood/20 text-blood border-blood/30",
};

// ── Component ──────────────────────────────────────────────────────────────────
export function QuizClient() {
  const [phase, setPhase] = useState<"question" | "feedback" | "results">("question");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = QUESTIONS[current];
  const profile = PROFILES.find(p => score >= p.range[0] && score <= p.range[1]) ?? PROFILES[0];
  const ProfileIcon = profile.icon;

  // Timer
  useEffect(() => {
    if (phase !== "question") return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleConfirm(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase]);

  function handleSelect(idx: number) {
    if (phase !== "question") return;
    setSelected(idx);
  }

  function handleConfirm(forcedIdx?: number) {
    clearInterval(timerRef.current!);
    const choice = forcedIdx !== undefined ? forcedIdx : selected;
    const correct = choice === q.correct;
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    if (correct) {
      const bonus = combo >= 2 ? 2 : 1;
      setScore(s => s + bonus);
      setCombo(c => c + 1);
    } else {
      setCombo(0);
    }
    setAnswers(a => [...a, correct]);
    setPhase("feedback");
  }

  function handleNext() {
    if (current + 1 >= QUESTIONS.length) {
      setPhase("results");
    } else {
      setCurrent(c => c + 1);
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
  const timerColor = timerPct > 50 ? "bg-blood" : timerPct > 25 ? "bg-amber-400" : "bg-red-600";

  // ── Results ──────────────────────────────────────────────────────────────────
  if (phase === "results") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className={cn(
          "relative mx-auto mb-8 flex size-36 items-center justify-center overflow-hidden rounded-[2.5rem] border bg-gradient-to-br",
          profile.accent, profile.border,
        )}>
          <ProfileIcon className={cn("size-16 drop-shadow-lg", profile.color)} />
          {score >= 9 && (
            <div className="absolute inset-0 animate-pulse bg-blood/10" />
          )}
        </div>

        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-paper-mute">
          Profil Fally
        </p>
        <h2 className={cn("mb-1 font-display text-6xl uppercase leading-none sm:text-7xl", profile.color)}>
          {profile.title}
        </h2>
        <p className="mb-6 font-serif italic text-xl text-paper-dim">{profile.subtitle}</p>
        <p className="mx-auto mb-10 max-w-xs font-body text-sm leading-relaxed text-paper-mute">
          {profile.description}
        </p>

        {/* Score display */}
        <div className="mb-8 inline-flex items-end gap-2 rounded-3xl border border-white/10 bg-smoke/50 px-10 py-6">
          <span className="font-display text-7xl text-paper leading-none">{score}</span>
          <span className="mb-1 font-display text-3xl text-paper-mute leading-none">/{QUESTIONS.length}</span>
        </div>

        {/* Answer trail */}
        <div className="mb-10 flex justify-center gap-1.5">
          {answers.map((ok, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-6 rounded-full transition-all",
                ok ? "bg-blood" : "bg-white/15",
              )}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-smoke/50 px-8 py-4 font-mono text-[11px] uppercase tracking-wider text-paper transition-all hover:border-white/30 hover:bg-smoke"
          >
            <RotateCcw className="size-4" />
            Rejouer
          </button>
          <button
            onClick={() => {
              const text = `Je suis "${profile.title}" sur le Quiz Fally Ipupa ! ${score}/${QUESTIONS.length} 🎵 #FallyStadeDeFrance #MbokaHub`;
              if (navigator.share) navigator.share({ text, title: "Quiz Fally Ipupa" });
              else { navigator.clipboard.writeText(text); alert("Résultat copié !"); }
            }}
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
    <div className="mx-auto max-w-2xl px-4">
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
            <span className="font-display text-lg text-paper leading-none">{score}</span>
          </div>
        </div>

        {/* Answer trail dots */}
        <div className="flex gap-1">
          {answers.map((ok, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full", ok ? "bg-blood" : "bg-white/20")} />
          ))}
          {Array.from({ length: QUESTIONS.length - answers.length }).map((_, i) => (
            <div key={`e-${i}`} className="h-1 flex-1 rounded-full bg-white/5" />
          ))}
        </div>

        {/* Timer bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={cn("h-full rounded-full transition-all", timerColor, phase === "feedback" && "opacity-30")}
            style={{ width: `${timerPct}%`, transitionDuration: "1000ms" }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className={cn("relative mb-6 overflow-hidden rounded-[2rem] border border-white/10", shake && "animate-[shake_0.4s_ease-in-out]")}>
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

        <div className="relative z-10 p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className={cn(
              "rounded-lg border px-3 py-1 font-mono text-[9px] uppercase tracking-widest",
              CATEGORY_COLORS[q.category] ?? "bg-white/10 text-paper-mute border-white/10",
            )}>
              {q.category}
            </span>
            <div className="flex items-center gap-1.5">
              <Music className="size-3 text-blood/60" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-paper-mute/60">
                Fally Ipupa
              </span>
            </div>
            {phase === "question" && (
              <span className={cn(
                "ml-auto font-display text-2xl leading-none tabular-nums",
                timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-paper-mute",
              )}>
                {timeLeft}
              </span>
            )}
          </div>

          <h2 className="font-display text-2xl uppercase leading-tight text-paper sm:text-3xl">
            {q.question}
          </h2>
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((option, idx) => {
          const isSelected = selected === idx;
          const isCorrect = phase === "feedback" && idx === q.correct;
          const isWrong = phase === "feedback" && isSelected && idx !== q.correct;
          const isElim = phase === "feedback" && !isSelected && idx !== q.correct;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={phase === "feedback"}
              className={cn(
                "group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200",
                phase === "question" && !isSelected && "border-white/5 bg-coal/40 hover:border-white/20 hover:bg-coal/70",
                phase === "question" && isSelected && "border-blood bg-blood/10 shadow-[0_0_20px_rgba(220,38,38,0.2)]",
                isCorrect && "border-emerald-500/50 bg-emerald-500/10",
                isWrong && "border-red-500/30 bg-red-500/5",
                isElim && "border-white/3 bg-coal/20 opacity-40",
              )}
            >
              {/* Letter badge */}
              <div className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-bold transition-all",
                phase === "question" && !isSelected && "border-white/10 text-paper-mute",
                phase === "question" && isSelected && "border-blood bg-blood text-white",
                isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                isWrong && "border-red-500/50 text-red-400 bg-red-500/10",
                isElim && "border-white/5 text-white/20",
              )}>
                {isCorrect ? <CheckCircle2 className="size-5" /> :
                 isWrong ? <XCircle className="size-5" /> :
                 String.fromCharCode(65 + idx)}
              </div>

              <span className={cn(
                "font-body text-base leading-snug",
                phase === "question" && !isSelected && "text-paper-dim",
                phase === "question" && isSelected && "text-paper",
                isCorrect && "font-medium text-emerald-400",
                isWrong && "text-red-400",
                isElim && "text-white/25",
              )}>
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
          <div className={cn(
            "flex gap-4 rounded-2xl border p-5",
            selected === q.correct
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-red-500/15 bg-red-500/5",
          )}>
            <div className="mt-0.5 shrink-0">
              {selected === q.correct
                ? <CheckCircle2 className="size-5 text-emerald-400" />
                : <XCircle className="size-5 text-red-400" />}
            </div>
            <div>
              <p className={cn("mb-1 font-mono text-[9px] uppercase tracking-widest",
                selected === q.correct ? "text-emerald-400" : "text-red-400"
              )}>
                {selected === q.correct ? "Bonne réponse !" : selected === -1 ? "Temps écoulé !" : "Pas tout à fait…"}
              </p>
              <p className="font-body text-sm leading-relaxed text-paper-dim italic">
                {q.anecdote}
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blood py-5 font-mono text-sm uppercase tracking-wider text-white shadow-glow-blood hover:bg-blood/90 transition-all"
          >
            {current + 1 >= QUESTIONS.length ? "Voir mon profil fan" : "Question suivante"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleConfirm()}
          disabled={selected === null}
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
