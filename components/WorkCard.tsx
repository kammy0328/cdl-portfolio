"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Work } from "@/data/works";
import { displayArtist } from "@/lib/works";
import { videoThumb, videoEmbedUrl, videoPlatform } from "@/lib/video";

// ---- YouTube IFrame API (lazy · 한 번만 로드) ----
type YTPlayer = {
  destroy: () => void;
  mute: () => void;
  playVideo: () => void;
};
type YTEvent = { target: YTPlayer; data: number };
type YTApi = {
  Player: new (el: HTMLElement, opts: unknown) => YTPlayer;
  PlayerState: { PLAYING: number };
};
type WinYT = Window & {
  YT?: YTApi;
  onYouTubeIframeAPIReady?: () => void;
};

let ytReady: Promise<YTApi> | null = null;
function loadYT(): Promise<YTApi> {
  const w = window as WinYT;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (ytReady) return ytReady;
  ytReady = new Promise<YTApi>((resolve) => {
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (w.YT) resolve(w.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytReady;
}

// 재생 시작(PLAYING) 후 짧게 기다렸다 디졸브 — 유튜브 시작 UI가 가라앉을 최소 시간
const REVEAL_DELAY = 600;

export default function WorkCard({ work }: { work: Work }) {
  const platform = videoPlatform(work);
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false); // 실제 재생 시작 → 썸네일 디졸브
  const [thumb, setThumb] = useState(videoThumb(work));
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  // YouTube — PLAYING 상태가 되면 디졸브 (스피너 노출 없음)
  useEffect(() => {
    if (!hovered || platform !== "youtube" || !work.youtubeId) return;
    let cancelled = false;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    const holder = holderRef.current;
    loadYT().then((YT) => {
      if (cancelled || !holder) return;
      const el = document.createElement("div");
      holder.appendChild(el);
      playerRef.current = new YT.Player(el, {
        videoId: work.youtubeId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: work.youtubeId,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e: YTEvent) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e: YTEvent) => {
            // 재생이 시작되고 유튜브 UI가 가라앉은 뒤 디졸브 (한 번만)
            if (cancelled || e.data !== YT.PlayerState.PLAYING || revealTimer) return;
            revealTimer = setTimeout(() => {
              if (!cancelled) setPlaying(true);
            }, REVEAL_DELAY);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      if (revealTimer) clearTimeout(revealTimer);
      setPlaying(false);
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
      if (holder) holder.innerHTML = "";
    };
  }, [hovered, platform, work.youtubeId]);

  // 첫 호버 지연 제거 — 마운트 시 YouTube IFrame API를 미리 로드
  useEffect(() => {
    if (platform === "youtube") loadYT();
  }, [platform]);

  const isVimeo = platform === "vimeo";

  return (
    <Link
      href={`/work/${work.slug}`}
      className="block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative aspect-video overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line transition-transform duration-300 ease-out"
        style={{ transform: hovered ? "scale(1.02)" : "scale(1)" }}
      >
        {/* YouTube 플레이어 (뒤) — 크롭 없이 전체 프레임, controls=0 + pointer-events-none로 UI 숨김 */}
        {platform === "youtube" && (
          <div
            ref={holderRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full"
          />
        )}
        {/* Vimeo 미리보기 (뒤) — background 모드는 UI 없이 즉시 재생 */}
        {isVimeo && hovered && (
          <iframe
            src={videoEmbedUrl(work, true)}
            title={work.title}
            allow="autoplay; muted; picture-in-picture"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={() => setPlaying(true)}
            className="pointer-events-none absolute inset-0 h-full w-full border-0"
          />
        )}
        {/* 썸네일 (앞) — 영상이 실제 재생되면 디졸브로 사라짐 */}
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={work.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
            style={{ opacity: hovered && playing ? 0 : 1 }}
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
