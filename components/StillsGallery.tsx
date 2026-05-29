"use client";

import JustifiedGallery from "./JustifiedGallery";
import type { Still } from "@/data/works";

/** 작업 상세 페이지의 색보정 스틸 갤러리 (다양한 비율 대응) */
export default function StillsGallery({
  stills,
  title,
}: {
  stills: Still[];
  title: string;
}) {
  if (!stills.length) {
    return <p className="text-sm text-bone-faint">Stills coming soon.</p>;
  }

  const items = stills.map((s, i) => ({
    src: s.src,
    w: s.w,
    h: s.h,
    caption: `${title} — Still ${String(i + 1).padStart(2, "0")}`,
  }));

  return <JustifiedGallery items={items} />;
}
