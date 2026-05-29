import Link from "next/link";
import type { Work } from "@/data/works";
import YouTubeThumb from "./YouTubeThumb";

export default function WorkCard({ work }: { work: Work }) {
  return (
    <Link href={`/work/${work.slug}`} className="block">
      <div className="relative aspect-video overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line">
        <YouTubeThumb
          id={work.youtubeId}
          alt={work.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium tracking-tight text-bone">
          {work.title}
        </h3>
        <p className="mt-1 text-sm text-bone-dim">{work.artist}</p>
      </div>
    </Link>
  );
}
