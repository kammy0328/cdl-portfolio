import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with CDL for color grading work.",
};

export default function ContactPage() {
  return (
    <div className="wrap pt-28 sm:pt-32">
      <div className="grid gap-14 lg:grid-cols-12">
        {/* 좌측 안내 */}
        <div className="lg:col-span-5">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s work together
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-bone-dim">
            Have a project that needs color — music video, commercial, or
            film? I work remotely, wherever you are. Drop a line below.
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
