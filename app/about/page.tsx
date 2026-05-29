import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

const steps = [
  {
    n: "01",
    title: "소스 전달",
    desc: "촬영 원본(또는 프록시)과 편집본을 온라인으로 전달받습니다. 카메라·코덱·해상도에 맞춰 안전하게 주고받습니다.",
  },
  {
    n: "02",
    title: "룩 설계 & 색보정",
    desc: "레퍼런스와 의도를 바탕으로 전체 톤앤매너를 잡고, 샷 단위로 노출·컬러·디테일을 다듬습니다.",
  },
  {
    n: "03",
    title: "리뷰 & 수정",
    desc: "원격으로 시안을 공유하고 피드백을 반영합니다. 합의된 룩이 나올 때까지 함께 맞춰갑니다.",
  },
  {
    n: "04",
    title: "최종 납품",
    desc: "원하는 포맷으로 최종 파일을 출력해 전달합니다. 플랫폼별 사양에 맞춰 안정적으로 납품합니다.",
  },
];

const services = [
  { title: "Music Video", desc: "아티스트의 무드와 콘셉트를 살리는 뮤직비디오 색보정." },
  { title: "Commercial", desc: "제품과 브랜드가 돋보이는 광고·CF 색보정." },
  { title: "Film", desc: "이야기의 정서를 담는 단편·필름 색보정." },
];

export default function AboutPage() {
  return (
    <div className="pt-28 sm:pt-32">
      {/* Intro */}
      <section className="wrap">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            원격으로 작업하는
            <br />
            컬러리스트, CDL
          </h1>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-8 grid max-w-4xl gap-6 text-base leading-relaxed text-bone-dim md:grid-cols-2">
            <p>
              CDL은 한국을 기반으로 활동하는 컬러리스트입니다. 별도의 오프라인
              작업실 방문 없이, 온라인으로 소스를 주고받아 색보정을 진행합니다.
              덕분에 지역과 일정에 구애받지 않고 어떤 팀과도 함께할 수 있습니다.
            </p>
            <p>
              색은 단순한 후반 작업이 아니라 장면의 온도와 감정을 결정하는
              과정이라고 믿습니다. 촬영의 의도를 존중하면서, 영상이 가진
              이야기를 한층 또렷하게 끌어올리는 것을 목표로 합니다.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Workflow */}
      <section className="wrap mt-24">
        <Reveal>
          <p className="eyebrow">Workflow</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            원격 작업 과정
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-ink-line bg-ink-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80} className="h-full">
              <div className="flex h-full flex-col bg-ink-card p-7">
                <span className="font-mono text-sm text-accent-warm">{s.n}</span>
                <h3 className="mt-4 text-lg font-medium">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-dim">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="wrap mt-24">
        <Reveal>
          <p className="eyebrow">Services</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            색보정 서비스
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="border-t border-ink-line pt-5">
                <h3 className="text-lg font-medium text-bone">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-dim">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="wrap mt-24">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-md border border-ink-line bg-ink-card px-8 py-16 text-center">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-accent-warm/10 blur-[100px]" />
              <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-accent-cool/10 blur-[100px]" />
            </div>
            <h2 className="relative text-2xl font-semibold tracking-tight sm:text-3xl">
              작업을 함께하고 싶으신가요?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-sm text-bone-dim">
              프로젝트의 일정과 분량, 원하는 톤을 알려주시면 빠르게 회신드립니다.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-sm bg-bone px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-accent-warm"
              >
                문의하기
              </Link>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-ink-line px-7 py-3.5 text-sm font-medium text-bone transition hover:border-bone-dim hover:bg-white/5"
              >
                Instagram @{site.instagram}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
