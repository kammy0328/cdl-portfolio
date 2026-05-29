"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Lightbox, { type LightboxImage } from "./Lightbox";
import { shuffle, type GalleryStill } from "@/lib/works";

const GAP = 4; // 헤어라인 간격 (px)
const DEFAULT_RATIO = 16 / 9;

type Cell = { still: GalleryStill; r: number; w: number };
type Row = { cells: Cell[]; h: number; last: boolean };

/** 컨테이너 폭에 맞춰 영화 필름 스트립처럼 정렬되는(justified) 갤러리 */
export default function GalleryGrid({ stills }: { stills: GalleryStill[] }) {
  const [items, setItems] = useState<GalleryStill[]>(stills);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [width, setWidth] = useState(0);
  const [idx, setIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // 방문할 때마다 무작위 순서
  useEffect(() => setItems(shuffle(stills)), [stills]);

  // 컨테이너 폭 측정
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!stills.length) {
    return (
      <p className="wrap text-sm text-bone-faint">
        색보정 스틸이 곧 업데이트됩니다.
      </p>
    );
  }

  const targetH =
    width < 560 ? 190 : width < 900 ? 250 : width < 1280 ? 300 : 340;

  // justified 행 계산
  const rows: Row[] = [];
  let buf: Cell[] = [];
  let sumR = 0;
  for (const still of items) {
    const r = ratios[still.src] || DEFAULT_RATIO;
    buf.push({ still, r, w: 0 });
    sumR += r;
    const rowW = sumR * targetH + GAP * (buf.length - 1);
    if (rowW >= width && width > 0) {
      const h = (width - GAP * (buf.length - 1)) / sumR;
      rows.push({
        cells: buf.map((c) => ({ ...c, w: c.r * h })),
        h,
        last: false,
      });
      buf = [];
      sumR = 0;
    }
  }
  if (buf.length) {
    // 마지막 줄은 늘리지 않고 기준 높이로 좌측 정렬
    rows.push({
      cells: buf.map((c) => ({ ...c, w: c.r * targetH })),
      h: targetH,
      last: true,
    });
  }

  const images: LightboxImage[] = items.map((s) => ({
    src: s.src,
    caption: `${s.workTitle} · ${s.artist}`,
  }));

  let counter = 0;

  return (
    <>
      <div ref={ref} className="w-full">
        {width > 0 &&
          rows.map((row, ri) => (
            <div
              key={ri}
              className="flex"
              style={{ gap: GAP, marginBottom: GAP }}
            >
              {row.cells.map((cell) => {
                const i = counter++;
                return (
                  <button
                    key={cell.still.src + i}
                    onClick={() => setIdx(i)}
                    className="group relative shrink-0 overflow-hidden bg-ink-soft"
                    style={{ width: cell.w, height: row.h }}
                    aria-label={`${cell.still.workTitle} 스틸 크게 보기`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cell.still.src}
                      alt={cell.still.workTitle}
                      loading="lazy"
                      onLoad={(e) => {
                        const im = e.currentTarget;
                        if (im.naturalHeight > 0) {
                          const r = im.naturalWidth / im.naturalHeight;
                          setRatios((prev) =>
                            prev[cell.still.src] ? prev : { ...prev, [cell.still.src]: r }
                          );
                        }
                      }}
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    {/* 호버 시에만 옅게 드러나는 정보 (미니멀) */}
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between p-3 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="text-xs font-medium text-bone">
                        {cell.still.workTitle}
                      </span>
                      <span className="label !text-bone-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
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
