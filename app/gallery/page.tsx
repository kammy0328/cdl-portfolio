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
    <div className="wrap pt-28 sm:pt-32">
      <header className="mb-12">
        <p className="eyebrow">Gallery</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          색보정 스틸
        </h1>
        <p className="mt-4 max-w-xl text-base text-bone-dim">
          지금까지 작업한 영상들의 색보정 스틸입니다. 방문할 때마다 무작위
          순서로 보여집니다. 이미지를 누르면 크게 볼 수 있어요.
        </p>
      </header>

      <GalleryGrid stills={stills} />
    </div>
  );
}
