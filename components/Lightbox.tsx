"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

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

  // 모바일 스와이프 — 좌우로 밀면 이전/다음 이미지, 배경 탭은 닫기
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const swipedRef = useRef(false);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startRef.current = { x: t.clientX, y: t.clientY };
    swipedRef.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const s = startRef.current;
    if (!s) return;
    const t = e.touches[0];
    if (
      Math.abs(t.clientX - s.x) > 10 &&
      Math.abs(t.clientX - s.x) > Math.abs(t.clientY - s.y)
    ) {
      swipedRef.current = true; // 가로 스와이프 진행 중
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = startRef.current;
    startRef.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      go(dx > 0 ? -1 : 1); // 오른쪽으로 밀면 이전, 왼쪽이면 다음
    }
  };
  const onBackdropClick = () => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return; // 스와이프 직후의 클릭은 무시 (닫기 방지)
    }
    onClose();
  };

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
      style={{ touchAction: "none" }}
      onClick={onBackdropClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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

      {/* 이미지 — 고정 크기 영역 + object-contain → 해상도/비율 달라도 균일한 사이즈감 */}
      <figure className="mx-auto flex flex-col items-center">
        <div className="relative flex h-[74vh] w-[90vw] items-center justify-center">
          <Image
            src={current.src}
            alt={current.caption ?? ""}
            fill
            sizes="92vw"
            quality={90}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            className="select-none object-contain"
          />
          {/* 데스크탑 화살표 — 이미지 영역 세로 중앙, 모바일에선 숨김(스와이프 사용) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous"
                className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-bone-dim transition hover:bg-white/10 hover:text-bone md:flex"
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
                className="absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-bone-dim transition hover:bg-white/10 hover:text-bone md:flex"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}
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
          {images.length > 1 && (
            <span className="label md:hidden">← 좌우로 밀어 넘기기 →</span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
