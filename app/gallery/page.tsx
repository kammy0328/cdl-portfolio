import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { getAllStills } from "@/lib/works";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "뮤직비디오, 영화, 단편영화 색보정 스틸 갤러리 — CDL 컬러리스트. Color grading stills by CDL.",
};

export default async function GalleryPage() {
  const stills = await getAllStills();

  return (
    <div className="pt-24 sm:pt-28">
      <GalleryGrid stills={stills} />
    </div>
  );
}
