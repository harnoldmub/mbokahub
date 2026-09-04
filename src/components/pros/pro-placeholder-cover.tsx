"use client";

import type { ProCategory } from "@prisma/client";

import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";

/**
 * Palette de dégradés flat par groupe de catégorie.
 */
const GROUP_PALETTE: Record<
  string,
  { bg1: string; bg2: string; accent: string; textColor: string }
> = {
  BEAUTE: {
    bg1: "#1a0a0f",
    bg2: "#2d1018",
    accent: "#e31818",
    textColor: "#f5f5f7",
  },
  EVENT: {
    bg1: "#0a0f1a",
    bg2: "#10182d",
    accent: "#e31818",
    textColor: "#f5f5f7",
  },
  LOGISTIQUE: {
    bg1: "#0d0d0d",
    bg2: "#1a1a1a",
    accent: "#e31818",
    textColor: "#f5f5f7",
  },
  FAMILLE: {
    bg1: "#0a1209",
    bg2: "#121f10",
    accent: "#e31818",
    textColor: "#f5f5f7",
  },
  AUTRE: {
    bg1: "#0f0a1a",
    bg2: "#1a1028",
    accent: "#e31818",
    textColor: "#f5f5f7",
  },
};

const DEFAULT_PALETTE = GROUP_PALETTE.AUTRE;

type Props = {
  displayName: string;
  category: ProCategory;
  className?: string;
  /** Masque le libellé de catégorie dessiné dans la vignette quand la carte
   *  qui l'entoure affiche déjà cette catégorie juste en dessous. */
  showCategoryLabel?: boolean;
};

/**
 * Placeholder cover flat pour les prestataires sans photo.
 *
 * Génère un SVG inline avec :
 * - Un fond en dégradé cohérent avec la palette du site
 * - Les initiales du prestataire en grand
 * - Le label de catégorie en bas
 * - Un motif géométrique discret pour la texture
 */
export function ProPlaceholderCover({
  displayName,
  category,
  className,
  showCategoryLabel = true,
}: Props) {
  const meta = PRO_CATEGORY_BY_ID[category];
  const group = meta?.group ?? "AUTRE";
  const palette = GROUP_PALETTE[group] ?? DEFAULT_PALETTE;
  const label = meta?.shortLabel ?? meta?.label ?? category;

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const safeName = `${category}-${initials}`.replace(/[^a-zA-Z0-9-]/g, "");
  const gradId = `pg-${safeName}`;
  const patternId = `pp-${safeName}`;

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.bg1} />
            <stop offset="100%" stopColor={palette.bg2} />
          </linearGradient>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 40 L 40 0 M -10 10 L 10 -10 M 30 50 L 50 30"
              stroke={palette.accent}
              strokeWidth="0.4"
              strokeOpacity="0.12"
              fill="none"
            />
          </pattern>
        </defs>

        <rect width="400" height="300" fill={`url(#${gradId})`} />
        <rect width="400" height="300" fill={`url(#${patternId})`} />

        <circle
          cx="200"
          cy="140"
          r="72"
          fill={palette.accent}
          fillOpacity="0.06"
        />
        <circle
          cx="200"
          cy="140"
          r="52"
          fill={palette.accent}
          fillOpacity="0.08"
          stroke={palette.accent}
          strokeWidth="0.8"
          strokeOpacity="0.2"
        />

        <text
          x="200"
          y="152"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="52"
          fontWeight="700"
          fontFamily="'Anton', 'Impact', sans-serif"
          letterSpacing="4"
          fill={palette.textColor}
          fillOpacity="0.9"
        >
          {initials}
        </text>

        <rect
          x="160"
          y="208"
          width="80"
          height="2"
          rx="1"
          fill={palette.accent}
          fillOpacity="0.7"
        />

        {showCategoryLabel ? (
          <text
            x="200"
            y="228"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="500"
            fontFamily="'JetBrains Mono', 'Courier New', monospace"
            letterSpacing="3"
            fill={palette.textColor}
            fillOpacity="0.4"
          >
            {label.toUpperCase()}
          </text>
        ) : null}

        {/* Corners */}
        <path
          d="M 20 20 L 20 36 M 20 20 L 36 20"
          stroke={palette.accent}
          strokeWidth="1.5"
          strokeOpacity="0.3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 380 20 L 380 36 M 380 20 L 364 20"
          stroke={palette.accent}
          strokeWidth="1.5"
          strokeOpacity="0.3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 20 280 L 20 264 M 20 280 L 36 280"
          stroke={palette.accent}
          strokeWidth="1.5"
          strokeOpacity="0.3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 380 280 L 380 264 M 380 280 L 364 280"
          stroke={palette.accent}
          strokeWidth="1.5"
          strokeOpacity="0.3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
