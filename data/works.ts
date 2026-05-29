// ============================================================================
//  CDL 포트폴리오 작업 목록
// ----------------------------------------------------------------------------
//  ✅ 새 작업을 추가하려면 아래 works 배열에 항목을 하나 더 넣으면 됩니다.
//     사이트는 publishedAt(유튜브 업로드 날짜) 기준으로 자동 정렬됩니다.
//
//  ✅ 크레딧(credits)은 비워둬도 되고(= []), 아주 길어도 됩니다.
//     { role: "직무", name: "이름" } 형태로 원하는 만큼 추가하세요.
//
//  ✅ 색보정 스틸(stills)은 /public/stills/<slug>/ 폴더에 이미지를 넣은 뒤
//     "/stills/<slug>/파일명.jpg" 경로를 배열에 추가하면 됩니다.
//     스틸이 없으면 빈 배열([])로 두면 됩니다.
// ============================================================================

export interface Credit {
  /** 직무 — 예: "감독", "촬영감독", "편집", "색보정" */
  role: string;
  /** 이름 — 예: "홍길동" 또는 "OOO 스튜디오" */
  name: string;
}

export interface Work {
  /** URL에 쓰이는 고유 id (영문/숫자/하이픈). 예: "memi-badidea" */
  slug: string;
  /** 작품 제목 */
  title: string;
  /** 아티스트 / 채널 / 클라이언트 */
  artist: string;
  /** 분류 — 예: "Music Video", "Commercial", "Film" */
  category: string;
  /** 유튜브 영상 ID — 주소 youtu.be/XXXX 또는 watch?v=XXXX 의 XXXX 부분 */
  youtubeId: string;
  /** 유튜브 업로드 날짜 (YYYY-MM-DD) — 정렬 기준 */
  publishedAt: string;
  /** 한 줄 소개 (선택) */
  description?: string;
  /** 참여 스태프 크레딧 — 없으면 [] */
  credits: Credit[];
  /** 색보정 스틸 이미지 경로 — 없으면 [] */
  stills: string[];
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
    credits: [
      // 실제 크레딧으로 자유롭게 추가/수정하세요. (예시는 정확히 아는 항목만 넣어두었습니다)
      { role: "색보정", name: "CDL" },
    ],
    stills: [
      // 색보정 스틸을 /public/stills/zerobaseone-love-aint-easy/ 에 넣고 경로를 추가하세요.
      "/stills/zerobaseone-love-aint-easy/still-01.jpg",
      "/stills/zerobaseone-love-aint-easy/still-02.jpg",
      "/stills/zerobaseone-love-aint-easy/still-03.jpg",
      "/stills/zerobaseone-love-aint-easy/still-04.jpg",
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
    credits: [
      { role: "색보정", name: "CDL" },
    ],
    stills: [
      "/stills/memi-badidea/still-01.jpg",
      "/stills/memi-badidea/still-02.jpg",
      "/stills/memi-badidea/still-03.jpg",
      "/stills/memi-badidea/still-04.jpg",
    ],
  },
];
