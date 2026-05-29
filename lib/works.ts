import { cache } from "react";
import { list } from "@vercel/blob";
import { works as seedWorks, type Work } from "@/data/works";

export const WORKS_BLOB_PATH = "works.json";

/**
 * 포트폴리오 데이터 로드 — Vercel Blob의 works.json을 우선 사용하고,
 * 없거나 오류가 나면 시드 데이터(data/works.ts)로 안전하게 대체합니다.
 * (cache로 같은 요청 내 중복 호출을 1회로 합칩니다)
 */
export const getWorks = cache(async (): Promise<Work[]> => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return seedWorks;
  try {
    const { blobs } = await list({ prefix: WORKS_BLOB_PATH, limit: 10, token });
    const found = blobs.find((b) => b.pathname === WORKS_BLOB_PATH);
    if (!found) return seedWorks;
    // CDN 캐시 우회 — works.json은 자주 바뀌므로 항상 최신본을 읽음
    const res = await fetch(`${found.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return seedWorks;
    const data = (await res.json()) as Work[];
    return Array.isArray(data) && data.length >= 0 ? data : seedWorks;
  } catch {
    return seedWorks;
  }
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
      artist: w.artist,
    }))
  );
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
