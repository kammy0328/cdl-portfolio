"use client";

import { useEffect, useState } from "react";
import Lightbox, { type LightboxImage } from "./Lightbox";
import { shuffle, type GalleryStill } from "@/lib/works";

/** 갤러리 페이지 — 전체 색보정 스틸을 매 방문마다 랜덤하게 보여줍니다 */
export default function GalleryGrid({ stills }: { stills: GalleryStill[] }) {
  const [items, setItems] = useState<GalleryStill[]>(stills);
  const [idx, setIdx] = useState<number | null>(null);

  // 마운트 후 클라이언트에서 셔플 → 방문할 때마다 순서가 달라짐
  useEffect(() => {
    setItems(shuffle(stills));
  }, [stills]);

  if (!stills.length) {
    return (
      <p className="text-sm text-bone-faint">
        색보정 스틸이 곧 업데이트됩니다.
      </p>
    );
  }

  const images: LightboxImage[] = items.map((s) => ({
    src: s.src,
    caption: `${s.workTitle} · ${s.artist}`,
  }));

  return (
    <>
      <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
        {items.map((s, i) => (
          <button
            key={s.src + i}
            onClick={() => setIdx(i)}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line animate-fade-in"
            aria-label={`${s.workTitle} 스틸 크게 보기`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt={`${s.workTitle} still`}
              loading="lazy"
              className="w-full transition duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.style.opacity = "0";
              }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <span className="absolute bottom-0 left-0 right-0 p-3 text-left opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="block text-sm font-medium text-bone">
                {s.workTitle}
              </span>
              <span className="label !text-bone-dim">{s.artist}</span>
            </span>
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
