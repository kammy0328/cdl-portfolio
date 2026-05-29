"use client";

import Link from "next/link";
import { useCallback, useEffect } from "react";

export interface LightboxImage {
  src: string;
  caption?: string;
  /** 해당 스틸이 속한 작업 상세 페이지 (있으면 "View Project" 링크 노출) */
  href?: string;
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
    // 라이트박스가 열려 있는 동안 배경 스크롤 잠금 (scrollbar-gutter: stable 로 이동 없음)
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* 닫기 */}
      <button
        onClick={onClose}
        aria-label="Close"
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
            aria-label="Previous"
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
            aria-label="Next"
            className="absolute right-3 sm:right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full text-bone-dim transition hover:bg-white/10 hover:text-bone"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* 이미지 — index가 바뀔 때마다 부드럽게 팝업 (key로 애니메이션 재생) */}
      <figure
        key={index}
        className="mx-auto flex flex-col items-center animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 고정 크기 영역 + object-contain → 해상도/비율이 달라도 균일한 사이즈감 */}
        <div className="flex h-[74vh] w-[90vw] items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.caption ?? ""}
            className="h-full w-full object-contain"
          />
        </div>
        <figcaption className="mt-5 flex flex-col items-center gap-3 text-center">
          {current.caption && (
            <span className="text-sm text-bone-dim">{current.caption}</span>
          )}
          {current.href && (
            <Link
              href={current.href}
              onClick={(e) => e.stopPropagation()}
              className="group inline-flex items-center gap-1.5 rounded-sm border border-ink-line bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-bone transition hover:border-bone-dim hover:bg-white/10"
            >
              View Project
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition group-hover:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
