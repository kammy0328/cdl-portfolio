"use client";

import { useState } from "react";
import type { Work } from "@/data/works";
import { videoThumb, videoEmbedUrl, videoPlatform } from "@/lib/video";

/** 클릭 시 영상(YouTube/Vimeo) iframe을 불러오는 경량 플레이어 */
export default function VideoEmbed({ work }: { work: Work }) {
  const [active, setActive] = useState(false);
  const [thumb, setThumb] = useState(videoThumb(work));
  const platform = videoPlatform(work);
  const title = work.title;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={videoEmbedUrl(work, false)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setActive(true)}
          className="absolute inset-0 h-full w-full"
          aria-label={`Play ${title}`}
        >
          {thumb && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={title}
              className="h-full w-full object-cover"
              onError={() => {
                if (platform === "youtube" && work.youtubeId) {
                  setThumb(`https://i.ytimg.com/vi/${work.youtubeId}/hqdefault.jpg`);
                }
              }}
            />
          )}
          <span className="absolute inset-0 bg-black/25" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/30 backdrop-blur-sm">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-bone">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
