"use client";

import { useState } from "react";

/** 유튜브 썸네일 — 고화질(maxres)이 없으면 자동으로 hq로 대체 */
export default function YouTubeThumb({
  id,
  alt,
  className,
}: {
  id: string;
  alt: string;
  className?: string;
}) {
  const [src, setSrc] = useState(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
    />
  );
}
