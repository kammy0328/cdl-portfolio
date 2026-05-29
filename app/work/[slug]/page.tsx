import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { works } from "@/data/works";
import { getWorkBySlug, getAdjacentWorks, formatDate } from "@/lib/works";
import VideoEmbed from "@/components/VideoEmbed";
import StillsGallery from "@/components/StillsGallery";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return { title: "Not found" };
  const title = `${work.title} — ${work.artist}`;
  return {
    title,
    description: work.description || `${work.artist} · ${work.category} 색보정 — CDL`,
    openGraph: {
      title,
      images: [`https://i.ytimg.com/vi/${work.youtubeId}/maxresdefault.jpg`],
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const { prev, next } = getAdjacentWorks(slug);

  return (
    <article className="pt-28 sm:pt-32">
      <div className="wrap">
        {/* 뒤로 */}
        <Link
          href="/#work"
          className="label inline-flex items-center gap-2 transition hover:text-bone"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          작업 목록
        </Link>

        {/* 헤더 */}
        <header className="mt-6 border-b border-ink-line pb-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="label !text-accent-warm">{work.category}</span>
            <span className="label">{formatDate(work.publishedAt)}</span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {work.title}
          </h1>
          <p className="mt-3 text-lg text-bone-dim">{work.artist}</p>
        </header>

        {/* 영상 */}
        <div className="mt-10">
          <VideoEmbed youtubeId={work.youtubeId} title={`${work.title} — ${work.artist}`} />
        </div>

        {/* 설명 + 크레딧 / 정보 */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          {/* 크레딧 */}
          <section className="lg:col-span-8">
            {work.description && (
              <p className="mb-10 max-w-2xl text-base leading-relaxed text-bone-dim">
                {work.description}
              </p>
            )}
            <p className="eyebrow">Credits</p>
            <h2 className="mb-6 mt-3 text-2xl font-semibold tracking-tight">
              참여 스태프
            </h2>
            {work.credits.length === 0 ? (
              <p className="text-sm text-bone-faint">
                크레딧 정보가 없습니다.
              </p>
            ) : (
              <dl className="max-w-2xl">
                {work.credits.map((c, i) => (
                  <div
                    key={`${c.role}-${c.name}-${i}`}
                    className="flex gap-4 border-b border-ink-line py-3"
                  >
                    <dt className="label w-28 shrink-0 pt-0.5 sm:w-40">
                      {c.role}
                    </dt>
                    <dd className="text-sm text-bone sm:text-base">{c.name}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {/* 정보 */}
          <aside className="lg:col-span-4">
            <div className="rounded-sm border border-ink-line bg-ink-card p-6">
              <dl className="space-y-4">
                <div>
                  <dt className="label">Artist</dt>
                  <dd className="mt-1 text-sm text-bone">{work.artist}</dd>
                </div>
                <div>
                  <dt className="label">Category</dt>
                  <dd className="mt-1 text-sm text-bone">{work.category}</dd>
                </div>
                <div>
                  <dt className="label">Released</dt>
                  <dd className="mt-1 text-sm text-bone">
                    {formatDate(work.publishedAt)}
                  </dd>
                </div>
              </dl>
              <a
                href={`https://youtu.be/${work.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-6 inline-block text-sm font-medium text-accent-warm"
              >
                YouTube에서 보기 →
              </a>
            </div>
          </aside>
        </div>

        {/* 색보정 스틸 */}
        <section className="mt-20 border-t border-ink-line pt-14">
          <p className="eyebrow">Stills</p>
          <h2 className="mb-8 mt-3 text-2xl font-semibold tracking-tight">
            색보정 스틸
          </h2>
          <StillsGallery stills={work.stills} title={work.title} />
        </section>

        {/* 이전 / 다음 */}
        <nav className="mt-20 grid grid-cols-2 gap-4 border-t border-ink-line py-10">
          <div>
            {prev && (
              <Link href={`/work/${prev.slug}`} className="group block">
                <span className="label">← 이전 작업</span>
                <span className="mt-1 block text-sm font-medium text-bone-dim transition group-hover:text-bone">
                  {prev.title}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={`/work/${next.slug}`} className="group block">
                <span className="label">다음 작업 →</span>
                <span className="mt-1 block text-sm font-medium text-bone-dim transition group-hover:text-bone">
                  {next.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </article>
  );
}
