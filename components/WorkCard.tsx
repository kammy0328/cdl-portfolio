import Link from "next/link";
import type { Work } from "@/data/works";
import { formatDate } from "@/lib/works";
import YouTubeThumb from "./YouTubeThumb";

export default function WorkCard({ work }: { work: Work }) {
  return (
    <Link href={`/work/${work.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line">
        <YouTubeThumb
          id={work.youtubeId}
          alt={work.title}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition group-hover:opacity-95" />
        {/* 호버 시 재생 표식 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 ring-1 ring-white/30 backdrop-blur-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-bone">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
          <span className="label !text-bone-dim">{work.category}</span>
          <span className="label !text-bone-dim">{formatDate(work.publishedAt)}</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium tracking-tight text-bone transition group-hover:text-accent-warm">
          {work.title}
        </h3>
        <p className="mt-1 text-sm text-bone-dim">{work.artist}</p>
      </div>
    </Link>
  );
}
