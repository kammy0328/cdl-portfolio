import { unstable_cache } from "next/cache";
import { list } from "@vercel/blob";
import { works as seedWorks, type Work } from "@/data/works";

export const WORKS_BLOB_PATH = "works.json";

/**
 * 포트폴리오 데이터 로드(항상 최신) — Vercel Blob의 works.json 우선,
 * 없거나 오류 시 시드 데이터로 안전 대체. 관리자(어드민)는 이 함수를 직접 사용.
 */
export async function loadWorks(): Promise<Work[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return seedWorks;
  try {
    const { blobs } = await list({ prefix: WORKS_BLOB_PATH, limit: 10, token });
    const found = blobs.find((b) => b.pathname === WORKS_BLOB_PATH);
    if (!found) return seedWorks;
    // CDN 캐시 우회 — works.json 최신본을 읽음 (재검증 시에만 호출)
    const res = await fetch(`${found.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return seedWorks;
    const data = (await res.json()) as Work[];
    if (!Array.isArray(data)) return seedWorks;
    // 썸네일(유튜브 커버 = 시드의 still-01)은 스틸로 노출하지 않음
    return data.map((w) => ({
      ...w,
      stills: (w.stills || []).filter((s) => !String(s.src).endsWith("still-01.jpg")),
    }));
  } catch {
    return seedWorks;
  }
}

/**
 * 공개 페이지용 — 60초 캐시. 관리자 저장 시 revalidateTag("works")로 즉시 갱신.
 * 매 방문마다 Blob을 읽지 않아 더 빠릅니다.
 */
export const getWorks = unstable_cache(loadWorks, ["cdl-works"], {
  tags: ["works"],
  revalidate: 60,
});

/** 유튜브 업로드 날짜 기준 최신순 정렬 */
export async function getWorksSorted(): Promise<Work[]> {
  const w = await getWorks();
  return [...w].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getWorkBySlug(slug: string): Promise<Work | undefined> {
  return (await getWorks()).find((w) => w.slug === slug);
}

export async function getAdjacentWorks(slug: string): Promise<{
  prev: Work | null;
  next: Work | null;
}> {
  const sorted = await getWorksSorted();
  const i = sorted.findIndex((w) => w.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? sorted[i - 1] : null,
    next: i < sorted.length - 1 ? sorted[i + 1] : null,
  };
}

export interface GalleryStill {
  src: string;
  w?: number;
  h?: number;
  workSlug: string;
  workTitle: string;
  artist: string;
}

/** 모든 작업의 스틸을 하나의 목록으로 평탄화 (갤러리 페이지용) */
export async function getAllStills(): Promise<GalleryStill[]> {
  const works = await getWorks();
  return works.flatMap((w) =>
    w.stills.map((s) => ({
      src: s.src,
      w: s.w,
      h: s.h,
      workSlug: w.slug,
      workTitle: w.title,
      artist: displayArtist(w),
    }))
  );
}

/** 그룹 + 아티스트를 합쳐 표시 (둘 중 하나가 공란이면 나머지만) */
export function displayArtist(w: { group?: string; artist?: string }): string {
  return [w.group, w.artist].filter(Boolean).join(" ");
}

/** Fisher–Yates 셔플 — 갤러리 랜덤 정렬 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 날짜를 YYYY.MM.DD 형태로 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
