"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type SearchableOption = {
  value: string;
  label: string;
  /** Optional value used to keep an option pinned at the top (e.g. "all"). */
  sticky?: boolean;
};

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  /** Disable alphabetical sorting (default: enabled). */
  noSort?: boolean;
  className?: string;
  buttonClassName?: string;
};

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Sélectionner…",
  searchPlaceholder = "Rechercher…",
  emptyLabel = "Aucun résultat",
  noSort = false,
  className,
  buttonClassName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = (returnFocus = true) => {
    setOpen(false);
    setQuery("");
    if (returnFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const sortedOptions = useMemo(() => {
    const sticky = options.filter((o) => o.sticky);
    const rest = options.filter((o) => !o.sticky);
    if (!noSort) {
      rest.sort((a, b) =>
        a.label.localeCompare(b.label, "fr", { sensitivity: "base" }),
      );
    }
    return [...sticky, ...rest];
  }, [options, noSort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedOptions;
    return sortedOptions.filter((o) => o.label.toLowerCase().includes(q));
  }, [sortedOptions, query]);

  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        // outside click — don't steal focus back to the trigger
        close(false);
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close(true);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
          {label}
        </label>
      )}
      <div className="relative" ref={wrapperRef}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-smoke py-3 pl-4 pr-3 text-left font-body text-sm text-paper transition focus:border-blood focus:outline-none",
            open && "border-blood",
            buttonClassName,
          )}
        >
          <span className={cn("truncate", !current && "text-paper-mute")}>
            {current?.label ?? placeholder}
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 shrink-0 text-paper-mute transition",
              open && "rotate-180 text-blood",
            )}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-coal shadow-2xl">
            <div className="relative border-b border-white/5 p-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-paper-mute" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl bg-smoke py-2 pl-10 pr-8 text-sm text-paper placeholder:text-paper-mute focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-paper-mute hover:bg-white/10 hover:text-paper"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
            <ul className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-center text-sm text-paper-mute">
                  {emptyLabel}
                </li>
              ) : (
                filtered.map((o) => (
                  <li key={o.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(o.value);
                        close(true);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm transition hover:bg-white/5",
                        o.value === value
                          ? "text-blood"
                          : "text-paper-dim hover:text-paper",
                      )}
                    >
                      <span className="truncate">{o.label}</span>
                      {o.value === value && (
                        <Check className="size-4 shrink-0 text-blood" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
