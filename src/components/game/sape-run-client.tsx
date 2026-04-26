"use client";

import { ChevronUp, Play, RotateCcw, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ── Constants ─────────────────────────────────────────────────────────────────
const W = 800;
const H = 400;
const GROUND = H - 70;
const GRAVITY = 0.6;
const JUMP_FORCE = -13;
const INITIAL_SPEED = 5;
const SPEED_INCREMENT = 0.0015;

// ── Types ─────────────────────────────────────────────────────────────────────
type GameState = "idle" | "running" | "dead";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Obstacle extends Rect {
  type: "suitcase" | "combattant" | "barrier";
  color: string;
}

interface Collectible extends Rect {
  type: "hat" | "diamond" | "microphone";
  collected: boolean;
  bobOffset: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// ── Collision ─────────────────────────────────────────────────────────────────
function overlaps(a: Rect, b: Rect): boolean {
  const margin = 8;
  return (
    a.x + margin < b.x + b.w - margin &&
    a.x + a.w - margin > b.x + margin &&
    a.y + margin < b.y + b.h - margin &&
    a.y + a.h - margin > b.y + margin
  );
}

// ── Draw helpers ──────────────────────────────────────────────────────────────
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSapeur(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  tick: number,
  jumping: boolean,
) {
  const legSwing = jumping ? 0 : Math.sin(tick * 0.3) * 8;
  const armSwing = jumping ? -20 : Math.sin(tick * 0.3 + Math.PI) * 15;

  // Shadow
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(x + w / 2, GROUND + 2, w * 0.4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Wings (The Eagle / L'Aigle spirit)
  ctx.save();
  ctx.globalAlpha = 0.15 + Math.sin(tick * 0.1) * 0.05;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  // Left wing
  ctx.moveTo(x + w * 0.4, y + h * 0.4);
  ctx.quadraticCurveTo(x - 10, y - 5, x - 15, y + h * 0.3);
  ctx.lineTo(x + w * 0.4, y + h * 0.5);
  ctx.fill();
  // Right wing
  ctx.moveTo(x + w * 0.6, y + h * 0.4);
  ctx.quadraticCurveTo(x + w + 10, y - 5, x + w + 15, y + h * 0.3);
  ctx.lineTo(x + w * 0.6, y + h * 0.5);
  ctx.fill();
  ctx.restore();

  // Legs (Silver pants)
  ctx.save();
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  // Left leg
  ctx.save();
  ctx.translate(x + w * 0.35, y + h * 0.7);
  ctx.rotate((legSwing * Math.PI) / 180);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, h * 0.3); ctx.stroke();
  ctx.restore();
  // Right leg
  ctx.save();
  ctx.translate(x + w * 0.65, y + h * 0.7);
  ctx.rotate((-legSwing * Math.PI) / 180);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, h * 0.3); ctx.stroke();
  ctx.restore();
  ctx.restore();

  // Body (Silver Tokooos suit)
  const suitGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  suitGrad.addColorStop(0, "#f3f4f6");
  suitGrad.addColorStop(0.5, "#d1d5db");
  suitGrad.addColorStop(1, "#9ca3af");
  ctx.fillStyle = suitGrad;
  drawRoundRect(ctx, x + w * 0.2, y + h * 0.32, w * 0.6, h * 0.4, 6);
  ctx.fill();
  
  // Jewelry (Gold chains)
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + w * 0.5, y + h * 0.38, 8, 0, Math.PI);
  ctx.stroke();

  // Arms
  ctx.strokeStyle = "#f3f4f6";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  // Left arm
  ctx.save();
  ctx.translate(x + w * 0.2, y + h * 0.4);
  ctx.rotate((armSwing * Math.PI) / 180);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8, h * 0.28); ctx.stroke();
  ctx.restore();
  // Right arm
  ctx.save();
  ctx.translate(x + w * 0.8, y + h * 0.4);
  ctx.rotate((-armSwing * Math.PI) / 180);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(8, h * 0.28); ctx.stroke();
  ctx.restore();

  // Head
  ctx.fillStyle = "#5c4033"; // Darker skin tone
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h * 0.2, w * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Sunglasses (The Fally look)
  ctx.fillStyle = "#000";
  ctx.fillRect(x + w * 0.35, y + h * 0.16, w * 0.3, h * 0.08); // Sunglasses bar
  ctx.beginPath();
  ctx.arc(x + w * 0.4, y + h * 0.22, 5, 0, Math.PI * 2);
  ctx.arc(x + w * 0.6, y + h * 0.22, 5, 0, Math.PI * 2);
  ctx.fill();

  // Hairstyle (Fade/Short hair)
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h * 0.15, w * 0.23, Math.PI, 0);
  ctx.fill();
}

