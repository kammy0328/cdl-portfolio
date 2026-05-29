"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Work" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 라우트 변경 시 모바일 메뉴 닫기
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname.startsWith("/work");
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-ink-line bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="wrap flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-[0.3em] text-bone"
          aria-label="CDL home"
        >
          {site.name}
        </Link>

        {/* 데스크탑 메뉴 */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`font-mono text-sm font-medium uppercase tracking-[0.1em] transition-colors hover:text-bone ${
                  isActive(l.href) ? "text-bone" : "text-bone-dim"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 모바일 토글 */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-bone md:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="border-t border-ink-line md:hidden">
          <ul className="wrap flex flex-col py-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block py-3 font-mono text-base font-medium uppercase tracking-[0.1em] text-bone-dim transition hover:text-bone"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
