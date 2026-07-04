import WorkCard from "@/components/WorkCard";
import Reveal from "@/components/Reveal";
import { getWorksSorted } from "@/lib/works";
import { site } from "@/lib/site";

// 정적 + ISR — CDN 캐시로 빠른 TTFB. 관리자 저장 시 revalidatePath로 즉시 무효화.
export const revalidate = 60;

export default async function Home() {
  const works = await getWorksSorted();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "CDL",
    alternateName: "CDL 컬러리스트",
    jobTitle: "Colorist",
    description: site.description,
    url: site.url,
    sameAs: [site.instagramUrl],
    knowsAbout: ["색보정", "컬러그레이딩", "뮤직비디오 색보정", "영화 색보정", "단편영화 색보정"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 호버 미리보기 첫 재생을 빠르게 — YouTube 도메인 사전 연결 */}
      <link rel="preconnect" href="https://www.youtube.com" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://i.ytimg.com" />
      <link rel="preconnect" href="https://www.gstatic.com" />
      <section className="wrap pb-24 pt-24 sm:pt-28">
        <header className="mb-14 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            CDL — Colorist
          </h1>
          <p className="mt-4 text-base leading-relaxed text-bone-dim">
            뮤직비디오, 영화, 단편영화 색보정을 전문으로 하는 컬러리스트 CDL의 포트폴리오입니다.
          </p>
        </header>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {works.map((w, i) => (
            <Reveal key={w.slug} delay={i * 80}>
              <WorkCard work={w} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
