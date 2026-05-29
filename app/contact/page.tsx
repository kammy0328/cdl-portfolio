import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "CDL 색보정 작업 문의.",
};

export default function ContactPage() {
  return (
    <div className="wrap pt-28 sm:pt-32">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">CONTACT</h1>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="space-y-6">
            <div>
              <div className="label">이메일</div>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-1 block text-lg text-bone"
              >
                {site.email}
              </a>
            </div>
            <div>
              <div className="label">인스타그램</div>
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

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