function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle, tick: number) {
  ctx.save();

  if (obs.type === "suitcase") {
    // Suitcase (The luggage)
    ctx.fillStyle = obs.color;
    drawRoundRect(ctx, obs.x, obs.y, obs.w, obs.h, 8);
    ctx.fill();
    ctx.strokeStyle = "#fff3";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(obs.x + obs.w * 0.3, obs.y - 10, obs.w * 0.4, 12, 4);
    ctx.stroke();
  }

  if (obs.type === "combattant") {
    // The "Combattant" Character
    const bounce = Math.sin(tick * 0.2) * 5;
    const signOsc = Math.sin(tick * 0.1) * 0.1;
    
    // Legs
    ctx.fillStyle = "#000";
    ctx.fillRect(obs.x + 10, obs.y + obs.h - 15, 8, 15);
    ctx.fillRect(obs.x + obs.w - 18, obs.y + obs.h - 15, 8, 15);
    // Body (Black hoodie)
    ctx.fillStyle = "#111";
    drawRoundRect(ctx, obs.x + 5, obs.y + 20 + bounce, obs.w - 10, obs.h - 35, 10);
    ctx.fill();
    // Head
    ctx.fillStyle = "#3d1f00";
    ctx.beginPath();
    ctx.arc(obs.x + obs.w / 2, obs.y + 15 + bounce, 12, 0, Math.PI * 2);
    ctx.fill();
    // Angry eyes
    ctx.strokeStyle = "#E50914";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(obs.x + obs.w/2 - 6, obs.y + 12 + bounce); ctx.lineTo(obs.x + obs.w/2 - 2, obs.y + 15 + bounce); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(obs.x + obs.w/2 + 6, obs.y + 12 + bounce); ctx.lineTo(obs.x + obs.w/2 + 2, obs.y + 15 + bounce); ctx.stroke();

    // Protest Sign
    ctx.save();
    ctx.translate(obs.x + obs.w / 2, obs.y - 10 + bounce);
    ctx.rotate(signOsc);
    ctx.fillStyle = "#78350f"; // Wood stick
    ctx.fillRect(-2, 0, 4, 30);
    ctx.fillStyle = "#fff"; // Paper
    ctx.fillRect(-25, -25, 50, 30);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(-25, -25, 50, 30);
    ctx.fillStyle = "#E50914";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("NO!", 0, -6);
    ctx.restore();
  }

  if (obs.type === "barrier") {
    // Police Barrier
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(obs.x, obs.y, 8, obs.h);
    ctx.fillRect(obs.x + obs.w - 8, obs.y, 8, obs.h);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(obs.x + 4, obs.y + obs.h * 0.25, obs.w - 8, obs.h * 0.2);
    ctx.fillStyle = "#000";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("POLICE", obs.x + obs.w / 2, obs.y + obs.h * 0.4);
  }

  ctx.restore();
}

