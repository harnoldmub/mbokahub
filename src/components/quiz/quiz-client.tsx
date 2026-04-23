"use client";

import {
  CheckCircle2,
  Flame,
  RotateCcw,
  Share2,
  Star,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    id: 1,
    question:
      "Quelles sont les deux dates officielles du concert de Fally Ipupa au Stade de France ?",
    options: [
      "1 et 2 mai 2026",
      "2 et 3 mai 2026",
      "3 et 4 mai 2026",
      "8 et 9 mai 2026",
    ],
    correct: 1,
    anecdote:
      "Les annonces publiques listent bien deux dates : samedi 2 mai et dimanche 3 mai 2026.",
  },
  {
    id: 2,
    question: "Quelle gare RER B dessert directement le Stade de France ?",
    options: [
      "La Plaine Stade de France",
      "Gare du Nord",
      "Châtelet Les Halles",
      "Saint-Michel Notre-Dame",
    ],
    correct: 0,
    anecdote:
      "La gare La Plaine Stade de France est l'accès RER B indiqué par le stade.",
  },
  {
    id: 3,
    question: "Quelle gare RER D est recommandée pour le stade ?",
    options: [
      "Gare de Lyon",
      "Stade de France Saint-Denis",
      "Pierrefitte Stains",
      "Nation",
    ],
    correct: 1,
    anecdote:
      "Le RER D dessert la gare Stade de France Saint-Denis, à distance de marche de l'enceinte.",
  },
  {
    id: 4,
    question: "Quelle ligne de métro mène à Saint-Denis Porte de Paris ?",
    options: ["Ligne 4", "Ligne 9", "Ligne 13", "Ligne 11"],
    correct: 2,
    anecdote:
      "La ligne 13 est l'accès métro historique pour Saint-Denis Porte de Paris.",
  },
  {
    id: 5,
    question: "Quel prix public minimum est affiché pour la seconde date ?",
    options: ["29 EUR", "45 EUR", "63 EUR", "120 EUR"],
    correct: 2,
    anecdote:
      "La billetterie officielle affiche un prix public à partir de 63 EUR selon les catégories restantes.",
  },
  {
    id: 6,
    question:
      "Quel est le statut public annoncé pour la première date du concert ?",
    options: ["Annulée", "Reportée", "Complète", "Gratuite"],
    correct: 2,
    anecdote:
      "La première date est annoncée complète sur la communication billetterie publique.",
  },
  {
    id: 7,
    question:
      "À partir de quel prix les parkings officiels événement sont affichés ?",
    options: ["10 EUR", "19 EUR", "29 EUR", "49 EUR"],
    correct: 2,
    anecdote:
      "Le Stade de France affiche des parkings événement à réserver en ligne à partir de 29 EUR.",
  },
  {
    id: 8,
    question: "Quelle limite de sac est indiquée par le Stade de France ?",
    options: ["5 L", "15 L", "40 L", "Aucune limite"],
    correct: 1,
    anecdote:
      "Les sacs ne doivent pas dépasser 15 L, soit environ un format A4.",
  },
  {
    id: 9,
    question: "Les valises sont-elles acceptées dans le stade ?",
    options: [
      "Oui, sans limite",
      "Oui, seulement en tribune",
      "Non",
      "Oui, si elles sont vides",
    ],
    correct: 2,
    anecdote:
      "Les valises font partie des objets interdits. Il vaut mieux voyager léger.",
  },
  {
    id: 10,
    question:
      "Comment Mboka Hub doit-il traiter les billets des afters autour du concert ?",
    options: [
      "Les revendre directement",
      "Faire payer entre utilisateurs",
      "Rediriger vers les billetteries externes",
      "Collecter les paiements pour les organisateurs",
    ],
    correct: 2,
    anecdote:
      "Mboka Hub reste une plateforme de mise en relation : les afters renvoient vers des billetteries externes.",
  },
] as const;

