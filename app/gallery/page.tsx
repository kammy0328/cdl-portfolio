import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { getAllStills } from "@/lib/works";

export const metadata: Metadata = {
  title: "Gallery",
  description: "CDL이 작업한 영상들의 색보정 스틸 갤러리.",
};

export default function GalleryPage() {
  const stills = getAllStills();

  return (
    <div className="pt-28 sm:pt-32">
      <header className="wrap mb-10 flex items-end justify-between">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          색보정 스틸
        </h1>
        <span className="label hidden sm:block">{stills.length} Stills</span>
      </header>

      <GalleryGrid stills={stills} />
    </div>
  );
}
