"use client";

import { useState } from "react";

import { PhotoLightbox } from "@/components/pros/photo-lightbox";

type ProGalleryClientProps = {
  photos: string[];
  altPrefix: string;
  /** Index offset so alt text matches existing numbering (cover = 1). */
  startIndex?: number;
};

export function ProGalleryClient({
  photos,
  altPrefix,
  startIndex = 1,
}: ProGalleryClientProps) {
  const [openSrc, setOpenSrc] = useState<string | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((src, i) => {
          const alt = `${altPrefix} — photo ${startIndex + i}`;
          return (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setOpenSrc(src)}
              aria-label={`Agrandir ${alt}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40 cursor-zoom-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </button>
          );
        })}
      </div>

      {openSrc ? (
        <PhotoLightbox
          src={openSrc}
          alt={altPrefix}
          onClose={() => setOpenSrc(null)}
        />
      ) : null}
    </>
  );
}
