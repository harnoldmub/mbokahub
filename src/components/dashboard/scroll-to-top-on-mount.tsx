"use client";

import { useEffect } from "react";

/**
 * Mount this inside a conditional success/error banner that appears at the
 * top of a page after a server action redirect. It scrolls the window back
 * to the top so the user immediately sees the feedback message instead of
 * being stranded near the footer when the page becomes shorter (e.g. the
 * previous validation error block disappears, or photos were removed).
 */
export function ScrollToTopOnMount() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);
  return null;
}
