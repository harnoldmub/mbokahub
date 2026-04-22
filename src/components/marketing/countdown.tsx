"use client";

import { useEffect, useMemo, useState } from "react";

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

function getRemainingUnits(targetDate: string): TimeUnit[] {
  const diff = Math.max(new Date(targetDate).getTime() - Date.now(), 0);
  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / MINUTE);
  const seconds = Math.floor((diff % MINUTE) / SECOND);

  return [
    { label: "jours", value: String(days).padStart(2, "0") },
    { label: "heures", value: String(hours).padStart(2, "0") },
    { label: "min", value: String(minutes).padStart(2, "0") },
    { label: "sec", value: String(seconds).padStart(2, "0") },
  ];
}

export function Countdown({ targetDate }: CountdownProps) {
  const initialUnits = useMemo(
    () => getRemainingUnits(targetDate),
    [targetDate],
  );
  const [units, setUnits] = useState<TimeUnit[]>(initialUnits);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setUnits(getRemainingUnits(targetDate));
    }, SECOND);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      {units.map((unit, index) => (
        <div
          className="relative flex flex-col items-center justify-center bg-coal border border-white/5 py-8 rounded-2xl"
          key={unit.label}
        >
          <span className="font-display text-5xl sm:text-7xl lg:text-8xl text-paper leading-none tracking-tighter">
            {unit.value}
          </span>
          <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute">
            {unit.label}
          </span>

          {index < units.length - 1 && (
            <span className="absolute -right-3 top-1/2 -translate-y-1/2 font-display text-4xl text-blood opacity-20 hidden sm:block animate-pulse">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
