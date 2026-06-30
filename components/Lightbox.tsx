"use client";

import Link from "next/link";
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
  const dialogRef = useRef<HTMLDivElement>(null);
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
      swipedRef.current = true;
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
      go(dx > 0 ? -1 : 1);
    }
  };
  const onBackdropClick = () => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (f && f.length) {
          const list = Array.from(f);
          const first = list[0];
          const last = list[list.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      prevFocus?.focus?.();
    };
  }, [open, go, onClose]);

  // 인접 이미지 미리 로드
  useEffect(() => {
    if (index === null) return;
    [index - 1, index + 1].forEach((k) => {
      const j = (k + images.length) % images.length;
      const im = new window.Image();
      im.src = images[j].src;
    });
  }, [index, images]);

  if (!open || index === null) return null;
  const current = images[index];
  const multi = images.length > 1;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 outline-none backdrop-blur-md animate-fade-in"
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

      {/* 화살표: 뷰포트 기준 세로 정중앙 고정 (이미지 비율 무관) */}
      {multi && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous"
            className="group absolute left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center p-3 outline-none md:flex"
          >
            <svg
              width="44" height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/20 transition-colors duration-300 group-hover:text-white"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next"
            className="group absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center p-3 outline-none md:flex"
          >
            <svg
              width="44" height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/20 transition-colors duration-300 group-hover:text-white"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* 이미지 + 캡션 */}
      <figure
        className="flex min-w-0 flex-col items-center px-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.caption ?? ""}
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
          className="block max-h-[78vh] max-w-[min(calc(100vw-10rem),94vw)] select-none"
        />
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
          {multi && (
            <span className="label md:hidden">← 좌우로 밀어 넘기기 →</span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
