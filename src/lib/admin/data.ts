import "server-only";
import { createSessionClient } from "@/lib/supabase/server";

export type EnquiryStatus = "new" | "contacted" | "closed";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  interest: string | null;
  source_page: string | null;
  status: EnquiryStatus;
  notes: string | null;
  created_at: string;
};

const ENQUIRY_COLS = "id,name,phone,email,message,interest,source_page,status,notes,created_at";

export async function getDashboard() {
  const supabase = await createSessionClient();
  const [newCount, latest, draftCount] = await Promise.all([
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("enquiries").select(ENQUIRY_COLS).order("created_at", { ascending: false }).limit(5),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
  ]);
  return {
    newEnquiries: newCount.count ?? 0,
    latest: (latest.data ?? []) as Enquiry[],
    draftPosts: draftCount.count ?? 0,
  };
}

export async function getEnquiries(status?: EnquiryStatus): Promise<Enquiry[]> {
  const supabase = await createSessionClient();
  let q = supabase.from("enquiries").select(ENQUIRY_COLS).order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Enquiry[];
}

export async function getEnquiry(id: string): Promise<Enquiry | null> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("enquiries").select(ENQUIRY_COLS).eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Enquiry | null) ?? null;
}

export async function getSettingsRow() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}

// --- Products (categories) -------------------------------------------------

export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  icon: string | null;
  intro: string | null;
  body: string | null;
  subtypes: string[];
  hero_image_url: string | null;
  hero_image_alt: string | null;
  element: string | null; // element slug
  sectors: string[]; // sector slugs
  images: { url: string; alt: string }[];
  sort: number;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

type AdminCategoryRow = Omit<AdminCategory, "element" | "sectors" | "images"> & {
  elements: { slug: string } | null;
  category_sectors: { sectors: { slug: string } | null }[];
  category_images: { url: string; alt: string; sort: number }[];
};

const ADMIN_CATEGORY_SELECT =
  "id,slug,name,tagline,icon,intro,body,subtypes,hero_image_url,hero_image_alt,sort,published,seo_title,seo_description," +
  "elements(slug), category_sectors(sectors(slug)), category_images(url,alt,sort)";

function toAdminCategory(row: AdminCategoryRow): AdminCategory {
  const { elements, category_sectors, category_images, ...rest } = row;
  return {
    ...rest,
    element: elements?.slug ?? null,
    sectors: category_sectors.flatMap((cs) => (cs.sectors ? [cs.sectors.slug] : [])),
    images: [...category_images].sort((a, b) => a.sort - b.sort).map(({ url, alt }) => ({ url, alt })),
  };
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("categories").select(ADMIN_CATEGORY_SELECT).order("sort");
  if (error) throw error;
  return ((data ?? []) as unknown as AdminCategoryRow[]).map(toAdminCategory);
}

export async function getAdminCategory(id: string): Promise<AdminCategory | null> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("categories")
    .select(ADMIN_CATEGORY_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toAdminCategory(data as unknown as AdminCategoryRow) : null;
}

export async function getElementOptions(): Promise<{ slug: string; name: string }[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("elements").select("slug,name").order("sort");
  if (error) throw error;
  return (data ?? []) as { slug: string; name: string }[];
}

export async function getSectorOptions(): Promise<{ slug: string; name: string }[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("sectors").select("slug,name").order("sort");
  if (error) throw error;
  return (data ?? []) as { slug: string; name: string }[];
}

// --- Expertise (sectors) ---------------------------------------------------

export type Highlight = { title: string; text: string };

export type AdminSector = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  summary: string | null;
  body: string | null;
  highlights: Highlight[];
  image_url: string | null;
  image_alt: string | null;
  sort: number;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

const SECTOR_SELECT =
  "id,slug,name,tagline,summary,body,highlights,image_url,image_alt,sort,published,seo_title,seo_description";

export async function getAdminSectors(): Promise<AdminSector[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("sectors").select(SECTOR_SELECT).order("sort");
  if (error) throw error;
  return (data ?? []) as AdminSector[];
}

