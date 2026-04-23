"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string;
};

type TimeUnit = {
  label: string;
  value: string;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const PLACEHOLDER_UNITS: TimeUnit[] = [
  { label: "Jours", value: "00" },
  { label: "Heures", value: "00" },
  { label: "Min", value: "00" },
  { label: "Sec", value: "00" },
];

function getRemainingUnits(targetDate: string): TimeUnit[] {
  const diff = Math.max(new Date(targetDate).getTime() - Date.now(), 0);
  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / MINUTE);
  const seconds = Math.floor((diff % MINUTE) / SECOND);

  return [
    { label: "Jours", value: String(days).padStart(2, "0") },
    { label: "Heures", value: String(hours).padStart(2, "0") },
    { label: "Min", value: String(minutes).padStart(2, "0") },
    { label: "Sec", value: String(seconds).padStart(2, "0") },
  ];
}

export function Countdown({ targetDate }: CountdownProps) {
  const [units, setUnits] = useState<TimeUnit[]>(PLACEHOLDER_UNITS);

  useEffect(() => {
    setUnits(getRemainingUnits(targetDate));
    const interval = setInterval(() => {
      setUnits(getRemainingUnits(targetDate));
    }, SECOND);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full p-2 sm:p-4">
      {units.map((unit, index) => (
        <div
          className="relative flex flex-col items-center justify-center bg-smoke/40 backdrop-blur-md border border-white/5 py-6 sm:py-10 rounded-[2rem] group hover:bg-smoke/60 transition-colors"
          key={unit.label}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blood/10 to-transparent opacity-30 rounded-[2rem] pointer-events-none" />

          <span className="relative z-10 font-display text-4xl sm:text-6xl lg:text-7xl text-paper leading-none tracking-tighter group-hover:scale-105 transition-transform duration-500">
            {unit.value}
          </span>
          <span className="relative z-10 mt-3 font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-paper-mute group-hover:text-blood transition-colors">
            {unit.label}
          </span>

          {index < units.length - 1 && (
            <span className="absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 font-display text-xl sm:text-3xl text-blood opacity-30 hidden sm:block animate-pulse">
              .
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
