import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "CDL — 색보정 컬러리스트 (Colorist)",
    template: "%s · CDL",
  },
  description: site.description,
  keywords: [
    "CDL",
    "CDL 색보정",
    "CDL 컬러리스트",
    "색보정",
    "컬러리스트",
    "뮤비 색보정",
    "뮤직비디오 색보정",
    "영화 색보정",
    "단편영화 색보정",
    "color grading",
    "colorist",
    "remote colorist",
    "music video color grading",
  ],
  openGraph: {
    title: "CDL — 색보정 컬러리스트 (Colorist)",
    description: site.description,
    url: site.url,
    siteName: "CDL",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CDL — Colorist",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="min-h-screen overflow-x-hidden">
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
