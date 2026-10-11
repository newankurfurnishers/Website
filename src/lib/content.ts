// Public content reads. Every function is cached and tagged "content";
// admin saves call revalidateTag("content", "max") so edits go live in seconds.
import { cacheLife, cacheTag } from "next/cache";
import * as seed from "@/content/seed";
import type {
  Category,
  ElementSlug,
  NatureElement,
  PageSection,
  Post,
  PostSummary,
  Sector,
  SiteSettings,
  Tag,
  Testimonial,
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

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  tagged();
  if (!hasSupabase) return seed.testimonials;
  const { data, error } = await createPublicClient()
    .from("testimonials")
    .select("name,context,quote,sort")
    .order("sort");
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

type PostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  content_html: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author: string;
  published_at: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  post_tags: { tags: Tag | null }[];
  post_categories: { categories: { slug: string } | null }[];
};

const POST_SELECT =
  "slug,title,excerpt,content_html,cover_image_url,cover_image_alt,author,published_at," +
  "seo_title,seo_description,og_image_url,post_tags(tags(slug,name)),post_categories(categories(slug))";

function toPost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content_html: row.content_html,
    cover_image_url: row.cover_image_url,
    cover_image_alt: row.cover_image_alt,
    author: row.author,
    published_at: row.published_at,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    og_image_url: row.og_image_url,
    tags: row.post_tags.flatMap((pt) => (pt.tags ? [pt.tags] : [])),
    categories: row.post_categories.flatMap((pc) => (pc.categories ? [pc.categories.slug] : [])),
  };
}

export async function getPosts(): Promise<PostSummary[]> {
  "use cache";
  tagged();
  if (!hasSupabase) return [];
  // RLS already restricts anon reads to published posts with published_at <= now(),
  // so no request-time clock is needed here (which keeps this cacheable).
  const { data, error } = await createPublicClient()
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as PostRow[]).map(toPost);
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  tagged();
  if (!hasSupabase) return null;
  const { data, error } = await createPublicClient()
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? toPost(data as unknown as PostRow) : null;
}

export async function getTags(): Promise<Tag[]> {
  "use cache";
  tagged();
  if (!hasSupabase) return [];
  const { data, error } = await createPublicClient().from("tags").select("slug,name").order("name");
  if (error) throw error;
  return (data ?? []) as Tag[];
}
