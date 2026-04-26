"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type MultiSelectOption = {
  value: string;
  label: string;
};

type Props = {
  values: string[];
  onChange: (values: string[]) => void;
  options: MultiSelectOption[];
  /** Text shown in the trigger when no option is selected. */
  placeholder?: string;
  /** Singular noun used in the "X selected" summary (e.g. "catégorie"). */
  itemNounSingular?: string;
  /** Plural noun used in the "X selected" summary (e.g. "catégories"). */
  itemNounPlural?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  /** Disable alphabetical sorting (default: enabled). */
  noSort?: boolean;
  className?: string;
  buttonClassName?: string;
};

export function MultiSelect({
  values,
  onChange,
  options,
  placeholder = "Sélectionner…",
  itemNounSingular = "élément",
  itemNounPlural = "éléments",
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
    if (noSort) return options;
    return [...options].sort((a, b) =>
      a.label.localeCompare(b.label, "fr", { sensitivity: "base" }),
    );
  }, [options, noSort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedOptions;
    return sortedOptions.filter((o) => o.label.toLowerCase().includes(q));
  }, [sortedOptions, query]);

  const valueSet = useMemo(() => new Set(values), [values]);

  const triggerLabel = useMemo(() => {
    if (values.length === 0) return placeholder;
    if (values.length === 1) {
      return options.find((o) => o.value === values[0])?.label ?? placeholder;
    }
    return `${values.length} ${itemNounPlural} sélectionnés`;
  }, [values, options, placeholder, itemNounPlural]);

  const toggle = (value: string) => {
    if (valueSet.has(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        close(false);
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
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

  const hasSelection = values.length > 0;

  return (
    <div className={cn("relative", className)} ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-smoke py-3 pl-4 pr-2 text-left font-body text-sm text-paper transition focus:border-blood focus:outline-none",
          open && "border-blood",
          buttonClassName,
        )}
      >
        <span className={cn("truncate", !hasSelection && "text-paper-mute")}>
          {triggerLabel}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {hasSelection && (
            <span
              role="button"
              tabIndex={0}
              aria-label={`Effacer la sélection (${values.length})`}
              onClick={clearAll}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange([]);
                }
              }}
              className="rounded-full p-1 text-paper-mute hover:bg-white/10 hover:text-paper"
            >
              <X className="size-3" />
            </span>
          )}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 text-paper-mute transition",
              open && "rotate-180 text-blood",
            )}
          />
        </span>
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
                aria-label="Effacer la recherche"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {hasSelection && (
            <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
              <span>
                {values.length}{" "}
                {values.length > 1 ? itemNounPlural : itemNounSingular}
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-paper-dim hover:text-blood"
              >
                Tout effacer
              </button>
            </div>
          )}

          <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-center text-sm text-paper-mute">
                {emptyLabel}
              </li>
            ) : (
              filtered.map((o) => {
                const checked = valueSet.has(o.value);
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={checked}
                      onClick={() => toggle(o.value)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-paper transition hover:bg-white/5",
                        checked && "bg-blood/15",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border transition",
                          checked
                            ? "border-blood bg-blood text-paper"
                            : "border-white/20 bg-transparent",
                        )}
                      >
                        {checked && <Check className="size-3" />}
                      </span>
                      <span className="truncate">{o.label}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
