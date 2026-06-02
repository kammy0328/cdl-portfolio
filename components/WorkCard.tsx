"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Work } from "@/data/works";
import { displayArtist } from "@/lib/works";
import { videoThumb, videoEmbedUrl, videoPlatform } from "@/lib/video";

export default function WorkCard({ work }: { work: Work }) {
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false); // 영상 재생 추정 → 썸네일 디졸브
  const [mounted, setMounted] = useState(false); // iframe 마운트 (로드)
  const [thumb, setThumb] = useState(videoThumb(work));
  const platform = videoPlatform(work);

  useEffect(() => {
    if (hovered && platform) {
      setMounted(true); // 즉시 로드 시작 (보이지 않게)
      const t = setTimeout(() => setReady(true), 650); // 재생 시작 즈음 디졸브
      return () => clearTimeout(t);
    }
    setReady(false); // 썸네일 다시 페이드인
    const t = setTimeout(() => setMounted(false), 800); // 썸네일이 덮은 뒤 언마운트
    return () => clearTimeout(t);
  }, [hovered, platform]);

  return (
    <Link
      href={`/work/${work.slug}`}
      className="block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line">
        {/* 무음 영상 (뒤) — 130% 확대로 유튜브 UI(제목·로고)를 화면 밖으로 크롭 */}
        {mounted && platform && (
          <iframe
            src={videoEmbedUrl(work, true)}
            title={work.title}
            allow="autoplay; muted; picture-in-picture"
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 border-0"
          />
        )}
        {/* 썸네일 (앞) — 영상이 준비되면 디졸브로 사라짐 */}
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={work.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: hovered && ready ? 0 : 1 }}
            onError={() => {
              if (platform === "youtube" && work.youtubeId) {
                setThumb(`https://i.ytimg.com/vi/${work.youtubeId}/hqdefault.jpg`);
              }
            }}
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
