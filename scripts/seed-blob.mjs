// Blob의 works.json 을 현재 시드 데이터로 초기화/검증하는 1회용 스크립트
// 실행: node --env-file=.env.local scripts/seed-blob.mjs
import { put } from "@vercel/blob";

const works = [
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
      { src: "/stills/zerobaseone-love-aint-easy/still-01.jpg" },
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
      { src: "/stills/memi-badidea/still-01.jpg" },
      { src: "/stills/memi-badidea/still-02.jpg" },
      { src: "/stills/memi-badidea/still-03.jpg" },
      { src: "/stills/memi-badidea/still-04.jpg" },
    ],
  },
];

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("BLOB_READ_WRITE_TOKEN missing");
  process.exit(1);
}

const blob = await put("works.json", JSON.stringify(works, null, 2), {
  access: "public",
  contentType: "application/json",
  addRandomSuffix: false,
  allowOverwrite: true,
  token,
});
console.log("seeded works.json ->", blob.url);
