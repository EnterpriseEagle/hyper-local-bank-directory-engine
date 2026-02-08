import type { MetadataRoute } from "next";
import { getAllSuburbSlugs, getStateList } from "@/lib/data";

const BASE_URL = "https://banknearme.com.au";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, states] = await Promise.all([
    getAllSuburbSlugs(),
    getStateList(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${BASE_URL}/${s.stateSlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const suburbPages: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${BASE_URL}/${s.stateSlug}/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...statePages, ...suburbPages];
}
