import WorkCard from "@/components/WorkCard";
import Reveal from "@/components/Reveal";
import { getWorksSorted } from "@/lib/works";

// 정적 + ISR — CDN 캐시로 빠른 TTFB. 관리자 저장 시 revalidatePath로 즉시 무효화.
export const revalidate = 60;

export default async function Home() {
  const works = await getWorksSorted();

  return (
    <>
      {/* 호버 미리보기 첫 재생을 빠르게 — YouTube 도메인 사전 연결 */}
      <link rel="preconnect" href="https://www.youtube.com" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://i.ytimg.com" />
      <link rel="preconnect" href="https://www.gstatic.com" />
      <section className="wrap pb-24 pt-24 sm:pt-28">
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
