// ============================================================================
//  CDL 포트폴리오 작업 목록 (시드 데이터)
// ----------------------------------------------------------------------------
//  ※ 관리자 페이지(/admin)에서 업로드하면 클라우드(Vercel Blob)의 works.json 에
//     저장되고, 사이트는 그 데이터를 우선 사용합니다. 이 파일은 초기/대체용입니다.
//
//  ✅ 크레딧(credits)은 비워둬도 되고(= []), 아주 길어도 됩니다.
//  ✅ 색보정 스틸(stills)은 { src, w, h } 객체. w/h(픽셀 크기)는 선택이며,
//     없으면 화면에서 자동 측정합니다. 비율(16:9·4:3·9:16 등) 무관하게 배치됩니다.
// ============================================================================

export interface Credit {
  /** 직무 — 예: "감독", "촬영감독", "편집", "색보정" */
  role: string;
  /** 이름 */
  name: string;
}

export interface Still {
  /** 이미지 경로 또는 URL */
  src: string;
  /** 원본 가로 픽셀 (선택) */
  w?: number;
  /** 원본 세로 픽셀 (선택) */
  h?: number;
}

export interface Work {
  slug: string;
  title: string;
  artist: string;
  category: string;
  /** 유튜브 영상 ID */
  youtubeId: string;
  /** 유튜브 업로드 날짜 (YYYY-MM-DD) — 정렬 기준 */
  publishedAt: string;
  description?: string;
  credits: Credit[];
  stills: Still[];
}

export const works: Work[] = [
  {
    slug: "zerobaseone-love-aint-easy",
    title: "Love Ain't Easy",
    artist: "ZEROBASEONE · Seok Matthew",
    category: "Music Video",
    youtubeId: "nZS9J20OWog",
    publishedAt: "2026-05-28",
    description: "",
    credits: [{ role: "색보정", name: "CDL" }],
    stills: [
      { src: "/stills/zerobaseone-love-aint-easy/still-02.jpg" },
      { src: "/stills/zerobaseone-love-aint-easy/still-03.jpg" },
      { src: "/stills/zerobaseone-love-aint-easy/still-04.jpg" },
    ],
  },
  {
    slug: "memi-badidea",
    title: "BADidea",
    artist: "MEMI",
    category: "Music Video",
    youtubeId: "i_-pZiZJ7MQ",
    publishedAt: "2026-04-29",
    description: "",
    credits: [{ role: "색보정", name: "CDL" }],
    stills: [
      { src: "/stills/memi-badidea/still-02.jpg" },
      { src: "/stills/memi-badidea/still-03.jpg" },
      { src: "/stills/memi-badidea/still-04.jpg" },
    ],
  },
];
