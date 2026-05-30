import type { MetadataRoute } from "next";
import { getWorks } from "@/lib/works";
import { site } from "@/lib/site";

// 1시간마다 재생성 (어드민으로 추가한 작업도 sitemap에 반영)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const works = await getWorks();

  const staticRoutes: MetadataRoute.Sitemap = ["", "/gallery", "/contact"].map(
    (p) => ({
      url: `${base}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })
  );

  const workRoutes: MetadataRoute.Sitemap = works.map((w) => {
    const d = new Date(w.publishedAt);
    return {
      url: `${base}/work/${w.slug}`,
      lastModified: Number.isNaN(d.getTime()) ? undefined : d,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...workRoutes];
}
