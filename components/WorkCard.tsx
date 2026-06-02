"use client";

import { useState } from "react";
import Link from "next/link";
import type { Work } from "@/data/works";
import { displayArtist } from "@/lib/works";
import { videoThumb, videoEmbedUrl, videoPlatform } from "@/lib/video";

export default function WorkCard({ work }: { work: Work }) {
  const [hovered, setHovered] = useState(false);
  const [thumb, setThumb] = useState(videoThumb(work));
  const platform = videoPlatform(work);

  return (
    <Link
      href={`/work/${work.slug}`}
      className="block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line">
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={work.title}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => {
              if (platform === "youtube" && work.youtubeId) {
                setThumb(`https://i.ytimg.com/vi/${work.youtubeId}/hqdefault.jpg`);
              }
            }}
          />
        )}
        {/* 호버 시 무음 영상 미리보기 (데스크탑) */}
        {hovered && platform && (
          <iframe
            src={videoEmbedUrl(work, true)}
            title={work.title}
            allow="autoplay; muted; picture-in-picture"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium tracking-tight text-bone">
          {work.title}
        </h3>
        <p className="mt-1 text-sm text-bone-dim">{displayArtist(work)}</p>
      </div>
    </Link>
  );
}