const FAN_PROFILES = [
  {
    min: 0,
    max: 3,
    title: "Fan en repérage",
    subtitle: "Tu arrives, tu observes, tu apprends vite.",
    description:
      "Tu as encore quelques infos pratiques à verrouiller avant le week-end.",
    icon: Star,
    color: "text-paper-dim",
    glow: "",
    bg: "from-smoke/50",
  },
  {
    min: 4,
    max: 6,
    title: "Fan organisé",
    subtitle: "Tu connais les bases utiles.",
    description:
      "Trajet, horaires, sacs, parking : tu as déjà les bons réflexes.",
    icon: Flame,
    color: "text-ember",
    glow: "shadow-[0_0_30px_rgba(255,100,0,0.3)]",
    bg: "from-ember/10",
  },
  {
    min: 7,
    max: 8,
    title: "Guide du groupe",
    subtitle: "Tu peux gérer le plan WhatsApp.",
    description:
      "Tu maîtrises l'essentiel pour aider les proches qui viennent de loin.",
    icon: Trophy,
    color: "text-gold",
    glow: "shadow-[0_0_40px_rgba(255,184,0,0.4)]",
    bg: "from-gold/10",
  },
  {
    min: 9,
    max: 10,
    title: "Capitaine Mboka",
    subtitle: "Plan carré, stress minimum.",
    description:
      "Tu connais les vraies infos et tu peux guider tout le monde jusqu'au stade.",
    icon: CheckCircle2,
    color: "text-blood",
    glow: "shadow-glow-blood",
    bg: "from-blood/10",
  },
] as const;

