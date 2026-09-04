"use client";

import type { ProCategory } from "@prisma/client";
import Image from "next/image";

import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";

/**
 * Image statique par groupe de catégorie, générée par l'IA pour correspondre
 * à la palette du site (fond sombre éditorial, accent rouge #e31818).
 */
const GROUP_IMAGE: Record<string, string> = {
  BEAUTE: "/placeholder-beaute.jpg",
  EVENT: "/placeholder-event.jpg",
  LOGISTIQUE: "/placeholder-logistique.jpg",
  FAMILLE: "/placeholder-famille.jpg",
  AUTRE: "/placeholder-autre.jpg",
};

const DEFAULT_IMAGE = "/placeholder-autre.jpg";

/**
 * Couleur de l'overlay teinté par groupe (pour que les initiales
 * restent lisibles quel que soit le fond).
 */
const GROUP_OVERLAY: Record<string, string> = {
  BEAUTE: "rgba(26,10,15,0.55)",
  EVENT: "rgba(10,15,26,0.55)",
  LOGISTIQUE: "rgba(13,13,13,0.55)",
  FAMILLE: "rgba(10,18,9,0.55)",
  AUTRE: "rgba(15,10,26,0.55)",
};

type Props = {
  /** Nom affiché du prestataire — pour les initiales en surimpression */
  displayName: string;
  /** Catégorie Prisma — pour choisir le fond et la palette */
  category: ProCategory;
  /** Classe CSS appliquée au conteneur */
  className?: string;
  /** Masque le libellé de catégorie si la carte l'affiche déjà ailleurs */
  showCategoryLabel?: boolean;
};

/**
 * Placeholder cover pour les prestataires sans photo.
 *
 * Utilise une image statique par groupe de catégorie (générée avec la même
 * palette visuelle que le site) avec les initiales du prestataire en overlay.
 */
export function ProPlaceholderCover({
  displayName,
  category,
  className,
  showCategoryLabel = true,
}: Props) {
  const meta = PRO_CATEGORY_BY_ID[category];
  const group = meta?.group ?? "AUTRE";
  const imageSrc = GROUP_IMAGE[group] ?? DEFAULT_IMAGE;
  const overlayColor = GROUP_OVERLAY[group] ?? GROUP_OVERLAY.AUTRE;
  const label = meta?.shortLabel ?? meta?.label ?? category;

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Image de fond par catégorie */}
      <Image
        alt=""
        className="object-cover"
        draggable={false}
        fill
        priority={false}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        src={imageSrc}
        unoptimized
      />

      {/* Overlay teinté pour lisibilité des initiales */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlayColor,
        }}
      />

      {/* Initiales + libellé en surimpression */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Cercle décoratif */}
        <div
          style={{
            position: "absolute",
            width: 104,
            height: 104,
            borderRadius: "50%",
            background: "rgba(227,24,24,0.08)",
            border: "1px solid rgba(227,24,24,0.18)",
          }}
        />

        {/* Initiales */}
        <span
          style={{
            fontFamily: "'Anton', 'Impact', sans-serif",
            fontSize: "clamp(2rem, 6vw, 3.25rem)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "rgba(245,245,247,0.92)",
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          {initials}
        </span>

        {/* Séparateur rouge */}
        <div
          style={{
            width: 40,
            height: 2,
            borderRadius: 1,
            background: "rgba(227,24,24,0.8)",
            zIndex: 1,
          }}
        />

        {/* Label catégorie */}
        {showCategoryLabel && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.25em",
              color: "rgba(245,245,247,0.45)",
              textTransform: "uppercase",
              zIndex: 1,
            }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Coins décoratifs (SVG léger) */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 5 5 L 5 14 M 5 5 L 14 5"
          stroke="rgba(227,24,24,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 95 5 L 95 14 M 95 5 L 86 5"
          stroke="rgba(227,24,24,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 5 95 L 5 86 M 5 95 L 14 95"
          stroke="rgba(227,24,24,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 95 95 L 95 86 M 95 95 L 86 95"
          stroke="rgba(227,24,24,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
