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
    default: "CDL — Colorist",
    template: "%s · CDL",
  },
  description: site.description,
  keywords: [
    "color grading",
    "colorist",
    "remote colorist",
    "music video color grading",
    "color grade",
    "DI",
    "CDL",
  ],
  openGraph: {
    title: "CDL — Colorist",
    description: site.description,
    url: site.url,
    siteName: "CDL",
    type: "website",
    locale: "en_US",
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
