"use client";

import { useState } from "react";
import Lightbox, { type LightboxImage } from "./Lightbox";

/** 작업 상세 페이지의 색보정 스틸 갤러리 */
export default function StillsGallery({
  stills,
  title,
}: {
  stills: string[];
  title: string;
}) {
  const [idx, setIdx] = useState<number | null>(null);

  if (!stills.length) {
    return <p className="text-sm text-bone-faint">Stills coming soon.</p>;
  }

  const images: LightboxImage[] = stills.map((s, i) => ({
    src: s,
    caption: `${title} — Still ${String(i + 1).padStart(2, "0")}`,
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
        {stills.map((s, i) => (
          <button
            key={s + i}
            onClick={() => setIdx(i)}
            className="group relative aspect-video overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line"
            aria-label={`View still ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s}
              alt={`${title} still ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.opacity = "0";
              }}
            />
            <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
          </button>
        ))}
      </div>
      <Lightbox
        images={images}
        index={idx}
        onClose={() => setIdx(null)}
        onIndexChange={setIdx}
      />
    </>
  );
}
