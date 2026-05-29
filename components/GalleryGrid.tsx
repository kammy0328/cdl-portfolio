"use client";

import { useEffect, useRef, useState } from "react";
import Lightbox, { type LightboxImage } from "./Lightbox";
import { shuffle, type GalleryStill } from "@/lib/works";

const GAP = 4; // 헤어라인 간격 (px)
const DEFAULT_RATIO = 16 / 9;

type Cell = { still: GalleryStill; r: number; idx: number; w: number };
type Row = { cells: Cell[]; h: number };

/** 컨테이너 폭에 맞춰 영화 필름 스트립처럼 정렬되는(justified) 갤러리 */
export default function GalleryGrid({ stills }: { stills: GalleryStill[] }) {
  const [items, setItems] = useState<GalleryStill[]>(stills);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [width, setWidth] = useState(0);
  const [settled, setSettled] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // 방문할 때마다 무작위 순서
  useEffect(() => setItems(shuffle(stills)), [stills]);

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

  // 실제 이미지 비율을 먼저 측정(프리로드) → 레이아웃을 한 번에 정확히 계산
  useEffect(() => {
    let alive = true;
    items.forEach((s) => {
      const img = new Image();
      img.onload = () => {
        if (!alive || img.naturalHeight === 0) return;
        setRatios((p) =>
          p[s.src] ? p : { ...p, [s.src]: img.naturalWidth / img.naturalHeight }
        );
      };
      img.src = s.src;
    });
    // 일부 이미지가 끝내 로드되지 않아도 최대 2.5초 후엔 표시
    const t = setTimeout(() => alive && setSettled(true), 2500);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [items]);

  if (!stills.length) {
    return (
      <p className="wrap text-sm text-bone-faint">Stills coming soon.</p>
    );
  }

  const allMeasured = items.length > 0 && items.every((s) => ratios[s.src]);
  const ready = width > 0 && (allMeasured || settled);

  const targetH =
    width < 560 ? 190 : width < 900 ? 250 : width < 1280 ? 300 : 340;

  // justified 행 계산 (각 셀은 items 내 고정 index를 유지 → 안정적인 key)
  const rows: Row[] = [];
  let buf: Cell[] = [];
  let sumR = 0;
  items.forEach((still, i) => {
    const r = ratios[still.src] || DEFAULT_RATIO;
    buf.push({ still, r, idx: i, w: r * targetH });
    sumR += r;
    if (width > 0 && sumR * targetH + GAP * (buf.length - 1) >= width) {
      const h = (width - GAP * (buf.length - 1)) / sumR;
      rows.push({ cells: buf.map((c) => ({ ...c, w: c.r * h })), h });
      buf = [];
      sumR = 0;
    }
  });
  if (buf.length) rows.push({ cells: buf, h: targetH }); // 마지막 줄: 기준 높이로 좌측 정렬

  const images: LightboxImage[] = items.map((s) => ({
    src: s.src,
    caption: `${s.workTitle} · ${s.artist}`,
    href: `/work/${s.workSlug}`,
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
                  key={cell.still.src + cell.idx}
                  onClick={() => setIdx(cell.idx)}
                  className="group relative shrink-0 overflow-hidden bg-ink-soft"
                  style={{ width: cell.w, height: row.h }}
                  aria-label={`View still — ${cell.still.workTitle}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cell.still.src}
                    alt={cell.still.workTitle}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between p-3 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="text-xs font-medium text-bone">
                      {cell.still.workTitle}
                    </span>
                    <span className="label !text-bone-dim">
                      {String(cell.idx + 1).padStart(2, "0")}
                    </span>
                  </span>
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
