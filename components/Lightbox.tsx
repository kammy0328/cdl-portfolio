"use client";

import { useCallback, useEffect } from "react";

export interface LightboxImage {
  src: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const open = index !== null;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      const next = (index + dir + images.length) % images.length;
      onIndexChange(next);
    },
    [index, images.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    // 라이트박스가 열려 있는 동안 배경 스크롤 잠금
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go, onClose]);

  if (!open || index === null) return null;
  const current = images[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* 닫기 */}
      <button
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-bone-dim transition hover:bg-white/10 hover:text-bone"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="이전"
            className="absolute left-3 sm:left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full text-bone-dim transition hover:bg-white/10 hover:text-bone"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="다음"
            className="absolute right-3 sm:right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full text-bone-dim transition hover:bg-white/10 hover:text-bone"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* 이미지 */}
      <figure
        className="mx-auto flex max-h-[88vh] max-w-[92vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.caption ?? ""}
          className="max-h-[82vh] max-w-[92vw] object-contain shadow-2xl"
        />
        <figcaption className="mt-4 flex items-center gap-3 text-center">
          {current.caption && (
            <span className="text-sm text-bone-dim">{current.caption}</span>
          )}
          {images.length > 1 && (
            <span className="label">
              {index + 1} / {images.length}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
