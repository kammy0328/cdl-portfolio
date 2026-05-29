"use client";

import { useState } from "react";
import YouTubeThumb from "./YouTubeThumb";

/** 클릭 시 유튜브 iframe을 불러오는 경량 플레이어 (초기 로딩 최적화) */
export default function VideoEmbed({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setActive(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`${title} 재생`}
        >
          <YouTubeThumb
            id={youtubeId}
            alt={title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/10" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/30 backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-black/70">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-bone">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
