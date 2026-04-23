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
    ctx.strokeStyle = "#e63946";
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
    ctx.fillStyle = "#e63946";
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

// ── Main Component ─────────────────────────────────────────────────────────────
export function SapeRunClient() {
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
    const final = scoreRef.current;
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

      // Stade de France (parallax layer 0 — deep background)
      ctx.save();
      const stX = ((-bgOffsetRef.current * 0.05) % (W * 2)) + W;
      ctx.fillStyle = "#1e1e3a";
      ctx.globalAlpha = 0.6;
      // The iconic elliptical roof
      ctx.beginPath();
      ctx.ellipse(stX, GROUND - 40, 180, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      // Pillars
      for (let i = -160; i <= 160; i += 40) {
        ctx.fillRect(stX + i - 2, GROUND - 40, 4, 40);
      }
      // Glowing text
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px font-mono";
      ctx.textAlign = "center";
      ctx.fillText("STADE DE FRANCE", stX, GROUND - 60);
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
        ctx.fillText("VITESSE", W - 20, 62);
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
                Mboka Hub Game
              </p>
              <h2 className="mb-4 font-display text-5xl uppercase text-paper leading-tight">
                Sape Run
              </h2>
              <p className="mb-8 max-w-xs mx-auto font-body text-paper-dim text-sm italic leading-relaxed">
                Aide le Sapeur à traverser Paris sans s'arrêter. Collecte des
                chapeaux, diamants et micros !
              </p>
              <button
                type="button"
                onClick={startGame}
                className="flex items-center gap-3 mx-auto rounded-2xl bg-blood px-10 py-4 font-mono text-sm uppercase tracking-wider text-white shadow-glow-blood hover:bg-blood/90 transition-all"
              >
                <Play className="size-5 fill-current" />
                Commencer
              </button>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-widest text-paper-mute">
                Espace / Clic / Tap pour sauter
              </p>
            </div>
          </div>
        )}

        {/* Overlay: Dead */}
        {gameState === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] bg-ink/80 backdrop-blur-sm">
            <div className="text-center px-6">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.4em] text-blood">
                Game Over
              </p>
              <h2 className="mb-6 font-display text-4xl uppercase text-paper">
                Le Sapeur est tombé !
              </h2>

              <div className="mb-6 grid grid-cols-2 gap-4 max-w-xs mx-auto">
                <div className="rounded-2xl border border-white/10 bg-smoke/50 p-4">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-paper-mute mb-1">
                    Score
                  </p>
                  <p className="font-display text-3xl text-paper">
                    {displayScore}
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-2xl border p-4",
                    displayScore >= highScore
                      ? "border-gold/50 bg-gold/10"
                      : "border-white/10 bg-smoke/50",
                  )}
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-paper-mute mb-1">
                    {displayScore >= highScore ? "Nouveau Record !" : "Record"}
                  </p>
                  <p
                    className={cn(
                      "font-display text-3xl",
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
                className="flex items-center gap-3 mx-auto rounded-2xl bg-blood px-10 py-4 font-mono text-sm uppercase tracking-wider text-white shadow-glow-blood hover:bg-blood/90 transition-all"
              >
                <RotateCcw className="size-4" />
                Rejouer
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
          Sauter (Espace / Clic)
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
              Record : <span className="text-gold">{highScore}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
