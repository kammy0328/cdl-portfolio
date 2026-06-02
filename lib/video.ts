// YouTube / Vimeo 통합 헬퍼

export type VideoFields = {
  youtubeId?: string;
  vimeoId?: string;
  thumb?: string;
};

export function videoPlatform(w: VideoFields): "youtube" | "vimeo" | null {
  if (w.vimeoId) return "vimeo";
  if (w.youtubeId) return "youtube";
  return null;
}

/** 카드/포스터 썸네일 — thumb 우선, 없으면 YouTube에서 유추 */
export function videoThumb(w: VideoFields): string {
  if (w.thumb) return w.thumb;
  if (w.youtubeId) return `https://i.ytimg.com/vi/${w.youtubeId}/maxresdefault.jpg`;
  return "";
}

/** preview=true → 무음 자동재생 루프 (호버 미리보기용) */
export function videoEmbedUrl(w: VideoFields, preview = false): string {
  if (w.vimeoId) {
    return preview
      ? `https://player.vimeo.com/video/${w.vimeoId}?autoplay=1&muted=1&loop=1&background=1`
      : `https://player.vimeo.com/video/${w.vimeoId}?autoplay=1&dnt=1`;
  }
  if (w.youtubeId) {
    return preview
      ? `https://www.youtube.com/embed/${w.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${w.youtubeId}&controls=0&modestbranding=1&playsinline=1&rel=0`
      : `https://www.youtube.com/embed/${w.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  }
  return "";
}

export function videoWatchUrl(w: VideoFields): string {
  if (w.vimeoId) return `https://vimeo.com/${w.vimeoId}`;
  if (w.youtubeId) return `https://youtu.be/${w.youtubeId}`;
  return "";
}

/** URL 또는 ID 문자열에서 플랫폼 + ID 추출 */
export function parseVideo(
  input: string
): { platform: "youtube" | "vimeo"; id: string } | null {
  const s = (input || "").trim();
  if (!s) return null;
  const vimeo =
    s.match(/player\.vimeo\.com\/video\/(\d+)/) || s.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { platform: "vimeo", id: vimeo[1] };
  const yt = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of yt) {
    const m = s.match(re);
    if (m) return { platform: "youtube", id: m[1] };
  }
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return { platform: "youtube", id: s };
  if (/^\d+$/.test(s)) return { platform: "vimeo", id: s };
  return null;
}