function drawCollectible(
  ctx: CanvasRenderingContext2D,
  col: Collectible,
  tick: number,
) {
  if (col.collected) return;
  const bob = Math.sin(tick * 0.05 + col.bobOffset) * 4;

  ctx.save();
  ctx.translate(col.x + col.w / 2, col.y + col.h / 2 + bob);

  if (col.type === "hat") {
    // Top hat collectible
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(-10, 2, 20, 12);
    ctx.fillRect(-14, 12, 28, 5);
    // Band
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(-10, 8, 20, 4);
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(0, 8, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (col.type === "diamond") {
    ctx.fillStyle = "#67e8f9";
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(10, -4);
    ctx.lineTo(10, 4);
    ctx.lineTo(0, 12);
    ctx.lineTo(-10, 4);
    ctx.lineTo(-10, -4);
    ctx.closePath();
    ctx.fill();
    // Shine
    ctx.fillStyle = "#fff8";
    ctx.beginPath();
    ctx.moveTo(-3, -8);
    ctx.lineTo(3, -8);
    ctx.lineTo(5, -3);
    ctx.lineTo(-5, -3);
    ctx.closePath();
    ctx.fill();
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.shadowColor = "#67e8f9";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#67e8f9";
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (col.type === "microphone") {
    ctx.fillStyle = "#a855f7";
    ctx.beginPath();
    ctx.arc(0, -6, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(-2, 2, 4, 10);
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(-7, 12, 14, 3);
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#a855f7";
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function spawnObstacle(_speed: number): Obstacle {
  const types: Obstacle["type"][] = ["suitcase", "combattant", "barrier"];
  const type = types[Math.floor(Math.random() * types.length)];
  const colors: Record<string, string> = {
    suitcase: ["#1e3a5f", "#4a1942", "#1a3a1a", "#3d1f00"][
      Math.floor(Math.random() * 4)
    ],
    combattant: "#000",
    barrier: "#ef4444",
  };
  const sizes: Record<string, { w: number; h: number }> = {
    suitcase: { w: 50, h: 40 },
    combattant: { w: 40, h: 65 },
    barrier: { w: 60, h: 70 },
  };
  const s = sizes[type];
  return {
    x: W + 60,
    y: GROUND - s.h,
    w: s.w,
    h: s.h,
    type,
    color: colors[type],
  };
}

function spawnCollectible(): Collectible {
  const types: Collectible["type"][] = ["hat", "diamond", "microphone"];
  const type = types[Math.floor(Math.random() * types.length)];
  const heights = [GROUND - 80, GROUND - 130, GROUND - 180];
  const yPos = heights[Math.floor(Math.random() * heights.length)];
  return {
    x: W + 60,
    y: yPos,
    w: 30,
    h: 30,
    type,
    collected: false,
    bobOffset: Math.random() * Math.PI * 2,
  };
}

const COLLECTIBLE_SCORES: Record<string, number> = {
  hat: 50,
  diamond: 100,
  microphone: 150,
};

// ── Localized copy ────────────────────────────────────────────────────────────
export interface SapeRunCopy {
  idleEyebrow: string;
  idleTitle: string;
  idleTagline: string;
  start: string;
  controlsHint: string;
  gameOver: string;
  fallen: string;
  score: string;
  record: string;
  newRecord: string;
  retry: string;
  jumpHint: string;
  recordLabel: string;
  speed: string;
  goal: string;
}

const DEFAULT_COPY: SapeRunCopy = {
  idleEyebrow: "Mboka Hub Game",
  idleTitle: "Sape Run",
  idleTagline:
    "Aide le Sapeur à traverser Paris jusqu'au Stade de France. Ramasse chapeaux, diamants et micros !",
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
};

// ── Main Component ─────────────────────────────────────────────────────────────
export function SapeRunClient({ copy = DEFAULT_COPY }: { copy?: SapeRunCopy } = {}) {
  const c = copy;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>("idle");
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);

  // Player
  const playerRef = useRef({
    x: 80,
    y: GROUND - 60,
    w: 44,
    h: 60,
    vy: 0,
    onGround: true,
  });

  // World
  const obstaclesRef = useRef<Obstacle[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const speedRef = useRef(INITIAL_SPEED);
  const scoreRef = useRef(0);
  const nextObsRef = useRef(120);
  const nextColRef = useRef(200);
  const bgOffsetRef = useRef(0);

  // UI state (re-renders)
  const [gameState, setGameState] = useState<GameState>("idle");
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [_combo, setCombo] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("saperun_highscore");
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  const jump = useCallback(() => {
    const p = playerRef.current;
    if (p.onGround) {
      p.vy = JUMP_FORCE;
      p.onGround = false;
    }
  }, []);

  const startGame = useCallback(() => {
    playerRef.current = {
      x: 80,
      y: GROUND - 60,
      w: 44,
      h: 60,
      vy: 0,
      onGround: true,
    };
    obstaclesRef.current = [];
    collectiblesRef.current = [];
    particlesRef.current = [];
    speedRef.current = INITIAL_SPEED;
    scoreRef.current = 0;
    nextObsRef.current = 120;
    nextColRef.current = 200;
    bgOffsetRef.current = 0;
    tickRef.current = 0;
    stateRef.current = "running";
    setGameState("running");
    setDisplayScore(0);
    setCombo(0);
  }, []);

  const endGame = useCallback(() => {
    stateRef.current = "dead";
    setGameState("dead");
    const final = Math.floor(scoreRef.current);
    setHighScore((prev) => {
      const next = Math.max(prev, final);
      localStorage.setItem("saperun_highscore", String(next));
      return next;
    });
    // Death particles
    const p = playerRef.current;
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push({
        x: p.x + p.w / 2,
        y: p.y + p.h / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 1.5) * 8,
        life: 60,
        maxLife: 60,
        color: ["#dc2626", "#fbbf24", "#fff"][Math.floor(Math.random() * 3)],
        size: 4 + Math.random() * 4,
      });
    }
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const drawingContext = ctx;

    function loop() {
      rafRef.current = requestAnimationFrame(loop);
      const ctx = drawingContext;
      ctx.clearRect(0, 0, W, H);

      const state = stateRef.current;
      const tick = tickRef.current;
      const speed = speedRef.current;
      const player = playerRef.current;

      // ── Background ──────────────────────────────────────────────────────────
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0a0a14");
      sky.addColorStop(0.7, "#0f0f1a");
      sky.addColorStop(1, "#0c0c18");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = "#fff";
      const starSeed = [
        [50, 30],
        [120, 50],
        [200, 20],
        [300, 60],
        [450, 35],
        [550, 15],
        [650, 45],
        [700, 25],
        [750, 55],
        [170, 40],
        [380, 20],
        [480, 50],
        [580, 30],
        [680, 15],
        [780, 40],
      ];
      for (const [sx, sy] of starSeed) {
        const parallaxX = (((sx - bgOffsetRef.current * 0.02) % W) + W) % W;
        ctx.globalAlpha = 0.4 + Math.sin(tick * 0.05 + sx) * 0.2;
        ctx.beginPath();
        ctx.arc(parallaxX, sy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── Concert spotlight beams (sweep from horizon) ────────────────────────
      ctx.save();
      const sweep = Math.sin(tick * 0.012);
      const sweep2 = Math.sin(tick * 0.012 + Math.PI / 1.5);
      const beamOriginX = W * 0.55;
      const beamOriginY = GROUND - 30;
      for (const [angleBase, hue] of [
        [-Math.PI / 2 + sweep * 0.5, "#E50914"],
        [-Math.PI / 2 + sweep2 * 0.6, "#fbbf24"],
        [-Math.PI / 2 - sweep * 0.7, "#a855f7"],
      ] as const) {
        const grad = ctx.createLinearGradient(
          beamOriginX,
          beamOriginY,
          beamOriginX + Math.cos(angleBase as number) * 400,
          beamOriginY + Math.sin(angleBase as number) * 400,
        );
        grad.addColorStop(0, `${hue}55`);
        grad.addColorStop(1, `${hue}00`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(beamOriginX, beamOriginY);
        ctx.lineTo(
          beamOriginX + Math.cos((angleBase as number) - 0.06) * 500,
          beamOriginY + Math.sin((angleBase as number) - 0.06) * 500,
        );
        ctx.lineTo(
          beamOriginX + Math.cos((angleBase as number) + 0.06) * 500,
          beamOriginY + Math.sin((angleBase as number) + 0.06) * 500,
        );
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // ── Eiffel Tower silhouette (parallax layer 0.5) ────────────────────────
      ctx.save();
      const eiffelCycleW = W * 1.6;
      const eiffelX =
        ((((W * 0.18 - bgOffsetRef.current * 0.08) % eiffelCycleW) +
          eiffelCycleW) %
          eiffelCycleW) -
        80;
      const eBaseY = GROUND;
      const eTopY = GROUND - 200;
      const eHalfBaseW = 38;
      const eHalfTopW = 4;
      ctx.fillStyle = "#0f1024";
      ctx.globalAlpha = 0.85;
      // Tower silhouette (4-segment trapezoid)
      ctx.beginPath();
      ctx.moveTo(eiffelX - eHalfBaseW, eBaseY);
      ctx.lineTo(eiffelX - 22, eBaseY - 60);
      ctx.lineTo(eiffelX - 12, eBaseY - 130);
      ctx.lineTo(eiffelX - eHalfTopW, eTopY);
      ctx.lineTo(eiffelX + eHalfTopW, eTopY);
      ctx.lineTo(eiffelX + 12, eBaseY - 130);
      ctx.lineTo(eiffelX + 22, eBaseY - 60);
      ctx.lineTo(eiffelX + eHalfBaseW, eBaseY);
      ctx.closePath();
      ctx.fill();
      // Cross beams
      ctx.strokeStyle = "#0f1024";
      ctx.lineWidth = 2;
      for (let yy = eBaseY - 10; yy > eTopY + 10; yy -= 18) {
        const t = (yy - eTopY) / (eBaseY - eTopY);
        const halfW = eHalfTopW + t * (eHalfBaseW - eHalfTopW);
        ctx.beginPath();
        ctx.moveTo(eiffelX - halfW, yy);
        ctx.lineTo(eiffelX + halfW, yy - 8);
        ctx.moveTo(eiffelX + halfW, yy);
        ctx.lineTo(eiffelX - halfW, yy - 8);
        ctx.stroke();
      }
      // Blinking gold beacon at the tip
      const blink = (Math.sin(tick * 0.15) + 1) / 2;
      ctx.globalAlpha = 0.5 + blink * 0.5;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(eiffelX, eTopY - 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Stade de France (parallax layer 0 — the GOAL) ───────────────────────
      ctx.save();
      const stadiumCycleW = W * 1.8;
      const stX =
        ((((W * 0.7 - bgOffsetRef.current * 0.05) % stadiumCycleW) +
          stadiumCycleW) %
          stadiumCycleW) -
        100;
      const stY = GROUND - 50;

      // Glow halo behind stadium
      const stadiumGlow = ctx.createRadialGradient(stX, stY, 20, stX, stY, 220);
      stadiumGlow.addColorStop(0, "rgba(230, 57, 70, 0.35)");
      stadiumGlow.addColorStop(0.5, "rgba(251, 191, 36, 0.12)");
      stadiumGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = stadiumGlow;
      ctx.beginPath();
      ctx.arc(stX, stY, 220, 0, Math.PI * 2);
      ctx.fill();

      // Iconic elliptical roof
      ctx.fillStyle = "#26264a";
      ctx.beginPath();
      ctx.ellipse(stX, stY, 200, 70, 0, 0, Math.PI * 2);
      ctx.fill();
      // Inner darker ellipse (opening)
      ctx.fillStyle = "#0a0a18";
      ctx.beginPath();
      ctx.ellipse(stX, stY + 5, 160, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pillars
      ctx.fillStyle = "#1a1a35";
      for (let i = -180; i <= 180; i += 30) {
        const ph = 50 - Math.abs(i) * 0.06;
        ctx.fillRect(stX + i - 3, stY + 10, 6, ph);
      }

      // Floodlights (4 pulsing lamps on top of roof)
      const flood = 0.5 + Math.sin(tick * 0.08) * 0.4;
      for (const fx of [-150, -50, 50, 150]) {
        ctx.fillStyle = `rgba(255, 240, 180, ${flood})`;
        ctx.beginPath();
        ctx.arc(stX + fx, stY - 65, 5, 0, Math.PI * 2);
        ctx.fill();
        // Light beam upward
        ctx.fillStyle = `rgba(255, 240, 180, ${flood * 0.15})`;
        ctx.beginPath();
        ctx.moveTo(stX + fx, stY - 65);
        ctx.lineTo(stX + fx - 12, stY - 130);
        ctx.lineTo(stX + fx + 12, stY - 130);
        ctx.closePath();
        ctx.fill();
      }

      // Marquee banner: FALLY 2026
      const bannerY = stY - 38;
      ctx.fillStyle = "#E50914";
      drawRoundRect(ctx, stX - 70, bannerY - 12, 140, 22, 4);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("FALLY 2026", stX, bannerY + 3);

      // Stadium label
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "bold 10px monospace";
      ctx.fillText(c.goal, stX, stY + 70);
      ctx.restore();

      // ── Crowd silhouettes near the stadium ──────────────────────────────────
      ctx.save();
      ctx.fillStyle = "#000";
      ctx.globalAlpha = 0.55;
      const crowdCycle = W;
      const crowdShift =
        ((((-bgOffsetRef.current * 0.25) % crowdCycle) + crowdCycle) %
          crowdCycle) -
        crowdCycle / 2;
      for (let cx = -50; cx < W + 50; cx += 6) {
        const seed = Math.sin((cx + crowdShift) * 0.5) * 0.5 + 0.5;
        const headH = 8 + seed * 4;
        const bodyH = 14 + seed * 6;
        const bob = Math.sin(tick * 0.1 + cx * 0.1) * 1.2;
        // Body
        ctx.fillRect(cx, GROUND - bodyH + bob, 4, bodyH);
        // Head
        ctx.beginPath();
        ctx.arc(cx + 2, GROUND - bodyH - headH / 2 + bob, headH / 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Random raised arms (like at a concert)
        if (seed > 0.7) {
          ctx.fillRect(cx + 1, GROUND - bodyH - headH - 8 + bob, 1.5, 8);
          ctx.fillRect(cx + 2.5, GROUND - bodyH - headH - 8 + bob, 1.5, 8);
        }
      }
      ctx.restore();

      // Buildings silhouette (parallax layer 1)
      ctx.fillStyle = "#0d0d1a";
      const buildings = [
        [0, 60, 80, 180],
        [70, 40, 60, 200],
        [120, 80, 100, 160],
        [210, 50, 70, 190],
        [270, 90, 90, 150],
        [350, 30, 60, 210],
        [400, 70, 80, 170],
        [470, 55, 90, 185],
        [550, 40, 70, 200],
        [610, 80, 60, 160],
        [660, 35, 80, 205],
        [730, 65, 70, 175],
      ];
      for (const [bx, _by, bw, bh] of buildings) {
        const px =
          ((((bx - bgOffsetRef.current * 0.15) % (W + 100)) + W + 100) %
            (W + 100)) -
          100;
        ctx.fillRect(px, GROUND - bh, bw, bh);
        // Windows
        ctx.fillStyle = "#1a1a3a20";
        for (let wy = GROUND - bh + 15; wy < GROUND - 20; wy += 20) {
          for (let wx = px + 8; wx < px + bw - 8; wx += 15) {
            if (Math.random() > 0.4) {
              ctx.fillStyle = `rgba(255, 200, 100, ${0.05 + Math.random() * 0.1})`;
              ctx.fillRect(wx, wy, 8, 10);
            }
          }
        }
        ctx.fillStyle = "#0d0d1a";
      }

      // Ground
      const groundGrad = ctx.createLinearGradient(0, GROUND - 2, 0, H);
      groundGrad.addColorStop(0, "#dc2626");
      groundGrad.addColorStop(0.05, "#1a1a2e");
      groundGrad.addColorStop(1, "#0d0d1a");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, GROUND, W, H - GROUND);

      // Ground line glow
      ctx.strokeStyle = "#dc262640";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND);
      ctx.lineTo(W, GROUND);
      ctx.stroke();

      // Dashes on ground
      ctx.strokeStyle = "#ffffff10";
      ctx.lineWidth = 2;
      ctx.setLineDash([30, 20]);
      ctx.lineDashOffset = -(bgOffsetRef.current % 50);
      ctx.beginPath();
      ctx.moveTo(0, GROUND + 15);
      ctx.lineTo(W, GROUND + 15);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Update ───────────────────────────────────────────────────────────────
      if (state === "running") {
        tickRef.current++;
        bgOffsetRef.current += speed;
        speedRef.current += SPEED_INCREMENT;

        // Physics
        player.vy += GRAVITY;
        player.y += player.vy;
        if (player.y >= GROUND - player.h) {
          player.y = GROUND - player.h;
          player.vy = 0;
          player.onGround = true;
        }

        // Obstacles spawn & move
        nextObsRef.current--;
        if (nextObsRef.current <= 0) {
          obstaclesRef.current.push(spawnObstacle(speed));
          nextObsRef.current =
            60 + Math.random() * 80 + Math.max(0, 80 - tick * 0.05);
        }
        for (const obs of obstaclesRef.current) obs.x -= speed;
        obstaclesRef.current = obstaclesRef.current.filter(
          (o) => o.x + o.w > -20,
        );

        // Collectibles spawn & move
        nextColRef.current--;
        if (nextColRef.current <= 0) {
          collectiblesRef.current.push(spawnCollectible());
          nextColRef.current = 90 + Math.random() * 120;
        }
        for (const col of collectiblesRef.current) col.x -= speed;
        collectiblesRef.current = collectiblesRef.current.filter(
          (c) => c.x + c.w > -20,
        );

        // Particles
        for (const p of particlesRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;
          p.life--;
        }
        particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

        // Collision: obstacles
        for (const obs of obstaclesRef.current) {
          if (overlaps(player, obs)) {
            endGame();
            break;
          }
        }

        // Collision: collectibles
        for (const col of collectiblesRef.current) {
          if (!col.collected && overlaps(player, col)) {
            col.collected = true;
            const pts = COLLECTIBLE_SCORES[col.type];
            scoreRef.current += pts;
            // Collect particles
            for (let i = 0; i < 8; i++) {
              particlesRef.current.push({
                x: col.x + col.w / 2,
                y: col.y + col.h / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 1) * 5,
                life: 30,
                maxLife: 30,
                color:
                  col.type === "hat"
                    ? "#fbbf24"
                    : col.type === "diamond"
                      ? "#67e8f9"
                      : "#a855f7",
                size: 3 + Math.random() * 3,
              });
            }
          }
        }

        // Distance score
        scoreRef.current += 0.1;
        setDisplayScore(Math.floor(scoreRef.current));
      }

      // ── Draw objects ─────────────────────────────────────────────────────────
      for (const obs of obstaclesRef.current) drawObstacle(ctx, obs, tick);
      for (const col of collectiblesRef.current)
        drawCollectible(ctx, col, tick);
      drawParticles(ctx, particlesRef.current);

      if (state !== "dead" || particlesRef.current.length > 0) {
        if (state === "dead") {
          // Flash red on death
          ctx.save();
          ctx.globalAlpha = Math.min(
            0.3,
            (particlesRef.current.length / 20) * 0.3,
          );
          ctx.fillStyle = "#dc2626";
          ctx.fillRect(0, 0, W, H);
          ctx.restore();
        } else {
          drawSapeur(
            ctx,
            player.x,
            player.y,
            player.w,
            player.h,
            tick,
            !player.onGround,
          );
        }
      }

      // ── HUD ──────────────────────────────────────────────────────────────────
      if (state === "running") {
        // Score
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "right";
        ctx.fillText(`${Math.floor(scoreRef.current)} pts`, W - 20, 35);

        // Speed indicator
        const speedPct = Math.min(1, (speedRef.current - INITIAL_SPEED) / 8);
        ctx.fillStyle = "#ffffff20";
        drawRoundRect(ctx, W - 120, 45, 100, 6, 3);
        ctx.fill();
        ctx.fillStyle = `hsl(${120 - speedPct * 120}, 80%, 55%)`;
        drawRoundRect(ctx, W - 120, 45, 100 * speedPct, 6, 3);
        ctx.fill();
        ctx.fillStyle = "#ffffff50";
        ctx.font = "9px monospace";
        ctx.textAlign = "right";
        ctx.fillText(c.speed, W - 20, 62);
        ctx.textAlign = "left";
      }

      if (state === "idle") {
        // Idle: draw static sapeur
        drawSapeur(ctx, player.x, player.y, player.w, player.h, 0, false);
      }
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [endGame]);

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (stateRef.current === "idle" || stateRef.current === "dead") {
          startGame();
        } else {
          jump();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startGame, jump]);

  // Touch controls
  const handleTouch = useCallback(() => {
    if (stateRef.current === "idle" || stateRef.current === "dead") {
      startGame();
    } else {
      jump();
    }
  }, [startGame, jump]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Canvas wrapper */}
      <div className="relative w-full max-w-3xl">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full rounded-[2rem] border border-white/10 shadow-2xl cursor-pointer"
          style={{ imageRendering: "pixelated" }}
          onClick={handleTouch}
        />

        {/* Overlay: Idle */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] bg-ink/70 backdrop-blur-sm">
            <div className="text-center px-6">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-blood">
                {c.idleEyebrow}
              </p>
              <h2 className="mb-4 font-display text-5xl uppercase text-paper leading-tight">
                {c.idleTitle}
              </h2>
              <p className="mb-8 max-w-xs mx-auto font-body text-paper-dim text-sm italic leading-relaxed">
                {c.idleTagline}
              </p>
              <button
                type="button"
                onClick={startGame}
                className="flex items-center gap-3 mx-auto rounded-2xl bg-blood px-10 py-4 font-mono text-sm uppercase tracking-wider text-white shadow-glow-blood hover:bg-blood/90 transition-all"
              >
                <Play className="size-5 fill-current" />
                {c.start}
              </button>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-widest text-paper-mute">
                {c.controlsHint}
              </p>
            </div>
          </div>
        )}

        {/* Overlay: Dead */}
        {gameState === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-ink/80 backdrop-blur-sm">
            <div className="w-full max-w-sm px-3 text-center sm:px-6">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.3em] text-blood sm:text-[10px] sm:tracking-[0.4em]">
                {c.gameOver}
              </p>
              <h2 className="mb-2 font-display text-xl uppercase text-paper sm:mb-6 sm:text-4xl">
                {c.fallen}
              </h2>

              <div className="mx-auto mb-3 grid max-w-xs grid-cols-2 gap-2 sm:mb-6 sm:gap-4">
                <div className="min-w-0 rounded-xl border border-white/10 bg-smoke/50 p-2 sm:rounded-2xl sm:p-4">
                  <p className="mb-0.5 font-mono text-[8px] uppercase tracking-widest text-paper-mute sm:mb-1 sm:text-[9px]">
                    {c.score}
                  </p>
                  <p className="truncate font-display text-lg tabular-nums text-paper sm:text-3xl">
                    {displayScore}
                  </p>
                </div>
                <div
                  className={cn(
                    "min-w-0 rounded-xl border p-2 sm:rounded-2xl sm:p-4",
                    displayScore >= highScore
                      ? "border-gold/50 bg-gold/10"
                      : "border-white/10 bg-smoke/50",
                  )}
                >
                  <p className="mb-0.5 font-mono text-[8px] uppercase tracking-widest text-paper-mute sm:mb-1 sm:text-[9px]">
                    {displayScore >= highScore ? c.newRecord : c.record}
                  </p>
                  <p
                    className={cn(
                      "truncate font-display text-lg tabular-nums sm:text-3xl",
                      displayScore >= highScore ? "text-gold" : "text-paper",
                    )}
                  >
                    {Math.max(displayScore, highScore)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startGame}
                className="mx-auto flex items-center gap-2 rounded-xl bg-blood px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white shadow-glow-blood transition-all hover:bg-blood/90 sm:gap-3 sm:rounded-2xl sm:px-10 sm:py-4 sm:text-sm"
              >
                <RotateCcw className="size-4" />
                {c.retry}
              </button>
            </div>
          </div>
        )}

        {/* Live score badge (top right, running) */}
        {gameState === "running" && (
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-xl bg-ink/70 border border-white/10 px-4 py-2 backdrop-blur-sm">
            <Trophy className="size-4 text-gold" />
            <span className="font-mono text-sm text-paper tabular-nums">
              {displayScore}
            </span>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <button
          type="button"
          onClick={handleTouch}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-smoke/50 px-6 py-3 font-mono text-[10px] uppercase tracking-wider text-paper-mute hover:border-blood/30 hover:text-paper transition-all"
        >
          <ChevronUp className="size-4 text-blood" />
          {c.jumpHint}
        </button>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
          <span className="text-gold">🎩 +50</span>
          <span className="text-cyan-400">💎 +100</span>
          <span className="text-purple-400">🎤 +150</span>
        </div>
        {highScore > 0 && (
          <div className="flex items-center gap-2">
            <Trophy className="size-3 text-gold" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              {c.recordLabel} : <span className="text-gold">{highScore}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
