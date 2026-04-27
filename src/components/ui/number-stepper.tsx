"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  name: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  required?: boolean;
  className?: string;
  unit?: string;
};

export function NumberStepper({
  name,
  defaultValue = 1,
  min = 1,
  max = 99,
  required,
  className,
  unit,
}: Props) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const [value, setValue] = useState<number>(clamp(defaultValue));

  const dec = () => setValue((v) => clamp(v - 1));
  const inc = () => setValue((v) => clamp(v + 1));

  return (
    <div
      className={cn(
        "flex h-12 items-stretch overflow-hidden rounded-md border border-white/5 bg-smoke",
        className,
      )}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Diminuer"
        className="flex w-12 items-center justify-center text-paper-dim transition hover:bg-white/10 hover:text-paper disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus className="size-4" />
      </button>

      <div className="flex flex-1 items-center justify-center gap-1.5 font-display text-lg text-paper">
        <input
          name={name}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          required={required}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isFinite(n)) return;
            setValue(clamp(Math.round(n)));
          }}
          className="w-12 bg-transparent text-center text-paper outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {unit && (
          <span className="text-xs text-paper-dim font-mono uppercase">
            {unit}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Augmenter"
        className="flex w-12 items-center justify-center text-paper-dim transition hover:bg-white/10 hover:text-paper disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
