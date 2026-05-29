import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
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
    default: "CDL — Colorist",
    template: "%s · CDL",
  },
  description: site.description,
  keywords: [
    "색보정",
    "컬러리스트",
    "컬러그레이딩",
    "color grading",
    "colorist",
    "뮤직비디오 색보정",
    "원격 색보정",
    "CDL",
  ],
  openGraph: {
    title: "CDL — Colorist",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={mono.variable}>
      <body className="min-h-screen overflow-x-hidden">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
