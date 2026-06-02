"use client";

import { useEffect, useState } from "react";
import JustifiedGallery, { type JItem } from "./JustifiedGallery";
import { shuffle, type GalleryStill } from "@/lib/works";

function toItems(stills: GalleryStill[]): JItem[] {
  return stills.map((s) => ({
    src: s.src,
    href: `/work/${s.workSlug}`,
    caption: `${s.workTitle} · ${s.artist}`,
    w: s.w,
    h: s.h,
    blur: s.blur,
  }));
}

/** 갤러리 페이지 — 전체 스틸을 매 방문마다 랜덤 순서로 보여줌 */
export default function GalleryGrid({ stills }: { stills: GalleryStill[] }) {
  const [items, setItems] = useState<JItem[]>(() => toItems(stills));

  useEffect(() => setItems(shuffle(toItems(stills))), [stills]);

  if (!stills.length) {
    return <p className="wrap text-sm text-bone-faint">Stills coming soon.</p>;
  }

  return <JustifiedGallery items={items} />;
}