export function QuizClient() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = QUESTIONS[current];
  const isCorrect = selected === question.correct;
  const progress = (current / QUESTIONS.length) * 100;
  const profile =
    FAN_PROFILES.find((item) => score >= item.min && score <= item.max) ??
    FAN_PROFILES[0];
  const ProfileIcon = profile.icon;

  function handleSelect(index: number) {
    if (!confirmed) {
      setSelected(index);
    }
  }

  function handleConfirm() {
    if (selected === null) {
      return;
    }

    const correct = selected === question.correct;
    setConfirmed(true);
    setAnswers((currentAnswers) => [...currentAnswers, correct]);

    if (correct) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function handleNext() {
    if (current + 1 >= QUESTIONS.length) {
      setFinished(true);
      return;
    }

    setCurrent((currentQuestion) => currentQuestion + 1);
    setSelected(null);
    setConfirmed(false);
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div
          className={cn(
            "mb-8 mx-auto inline-flex size-28 items-center justify-center rounded-[2.5rem] border border-white/10 bg-gradient-to-br",
            profile.bg,
            "to-transparent",
            profile.glow,
          )}
        >
          <ProfileIcon className={cn("size-14", profile.color)} />
        </div>

        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-paper-mute">
          Résultat final
        </p>
        <h2
          className={cn(
            "mb-2 font-display text-6xl uppercase leading-[0.9] sm:text-7xl",
            profile.color,
          )}
        >
          {profile.title}
        </h2>
        <p className="mb-6 font-serif italic text-xl text-paper-dim">
          {profile.subtitle}
        </p>
        <p className="mx-auto mb-10 max-w-sm font-body text-paper-dim leading-relaxed">
          {profile.description}
        </p>

        <div className="mb-12 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-smoke/50 px-8 py-5">
          <span className="font-display text-6xl text-paper leading-none">
            {score}
          </span>
          <span className="font-display text-3xl text-paper-mute leading-none">
            / {QUESTIONS.length}
          </span>
        </div>

        <div className="mb-8 grid grid-cols-10 gap-2">
          {QUESTIONS.map((item, index) => (
            <div
              className={cn(
                "h-2 rounded-full",
                answers[index] ? "bg-blood" : "bg-white/10",
              )}
              key={item.id}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-smoke/50 px-8 py-4 font-mono text-xs uppercase tracking-wider text-paper transition-all hover:border-white/30 hover:bg-smoke"
            onClick={handleRestart}
            type="button"
          >
            <RotateCcw className="size-4" />
            Rejouer
          </button>
          <button
            className="flex items-center gap-2 rounded-2xl bg-blood px-8 py-4 font-mono text-xs uppercase tracking-wider text-white shadow-glow-blood transition-all hover:bg-blood/90"
            onClick={() => {
              const text = `Je suis "${profile.title}" sur le quiz Mboka Hub. Score : ${score}/${QUESTIONS.length}`;

              if (navigator.share) {
                navigator.share({ text, title: "Quiz Mboka Hub" });
              } else {
                navigator.clipboard.writeText(text);
                alert("Résultat copié dans le presse-papier !");
              }
            }}
            type="button"
          >
            <Share2 className="size-4" />
            Partager
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-10 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
            Question {current + 1} / {QUESTIONS.length}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            {score} pts
          </p>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-blood transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-8 rounded-[2rem] border border-white/5 bg-coal/50 p-8">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-paper-mute">
          Infos pratiques vérifiées
        </p>
        <h2 className="font-display text-2xl uppercase text-paper leading-tight sm:text-3xl">
          {question.question}
        </h2>
      </div>

      <div className="mb-8 grid gap-3">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isRight = confirmed && index === question.correct;
          const isWrong = confirmed && isSelected && index !== question.correct;

          return (
            <button
              className={cn(
                "group flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-200",
                !confirmed &&
                  !isSelected &&
                  "border-white/5 bg-coal/30 hover:border-white/20 hover:bg-coal/50",
                !confirmed &&
                  isSelected &&
                  "border-blood bg-blood/10 shadow-[0_0_20px_rgba(220,38,38,0.15)]",
                isRight && "border-green-500/50 bg-green-500/10",
                isWrong && "border-red-500/30 bg-red-500/5",
              )}
              disabled={confirmed}
              key={option}
              onClick={() => handleSelect(index)}
              type="button"
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-xl border font-mono text-xs transition-all",
                  !confirmed &&
                    !isSelected &&
                    "border-white/10 text-paper-mute",
                  !confirmed &&
                    isSelected &&
                    "border-blood bg-blood/20 text-blood",
                  isRight && "border-green-500 bg-green-500 text-white",
                  isWrong && "border-red-500/50 text-red-400",
                )}
              >
                {confirmed && isRight ? (
                  <CheckCircle2 className="size-4" />
                ) : confirmed && isWrong ? (
                  <XCircle className="size-4" />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </div>
              <span
                className={cn(
                  "font-body text-base",
                  !confirmed && "text-paper-dim",
                  !confirmed && isSelected && "text-paper",
                  isRight && "font-medium text-green-400",
                  isWrong && "text-red-400",
                )}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {confirmed ? (
        <div
          className={cn(
            "mb-8 rounded-2xl border p-5 transition-all",
            isCorrect
              ? "border-green-500/20 bg-green-500/5"
              : "border-red-500/20 bg-red-500/5",
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="size-4 text-green-400" />
            ) : (
              <XCircle className="size-4 text-red-400" />
            )}
            <p
              className={cn(
                "font-mono text-[9px] uppercase tracking-widest",
                isCorrect ? "text-green-400" : "text-red-400",
              )}
            >
              {isCorrect ? "Bonne réponse" : "Pas tout à fait"}
            </p>
          </div>
          <p className="font-body text-sm text-paper-dim leading-relaxed italic">
            {question.anecdote}
          </p>
        </div>
      ) : null}

      <div className="flex justify-end">
        {confirmed ? (
          <button
            className="flex items-center gap-2 rounded-2xl bg-blood px-8 py-4 font-mono text-xs uppercase tracking-wider text-white shadow-glow-blood transition-all hover:bg-blood/90"
            onClick={handleNext}
            type="button"
          >
            {current + 1 >= QUESTIONS.length ? "Voir le résultat" : "Suivant"}
          </button>
        ) : (
          <button
            className="flex items-center gap-2 rounded-2xl bg-blood px-8 py-4 font-mono text-xs uppercase tracking-wider text-white shadow-glow-blood transition-all hover:bg-blood/90 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={selected === null}
            onClick={handleConfirm}
            type="button"
          >
            Valider
          </button>
        )}
      </div>
    </div>
  );
}
