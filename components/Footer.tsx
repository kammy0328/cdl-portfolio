import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-ink-line">
      <div className="wrap grid gap-10 py-16 md:grid-cols-3">
        <div>
          <div className="text-lg font-bold tracking-[0.3em] text-bone">
            {site.name}
          </div>
          <p className="label mt-3">Colorist · Remote · Korea</p>
        </div>

        <div>
          <div className="label mb-4">Menu</div>
          <ul className="space-y-2 text-sm text-bone-dim">
            <li>
              <Link href="/" className="link-underline hover:text-bone">
                Work
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="link-underline hover:text-bone">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link-underline hover:text-bone">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="label mb-4">Contact</div>
          <ul className="space-y-2 text-sm text-bone-dim">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="link-underline hover:text-bone"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-bone"
              >
                Instagram @{site.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap flex flex-col items-center justify-between gap-2 border-t border-ink-line py-6 sm:flex-row">
        <span className="label">© {site.name} · Color Grading</span>
        <span className="label">Remote Colorist · Korea</span>
      </div>
    </footer>
  );
}
