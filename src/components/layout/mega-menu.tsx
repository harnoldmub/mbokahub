"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { type Locale, localizedHref } from "@/lib/nls";

type MegaLink = {
  href: string;
  label: string;
  description?: string;
};

type MegaSection = {
  title: string;
  links: MegaLink[];
};

type MegaMenuProps = {
  label: string;
  sections: MegaSection[];
  locale: Locale;
};

export function MegaMenu({ label, sections, locale }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      ref={wrapRef}
    >
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="group/link relative flex items-center gap-1 font-body text-sm uppercase tracking-widest text-paper-dim transition-colors hover:text-blood"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {label}
        <ChevronDown
          aria-hidden
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
        <span className="absolute -bottom-1 left-0 h-px w-0 bg-blood transition-all group-hover/link:w-full" />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3"
          id={panelId}
          role="menu"
        >
          <div className="w-[min(92vw,720px)] rounded-2xl border border-white/10 bg-coal/95 p-6 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
              {sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-blood">
                    {section.title}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          className="block rounded-lg px-2 py-1.5 transition-colors hover:bg-blood/10"
                          href={localizedHref(link.href, locale)}
                          onClick={() => setOpen(false)}
                          role="menuitem"
                        >
                          <span className="block font-body text-sm text-paper">
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="mt-0.5 block text-xs text-paper-mute">
                              {link.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
