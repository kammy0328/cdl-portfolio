import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWorkBySlug, getAdjacentWorks, formatDate, displayArtist } from "@/lib/works";
import { videoThumb, videoEmbedUrl, videoWatchUrl } from "@/lib/video";
import VideoEmbed from "@/components/VideoEmbed";
import StillsGallery from "@/components/StillsGallery";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: "Not found" };
  const title = `${work.title} — ${work.artist}`;
  return {
    title,
    description: work.description || `${work.artist} · ${work.category} — color by CDL`,
    openGraph: {
      title,
      images: videoThumb(work) ? [videoThumb(work)] : [],
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const { prev, next } = await getAdjacentWorks(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${work.title} — ${displayArtist(work)}`,
    description:
      work.description || `${displayArtist(work)} · ${work.category} — color by CDL`,
    thumbnailUrl: videoThumb(work),
    uploadDate: work.publishedAt,
    embedUrl: videoEmbedUrl(work, false),
    contentUrl: videoWatchUrl(work),
  };

  return (
    <article className="pt-28 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wrap">
        {/* 뒤로 */}
        <Link
          href="/"
          className="label inline-flex items-center gap-2 transition hover:text-bone"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Work
        </Link>

        {/* 헤더 */}
        <header className="mt-6 border-b border-ink-line pb-10">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {work.title}
          </h1>
          <p className="mt-3 text-lg text-bone-dim">{displayArtist(work)}</p>
        </header>

        {/* 영상 */}
        <div className="mt-10">
          <VideoEmbed work={work} />
        </div>

        {/* 크레딧 / 정보 */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <section className="lg:col-span-8">
            {work.description && (
              <p className="mb-10 max-w-2xl text-base leading-relaxed text-bone-dim">
                {work.description}
              </p>
            )}
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Credits</h2>
            {work.credits.length === 0 ? (
              <p className="text-sm text-bone-faint">No credits listed.</p>
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
                    <dd className="text-sm text-bone sm:text-base">
                      <CreditName name={c.name} />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          <aside className="lg:col-span-4">
            <div className="rounded-sm border border-ink-line bg-ink-card p-6">
              <dl className="space-y-4">
                <div>
                  <dt className="label">Artist</dt>
                  <dd className="mt-1 text-sm text-bone">{displayArtist(work)}</dd>
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
            </div>
          </aside>
        </div>

        {/* 색보정 스틸 */}
        <section className="mt-20 border-t border-ink-line pt-14">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight">Stills</h2>
          <StillsGallery stills={work.stills} title={work.title} />
        </section>

        {/* 이전 / 다음 */}
        <nav className="mt-20 grid grid-cols-2 gap-4 border-t border-ink-line py-10">
          <div>
            {prev && (
              <Link href={`/work/${prev.slug}`} className="group block">
                <span className="label">← Prev</span>
                <span className="mt-1 block text-sm font-medium text-bone-dim transition group-hover:text-bone">
                  {prev.title}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={`/work/${next.slug}`} className="group block">
                <span className="label">Next →</span>
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

/** 크레딧 이름 안의 @인스타핸들을 클릭 가능한 링크로 변환 */
function CreditName({ name }: { name: string }) {
  const parts = name.split(/(@[A-Za-z0-9._]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^@[A-Za-z0-9._]+$/.test(p) ? (
          <a
            key={i}
            href={`https://instagram.com/${p.slice(1).replace(/\.+$/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-warm hover:underline"
          >
            {p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
