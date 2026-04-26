import type { ProCategory } from "@prisma/client";

import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";

export function maskedProLabel(
  category: ProCategory,
  city: string | null | undefined,
): string {
  const meta = PRO_CATEGORY_BY_ID[category];
  const label = meta?.label ?? meta?.shortLabel ?? "Prestataire";
  const trimmedCity = city?.trim();
  return trimmedCity ? `${label} · ${trimmedCity}` : label;
}

export function publicProName(opts: {
  category: ProCategory;
  city: string | null | undefined;
  displayName: string;
  unlocked: boolean;
}): string {
  return opts.unlocked
    ? opts.displayName
    : maskedProLabel(opts.category, opts.city);
}

/**
 * Normalize a free-text price field for display.
 * - Empty / null → "Sur devis"
 * - Pure numeric ("25", "25.5", "25,50") → "25€"
 * - "à partir de 25" → "à partir de 25€"
 * - Already contains €/$/£ or words like "devis", "offert", "gratuit" → returned as-is
 */
export function formatPriceRange(value: string | null | undefined): string {
  const raw = (value ?? "").trim();
  if (!raw) return "Sur devis";
  if (/[€$£¥]/.test(raw)) return raw;
  if (/(devis|gratuit|offert|free|tbd|n\/a)/i.test(raw)) return raw;

  // Pure number (with optional decimal)
  if (/^\d+(?:[.,]\d+)?$/.test(raw)) return `${raw}€`;

  // Ends with a number → append €
  if (/\d(?:[.,]\d+)?\s*$/.test(raw)) return `${raw}€`;

  return raw;
}

/**
 * Sanitize a price field on write — keeps storage compact.
 * Trims, normalizes pure numbers to "X€", returns null when blank.
 */
export function normalizePriceRangeInput(value: string | null | undefined): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  if (/^\d+(?:[.,]\d+)?$/.test(raw)) return `${raw}€`;
  return raw;
}

/**
 * Detect whether a free-text bio contains direct contact info.
 * Pros must keep the bio about their craft — contacts go through Mboka Hub
 * (WhatsApp / Instagram fields are surfaced separately and locked behind VIP).
 *
 * Returns the matched reason key, or null if the text is clean.
 */
export function detectContactInBio(text: string | null | undefined): string | null {
  const raw = (text ?? "").toString();
  if (!raw.trim()) return null;

  // Normalize "homoglyphs" / spaced-out chars: remove zero-width + collapse spaces around digits
  const normalized = raw
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .toLowerCase();

  // Email
  if (/[a-z0-9._%+-]+\s*(?:@|\(at\)|\[at\])\s*[a-z0-9.-]+\.[a-z]{2,}/i.test(normalized)) {
    return "email";
  }

  // URLs (any http/https link, or common bare domains)
  if (/\bhttps?:\/\/\S+/i.test(normalized)) return "url";
  if (/\b(?:wa\.me|chat\.whatsapp\.com|t\.me|m\.me|linktr\.ee|bit\.ly|tinyurl\.com|cal\.com|calendly\.com|fb\.com|facebook\.com|instagram\.com|tiktok\.com|snapchat\.com)\b/i.test(normalized)) {
    return "url";
  }

  // Phone numbers: 8+ digits in a row (ignoring spaces / dots / dashes / parens / +)
  const digits = normalized.replace(/[^\d]/g, "");
  if (digits.length >= 8) {
    // Check there is a contiguous-ish phone-shaped chunk (avoid false positives like
    // "depuis 8 ans" — those split short)
    if (/(?:\+?\d[\s.\-()]*){8,}/.test(normalized)) return "phone";
  }

  // Social handles & platform mentions
  if (/(?:^|[^a-z0-9_])@[a-z0-9._]{3,}/i.test(raw)) return "social";
  if (/\b(?:whatsapp|whats\s?app|wsp|insta(?:gram)?|snap(?:chat)?|tiktok|telegram|messenger|signal)\b/i.test(normalized)) {
    return "social";
  }

  return null;
}
