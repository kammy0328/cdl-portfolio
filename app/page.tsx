import Link from "next/link";
import WorkCard from "@/components/WorkCard";
import Reveal from "@/components/Reveal";
import { getWorksSorted } from "@/lib/works";

export default function Home() {
  const works = getWorksSorted();

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="grain relative flex min-h-[90vh] items-center overflow-hidden pt-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-[42rem] w-[42rem] rounded-full bg-accent-cool/10 blur-[140px]" />
          <div className="absolute -right-32 bottom-0 h-[38rem] w-[38rem] rounded-full bg-accent-warm/10 blur-[140px]" />
        </div>

        <div className="wrap relative">
          <p className="eyebrow animate-fade-up">Remote Colorist — Korea</p>
          <h1
            className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-bone animate-fade-up sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            색으로
            <br />
            이야기를 완성합니다
          </h1>
          <p
            className="mt-7 max-w-xl text-base leading-relaxed text-bone-dim animate-fade-up sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            CDL은 오프라인 작업실 없이, 온라인 원격으로 영상 색보정을 진행하는
            컬러리스트입니다. 뮤직비디오부터 광고, 필름까지 — 장면의 온도와
            분위기를 만듭니다.
          </p>
          <div
            className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 rounded-sm bg-bone px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-accent-warm"
            >
              작업 보기
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-ink-line px-7 py-3.5 text-sm font-medium text-bone transition hover:border-bone-dim hover:bg-white/5"
            >
              작업 문의
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in">
          <span className="label">Scroll</span>
        </div>
      </section>

      {/* ---------------- Selected Work ---------------- */}
      <section id="work" className="wrap scroll-mt-24 py-20 sm:py-28">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              작업
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-bone-dim sm:block">
            유튜브 업로드 최신순으로 정렬됩니다.
          </p>
        </Reveal>

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {works.map((w, i) => (
            <Reveal key={w.slug} delay={i * 80}>
              <WorkCard work={w} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- About teaser ---------------- */}
      <section className="border-t border-ink-line">
        <div className="wrap grid gap-10 py-20 sm:py-28 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="eyebrow">About</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              어디서 촬영하든,
              <br />
              색은 원격으로 완성합니다
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-base leading-relaxed text-bone-dim">
              물리적 작업실 방문 없이 온라인으로 소스를 전달받아 색보정을
              진행합니다. 원본 푸티지 검토, 룩 설계, 디테일 보정, 그리고 최종
              납품까지 — 모든 과정을 원격으로 매끄럽게 진행합니다.
            </p>
            <Link
              href="/about"
              className="link-underline mt-6 inline-block text-sm font-medium text-accent-warm"
            >
              CDL 소개 →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
