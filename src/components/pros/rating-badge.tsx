"use client";

type Props = {
  rating: number;
  reviewsCount: number;
};

export function RatingBadge({ rating, reviewsCount }: Props) {
  if (!(rating > 0 || reviewsCount > 0)) return null;
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("pro:open-tab", { detail: "avis" }),
        )
      }
      className="mt-2 inline-flex items-center gap-1.5 rounded-full text-sm text-amber-500 font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
      aria-label={`Voir les ${reviewsCount} avis`}
    >
      ★ {rating.toFixed(1)}
      <span className="font-normal text-paper-mute">({reviewsCount} avis)</span>
    </button>
  );
}
