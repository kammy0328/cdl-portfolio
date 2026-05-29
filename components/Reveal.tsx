"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** 스크롤하여 화면에 들어오면 부드럽게 페이드업 되는 래퍼 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 마운트 시점에 이미 뷰포트 안이면 즉시 표시 (상단 콘텐츠 깜빡임 방지)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);

    // 안전장치: IO가 동작하지 않아도 콘텐츠가 끝내 보이도록 보장
    const fallback = setTimeout(() => setShown(true), 1000);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
