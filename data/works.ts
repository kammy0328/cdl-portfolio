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
  /** 아티스트/멤버명 (뮤직비디오는 그룹명과 분리) — 공란 가능 */
  artist: string;
  /** 그룹명 (뮤직비디오) — 선택, 공란 가능 */
  group?: string;
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
    artist: "석매튜",
    group: "ZEROBASEONE",
    category: "Music Video",
    youtubeId: "nZS9J20OWog",
    publishedAt: "2026-05-28",
    description: "",
    credits: [
      { role: "Production", name: "Memudworks (@memudworks)" },
      { role: "Director", name: "Yang Siwook (@yangsiwook)" },
      { role: "Producer", name: "Baik Sooah" },
      { role: "Assistant Director", name: "sm.lee" },
      { role: "DOP", name: "Choi Youngwoo" },
      { role: "Camera crew", name: "Yoo Hyunjin, Heo jun, Woo taemin" },
      { role: "Gaffer", name: "Park Sunghun" },
      { role: "Lighting crew", name: "Sung Woojin, Park Jinwoo, Yoon Changhwan, Lee Hyunwoo, Yoon Dowoon" },
      { role: "Show Light", name: "J SHOW COMPANY" },
      { role: "Art Director", name: "Kim Dooeun" },
      { role: "Art Team", name: "Hwang Yooju" },
      { role: "FD", name: "Kim Daegun, Lee Byungcheol" },
      { role: "Edit", name: "Yang Siwook (@yangsiwook)" },
      { role: "DI", name: "CDL (@cdl_nolut)" },
      { role: "Beauty", name: "DIAP (@digital_apgujeong)" },
      { role: "Clean", name: "DIAP, Pixelsurgery" },
      { role: "Comp", name: "Pixelsurgery" },
    ],
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
    credits: [
      { role: "Production", name: "Memudworks (@memudworks)" },
      { role: "Director", name: "Yang Siwook (@yangsiwook)" },
      { role: "Producer", name: "Sooah Baik" },
      { role: "Assistant Director", name: "sm.lee" },
      { role: "DOP", name: "Youngwoo Choi" },
      { role: "Camera crew", name: "Taewoo Kim, Hyunsoo Kim, Seokhwan Jung, Janghyun Seo, Youngju Kim" },
      { role: "Gaffer", name: "Sunghun Park" },
      { role: "Lighting crew", name: "Gun Kim, Woojin Sung, Sungju Kim, Hyunwoo Lee" },
      { role: "Art Director", name: "Dooeun Kim" },
      { role: "Art Team", name: "Hyunjun Shin, Sohyun Lee, Dongmin Kim, Sookyung Cho" },
      { role: "FD", name: "Byungcheol Lee, Juwon Eom" },
      { role: "Edit", name: "Yang Siwook (@yangsiwook)" },
      { role: "Colorist", name: "CDL (@cdl_nolut)" },
      { role: "Beauty / Clean", name: "디지털압구정 (@digital_apgujeong)" },
      { role: "Friends", name: "Keere, Pedro, Junki Hong, Hyunjae Kim, Jawook Kim, Byeonghyun Jeon, Hyukjae Jung, Jaeyi Her, Byungcheol Lee" },
    ],
    stills: [
      { src: "/stills/memi-badidea/still-02.jpg" },
      { src: "/stills/memi-badidea/still-03.jpg" },
      { src: "/stills/memi-badidea/still-04.jpg" },
    ],
  },
];