export async function getAdminSector(id: string): Promise<AdminSector | null> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("sectors").select(SECTOR_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as AdminSector | null) ?? null;
}

// --- Philosophy (elements) -------------------------------------------------

export type AdminElement = {
  id: string;
  slug: string;
  name: string;
  sanskrit: string | null;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
  sort: number;
  subtitle: string | null;
  lead: string | null;
  principle: string | null;
  in_design: string | null;
  story_label: string | null;
  story_text: string | null;
  visual_language: string | null;
};

const ELEMENT_SELECT =
  "id,slug,name,sanskrit,tagline,description,image_url,image_alt,sort," +
  "subtitle,lead,principle,in_design,story_label,story_text,visual_language";

export async function getAdminElements(): Promise<AdminElement[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("elements").select(ELEMENT_SELECT).order("sort");
  if (error) throw error;
  return (data ?? []) as unknown as AdminElement[];
}

export async function getAdminElement(id: string): Promise<AdminElement | null> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("elements").select(ELEMENT_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as unknown as AdminElement | null) ?? null;
}

// --- Pages (page_sections) -------------------------------------------------

export type AdminSection = {
  id: string;
  page: string;
  key: string;
  label: string;
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  image_url: string | null;
  image_alt: string | null;
  cta_label: string | null;
  cta_href: string | null;
  items: { title: string; text: string }[];
  sort: number;
  published: boolean;
};

const SECTION_SELECT =
  "id,page,key,label,eyebrow,heading,body,image_url,image_alt,cta_label,cta_href,items,sort,published";

export async function getAdminSections(): Promise<AdminSection[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("page_sections").select(SECTION_SELECT).order("page").order("sort");
  if (error) throw error;
  return (data ?? []) as AdminSection[];
}

export async function getAdminSection(id: string): Promise<AdminSection | null> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("page_sections").select(SECTION_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as AdminSection | null) ?? null;
}

// --- Media -----------------------------------------------------------------

export type MediaItem = {
  id: string;
  path: string;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  created_at: string;
};

export async function getMedia(): Promise<MediaItem[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("media")
    .select("id,path,url,alt,width,height,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MediaItem[];
}

// --- Blog (posts) ----------------------------------------------------------

export type AdminPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: "draft" | "published";
  published_at: string | null;
};

export type AdminPost = AdminPostSummary & {
  content_html: string;
  content_json: unknown;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  tags: string[]; // tag names
  categories: string[]; // category slugs
};

export async function getAdminPosts(): Promise<AdminPostSummary[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id,slug,title,excerpt,status,published_at")
    .order("published_at", { ascending: false, nullsFirst: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminPostSummary[];
}

type AdminPostRow = Omit<AdminPost, "tags" | "categories"> & {
  post_tags: { tags: { name: string } | null }[];
  post_categories: { categories: { slug: string } | null }[];
};

export async function getAdminPost(id: string): Promise<AdminPost | null> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id,slug,title,excerpt,content_html,content_json,cover_image_url,cover_image_alt,author,status,published_at,seo_title,seo_description,og_image_url," +
        "post_tags(tags(name)), post_categories(categories(slug))",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as AdminPostRow;
  const { post_tags, post_categories, ...rest } = row;
  return {
    ...rest,
    tags: post_tags.flatMap((pt) => (pt.tags ? [pt.tags.name] : [])),
    categories: post_categories.flatMap((pc) => (pc.categories ? [pc.categories.slug] : [])),
  };
}

export async function getAdminTags(): Promise<{ slug: string; name: string }[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("tags").select("slug,name").order("name");
  if (error) throw error;
  return (data ?? []) as { slug: string; name: string }[];
}

export async function getCategoryOptions(): Promise<{ slug: string; name: string }[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("categories").select("slug,name").order("sort");
  if (error) throw error;
  return (data ?? []) as { slug: string; name: string }[];
}
