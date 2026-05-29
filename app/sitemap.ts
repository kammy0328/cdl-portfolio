import type { MetadataRoute } from "next";
import { works } from "@/data/works";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const staticRoutes = ["", "/gallery", "/about", "/contact"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const workRoutes = works.map((w) => ({
    url: `${base}/work/${w.slug}`,
    lastModified: new Date(w.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));
  return [...staticRoutes, ...workRoutes];
}
