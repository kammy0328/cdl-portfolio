import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "CDL에게 색보정 작업을 문의하세요.",
};

export default function ContactPage() {
  return (
    <div className="wrap pt-28 sm:pt-32">
      <div className="grid gap-14 lg:grid-cols-12">
        {/* 좌측 안내 */}
        <div className="lg:col-span-5">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            함께 작업해요
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-bone-dim">
            뮤직비디오, 광고, 필름 — 색보정이 필요한 프로젝트가 있다면 편하게
            연락주세요. 원격으로 어디서든 함께할 수 있습니다.
          </p>

          <div className="mt-10 space-y-6">
            <div>
              <div className="label">Email</div>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-1 block text-lg text-bone"
              >
                {site.email}
              </a>
            </div>
            <div>
              <div className="label">Instagram</div>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-1 block text-lg text-bone"
              >
                @{site.instagram}
              </a>
            </div>
          </div>
        </div>

        {/* 우측 폼 */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
