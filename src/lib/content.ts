// Public content reads. Every function is cached and tagged "content";
// admin saves call revalidateTag("content", "max") so edits go live in seconds.
import { cacheLife, cacheTag } from "next/cache";
import * as seed from "@/content/seed";
import type {
  Category,
  ElementSlug,
  NatureElement,
  PageSection,
  Sector,
  SiteSettings,
} from "@/content/types";
import { hasSupabase } from "./supabase/env";
import { createPublicClient } from "./supabase/public";

export const CONTENT_TAG = "content";

function tagged() {
  cacheTag(CONTENT_TAG);
  cacheLife("max");
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  tagged();
  if (!hasSupabase) return seed.settings;
  const { data, error } = await createPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return (data as SiteSettings | null) ?? seed.settings;
}

export async function getSections(page: string): Promise<Record<string, PageSection>> {
  "use cache";
  tagged();
  const rows: PageSection[] = hasSupabase
    ? await (async () => {
        const { data, error } = await createPublicClient()
          .from("page_sections")
          .select("page,key,label,eyebrow,heading,body,image_url,image_alt,cta_label,cta_href,items,sort")
          .eq("page", page)
          .order("sort");
        if (error) throw error;
        return (data ?? []) as PageSection[];
      })()
    : seed.sections.filter((s) => s.page === page);
  return Object.fromEntries(rows.map((s) => [s.key, s]));
}

export async function getElements(): Promise<NatureElement[]> {
  "use cache";
  tagged();
  if (!hasSupabase) return seed.elements;
  const { data, error } = await createPublicClient()
    .from("elements")
    .select("slug,name,sanskrit,tagline,description,image_url,image_alt,sort")
    .order("sort");
  if (error) throw error;
  return (data ?? []) as NatureElement[];
}

export async function getSectors(): Promise<Sector[]> {
  "use cache";
  tagged();
  if (!hasSupabase) return seed.sectors;
  const { data, error } = await createPublicClient()
    .from("sectors")
    .select("slug,name,tagline,summary,body,highlights,image_url,image_alt,sort,seo_title,seo_description")
    .order("sort");
  if (error) throw error;
  return (data ?? []) as Sector[];
}

type CategoryRow = Omit<Category, "element" | "sectors" | "images"> & {
  elements: { slug: ElementSlug } | null;
  category_sectors: { sectors: { slug: string } | null }[];
  category_images: { url: string; alt: string; sort: number }[];
};

export async function getCategories(): Promise<Category[]> {
  "use cache";
  tagged();
  if (!hasSupabase) return seed.categories;
  const { data, error } = await createPublicClient()
    .from("categories")
    .select(
      "slug,name,tagline,icon,intro,body,subtypes,hero_image_url,hero_image_alt,sort,seo_title,seo_description," +
        "elements(slug), category_sectors(sectors(slug)), category_images(url,alt,sort)",
    )
    .order("sort");
  if (error) throw error;
  return ((data ?? []) as unknown as CategoryRow[]).map(
    ({ elements, category_sectors, category_images, ...rest }) => ({
      ...rest,
      element: elements?.slug ?? null,
      sectors: category_sectors.flatMap((cs) => (cs.sectors ? [cs.sectors.slug] : [])),
      images: [...category_images].sort((a, b) => a.sort - b.sort).map(({ url, alt }) => ({ url, alt })),
    }),
  );
}

export async function getCategory(slug: string): Promise<Category | null> {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}
