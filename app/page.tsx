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
            className="mt-7 font-mono text-sm uppercase tracking-[0.15em] text-bone-dim animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            Music Video · Commercial · Film
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
        <Reveal className="mb-12">
          <p className="eyebrow">Selected Work</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            작업
          </h2>
        </Reveal>

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {works.map((w, i) => (
            <Reveal key={w.slug} delay={i * 80}>
              <WorkCard work={w} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
