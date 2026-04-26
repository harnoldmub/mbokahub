"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type FomoData = {
  presence: number;
  proSignups24h: number;
  newsletter24h: number;
  vipPayments7d: number;
  earlyBirdMs: number;
};

type Message = {
  key: string;
  emoji: string;
  text: string;
  accent: "blood" | "gold" | "cyan" | "violet";
};

const HEARTBEAT_MS = 45_000;
const ROTATE_MS = 7_000;
const SHOW_DELAY_MS = 4_000;
const DISMISS_KEY = "mboka_fomo_dismissed_at";
const SID_KEY = "mboka_fomo_sid";
const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const HIDDEN_PREFIXES = [
  "/admin",
  "/sign-in",
  "/sign-up",
  "/checkout",
  "/dashboard",
  "/onboarding",
];

function makeSid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getOrCreateSid(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = sessionStorage.getItem(SID_KEY);
    if (existing) return existing;
    const sid = makeSid();
    sessionStorage.setItem(SID_KEY, sid);
    return sid;
  } catch {
    return makeSid();
  }
}

function formatEarlyBird(ms: number): string {
  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days >= 2) return `${days} jours`;
  if (days >= 1) return `${days}j ${hours}h`;
  if (hours >= 1) return `${hours}h ${minutes}min`;
  return `${minutes} min`;
}

function buildMessages(data: FomoData): Message[] {
  const out: Message[] = [];

  if (data.presence >= 3) {
    out.push({
      key: "presence",
      emoji: "👀",
      text: `${data.presence} personnes consultent le site en ce moment`,
      accent: "cyan",
    });
  }

  if (data.earlyBirdMs > 0) {
    out.push({
      key: "earlybird",
      emoji: "💎",
      text: `Early Bird VIP à 6,99€ — fin dans ${formatEarlyBird(data.earlyBirdMs)}`,
      accent: "gold",
    });
  }

  if (data.proSignups24h >= 1) {
    out.push({
      key: "pros",
      emoji: "🔥",
      text:
        data.proSignups24h === 1
          ? `1 nouveau pro inscrit aujourd'hui`
          : `${data.proSignups24h} nouveaux pros inscrits aujourd'hui`,
      accent: "blood",
    });
  }

  if (data.vipPayments7d >= 1) {
    out.push({
      key: "vip",
      emoji: "🎫",
      text:
        data.vipPayments7d === 1
          ? `1 fan a rejoint le VIP cette semaine`
          : `${data.vipPayments7d} fans ont rejoint le VIP cette semaine`,
      accent: "violet",
    });
  }

  if (data.newsletter24h >= 1) {
    out.push({
      key: "newsletter",
      emoji: "📬",
      text:
        data.newsletter24h === 1
          ? `1 nouvelle inscription newsletter aujourd'hui`
          : `${data.newsletter24h} nouvelles inscriptions newsletter aujourd'hui`,
      accent: "cyan",
    });
  }

  if (out.length === 0) {
    out.push({
      key: "fallback",
      emoji: "🇨🇩",
      text: `Stade de France · 2 & 3 mai 2026 · prépare ton week-end`,
      accent: "blood",
    });
  }

  return out;
}

const ACCENT_CLASS: Record<Message["accent"], string> = {
  blood: "border-blood/40 shadow-[0_0_24px_-8px_rgba(229,9,20,0.6)]",
  gold: "border-gold/40 shadow-[0_0_24px_-8px_rgba(212,175,55,0.6)]",
  cyan: "border-cyan-400/40 shadow-[0_0_24px_-8px_rgba(34,211,238,0.5)]",
  violet: "border-violet-400/40 shadow-[0_0_24px_-8px_rgba(167,139,250,0.5)]",
};

export function FomoTicker() {
  const pathname = usePathname();
  const [data, setData] = useState<FomoData | null>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const sidRef = useRef<string>("");

  const isHiddenRoute = useMemo(() => {
    if (!pathname) return false;
    return HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
  }, [pathname]);

  // Check dismiss cooldown on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const ts = Number(localStorage.getItem(DISMISS_KEY) ?? "0");
      if (!ts || Date.now() - ts > DISMISS_COOLDOWN_MS) {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
  }, []);

  // Heartbeat + fetch
  useEffect(() => {
    if (dismissed || isHiddenRoute) return;
    sidRef.current = sidRef.current || getOrCreateSid();

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function ping() {
      try {
        const res = await fetch("/api/fomo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sid: sidRef.current }),
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = (await res.json()) as FomoData;
        if (!cancelled) setData(json);
      } catch {
        /* silent */
      }
    }

    ping();
    timer = setInterval(ping, HEARTBEAT_MS);
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [dismissed, isHiddenRoute]);

  // Reveal after delay (avoid blasting on first paint)
  useEffect(() => {
    if (dismissed || isHiddenRoute || !data) return;
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [data, dismissed, isHiddenRoute]);

  const messages = useMemo(() => (data ? buildMessages(data) : []), [data]);

  // Rotate
  useEffect(() => {
    if (!visible || messages.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [visible, messages.length]);

  // Reset index if list shrinks
  useEffect(() => {
    if (index >= messages.length && messages.length > 0) setIndex(0);
  }, [index, messages.length]);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  if (dismissed || isHiddenRoute || !visible || messages.length === 0) {
    return null;
  }

  const current = messages[index];

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed bottom-3 left-3 z-40 max-w-[calc(100vw-1.5rem)] sm:bottom-6 sm:left-6"
    >
      <div
        key={current.key + index}
        className={[
          "pointer-events-auto flex items-center gap-2 rounded-full border bg-ink/90 px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2.5",
          ACCENT_CLASS[current.accent],
          "animate-in fade-in slide-in-from-bottom-2 duration-500",
        ].join(" ")}
      >
        <span aria-hidden className="text-base sm:text-lg">
          {current.emoji}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-paper sm:text-xs">
          {current.text}
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer"
          className="ml-1 grid size-5 place-items-center rounded-full text-paper-mute transition-colors hover:bg-white/10 hover:text-paper"
        >
          <span aria-hidden className="text-xs leading-none">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
