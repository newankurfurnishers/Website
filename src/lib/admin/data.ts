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
