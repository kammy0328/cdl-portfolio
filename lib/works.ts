import { works, type Work } from "@/data/works";

/** 유튜브 업로드 날짜 기준 최신순 정렬 */
export function getWorksSorted(): Work[] {
  return [...works].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/** slug로 단일 작업 조회 */
export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

/** 최신순 정렬된 목록에서 이전/다음 작업 구하기 */
export function getAdjacentWorks(slug: string): {
  prev: Work | null;
  next: Work | null;
} {
  const sorted = getWorksSorted();
  const i = sorted.findIndex((w) => w.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? sorted[i - 1] : null,
    next: i < sorted.length - 1 ? sorted[i + 1] : null,
  };
}

export interface GalleryStill {
  src: string;
  workSlug: string;
  workTitle: string;
  artist: string;
}

/** 모든 작업의 스틸을 하나의 목록으로 평탄화 (갤러리 페이지용) */
export function getAllStills(): GalleryStill[] {
  return works.flatMap((w) =>
    w.stills.map((src) => ({
      src,
      workSlug: w.slug,
      workTitle: w.title,
      artist: w.artist,
    }))
  );
}

/** Fisher–Yates 셔플 — 갤러리에서 매 방문마다 랜덤 정렬에 사용 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 날짜를 YYYY.MM.DD 형태로 표기 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
