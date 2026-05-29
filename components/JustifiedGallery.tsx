"use client";

import { useEffect, useRef, useState } from "react";
import Lightbox, { type LightboxImage } from "./Lightbox";

export interface JItem {
  src: string;
  href?: string;
  caption?: string;
  /** 알고 있으면 비율 측정 생략 (관리자 업로드 시 저장) */
  w?: number;
  h?: number;
}

const GAP = 4; // 헤어라인 간격 (px)
const DEFAULT_RATIO = 16 / 9;

type Cell = { item: JItem; r: number; idx: number; w: number };
type Row = { cells: Cell[]; h: number };

/**
 * 다양한 비율(16:9·4:3·9:16 등)의 이미지를 컨테이너 폭에 맞춰
 * 여백 없이 정렬하는(justified) 갤러리. 호버 효과 없음, 클릭 시 라이트박스.
 */
export default function JustifiedGallery({ items }: { items: JItem[] }) {
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [width, setWidth] = useState(0);
  const [settled, setSettled] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // 컨테이너 폭 측정
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 비율: 제공된 w/h가 있으면 사용, 없으면 프리로드해서 측정
  useEffect(() => {
    let alive = true;
    const seeded: Record<string, number> = {};
    const toLoad: JItem[] = [];
    for (const it of items) {
      if (it.w && it.h) seeded[it.src] = it.w / it.h;
      else toLoad.push(it);
    }
    if (Object.keys(seeded).length) setRatios((p) => ({ ...seeded, ...p }));
    toLoad.forEach((it) => {
      const img = new Image();
      img.onload = () => {
        if (!alive || img.naturalHeight === 0) return;
        setRatios((p) =>
          p[it.src] ? p : { ...p, [it.src]: img.naturalWidth / img.naturalHeight }
        );
      };
      img.src = it.src;
    });
    const t = setTimeout(() => alive && setSettled(true), 2500);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [items]);

  if (!items.length) return null;

  const allMeasured = items.every((it) => ratios[it.src]);
  const ready = width > 0 && (allMeasured || settled);
  const targetH =
    width < 560 ? 200 : width < 900 ? 260 : width < 1280 ? 300 : 340;

  // justified 행 계산 (각 셀은 고정 index 유지 → 안정적인 key)
  const rows: Row[] = [];
  let buf: Cell[] = [];
  let sumR = 0;
  items.forEach((item, i) => {
    const r = ratios[item.src] || DEFAULT_RATIO;
    buf.push({ item, r, idx: i, w: r * targetH });
    sumR += r;
    if (width > 0 && sumR * targetH + GAP * (buf.length - 1) >= width) {
      const h = (width - GAP * (buf.length - 1)) / sumR;
      rows.push({ cells: buf.map((c) => ({ ...c, w: c.r * h })), h });
      buf = [];
      sumR = 0;
    }
  });
  if (buf.length) rows.push({ cells: buf, h: targetH });

  const images: LightboxImage[] = items.map((it) => ({
    src: it.src,
    caption: it.caption,
    href: it.href,
  }));

  return (
    <>
      <div ref={ref} className="w-full">
        {ready ? (
          rows.map((row, ri) => (
            <div
              key={ri}
              className="flex"
              style={{ gap: GAP, marginBottom: GAP }}
            >
              {row.cells.map((cell) => (
                <button
                  key={cell.item.src + cell.idx}
                  onClick={() => setIdx(cell.idx)}
                  className="relative shrink-0 overflow-hidden bg-ink-soft"
                  style={{ width: cell.w, height: row.h }}
                  aria-label="스틸 크게 보기"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cell.item.src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ))
        ) : (
          <div className="h-[60vh] w-full" />
        )}
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
