import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { getAllStills } from "@/lib/works";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description: "Color grading stills by CDL.",
};

export default async function GalleryPage() {
  const stills = await getAllStills();

  return (
    <div className="pt-24 sm:pt-28">
      <GalleryGrid stills={stills} />
    </div>
  );
}
