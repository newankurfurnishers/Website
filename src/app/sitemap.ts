import type { MetadataRoute } from "next";
import { getCategories, getPosts, getSectors } from "@/lib/content";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.newankurfurnishers.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, sectors, posts] = await Promise.all([getCategories(), getSectors(), getPosts()]);

  const staticPaths = ["", "/philosophy", "/expertise", "/products", "/blog", "/about", "/contact"];

  return [
    ...staticPaths.map((p) => ({
      url: `${SITE}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...sectors.map((s) => ({
      url: `${SITE}/expertise/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...categories.map((c) => ({
      url: `${SITE}/products/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: p.published_at,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
