"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

export type CategoryInput = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  intro: string;
  body: string;
  subtypes: string[];
  element: string | null;
  sectors: string[];
  hero_image_url: string;
  hero_image_alt: string;
  images: { url: string; alt: string }[];
  seo_title: string;
  seo_description: string;
  published: boolean;
};

export type CategoryActionState = { status: "idle" | "success" | "error"; message?: string; id?: string };

export async function saveCategory(input: CategoryInput): Promise<CategoryActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };

  const name = input.name.trim();
  if (!name) return { status: "error", message: "A product name is required." };
  const slug = slugify(input.slug || input.name);
  if (!slug) return { status: "error", message: "Please provide a valid web address (slug)." };

  // Unique slug (excluding this record)
  const dup = await supabase.from("categories").select("id").eq("slug", slug).maybeSingle();
  if (dup.data && dup.data.id !== input.id) {
    return { status: "error", message: `The web address "${slug}" is already used by another product.` };
  }

  // Resolve element slug -> id
  let element_id: string | null = null;
  if (input.element) {
    const el = await supabase.from("elements").select("id").eq("slug", input.element).maybeSingle();
    element_id = el.data?.id ?? null;
  }

  const fields = {
    slug,
    name,
    tagline: input.tagline.trim() || null,
    icon: input.icon || null,
    intro: input.intro.trim() || null,
    body: input.body.trim() || null,
    subtypes: input.subtypes.map((s) => s.trim()).filter(Boolean),
    hero_image_url: input.hero_image_url.trim() || null,
    hero_image_alt: input.hero_image_alt.trim() || null,
    element_id,
    published: input.published,
    seo_title: input.seo_title.trim() || null,
    seo_description: input.seo_description.trim() || null,
  };

  let categoryId = input.id;
  if (categoryId) {
    const { error } = await supabase.from("categories").update(fields).eq("id", categoryId);
    if (error) return { status: "error", message: "Couldn't save the product. Please try again." };
  } else {
    const max = await supabase.from("categories").select("sort").order("sort", { ascending: false }).limit(1).maybeSingle();
    const { data, error } = await supabase
      .from("categories")
      .insert({ ...fields, sort: (max.data?.sort ?? 0) + 1 })
      .select("id")
      .single();
    if (error || !data) return { status: "error", message: "Couldn't create the product. Please try again." };
    categoryId = data.id;
  }

  // Replace sector links
  await supabase.from("category_sectors").delete().eq("category_id", categoryId);
  if (input.sectors.length) {
    const secs = await supabase.from("sectors").select("id,slug").in("slug", input.sectors);
    const rows = (secs.data ?? []).map((s) => ({ category_id: categoryId!, sector_id: s.id }));
    if (rows.length) await supabase.from("category_sectors").insert(rows);
  }

  // Replace gallery images
  await supabase.from("category_images").delete().eq("category_id", categoryId);
  const imgs = input.images
    .filter((im) => im.url.trim())
    .map((im, i) => ({ category_id: categoryId!, url: im.url.trim(), alt: im.alt.trim(), sort: i }));
  if (imgs.length) await supabase.from("category_images").insert(imgs);

  updateTag("content");
  revalidatePath("/admin/products");
  return { status: "success", message: "Saved. Live on the site now.", id: categoryId };
}

export async function deleteCategory(id: string): Promise<CategoryActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { status: "error", message: "Couldn't delete. Please try again." };
  updateTag("content");
  revalidatePath("/admin/products");
  return { status: "success", message: "Deleted." };
}

export async function setCategoryPublished(id: string, published: boolean): Promise<CategoryActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  const { error } = await supabase.from("categories").update({ published }).eq("id", id);
  if (error) return { status: "error", message: "Couldn't update. Please try again." };
  updateTag("content");
  revalidatePath("/admin/products");
  return { status: "success" };
}

export async function reorderCategories(orderedIds: string[]): Promise<CategoryActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  // Persist new sort order (1-based)
  await Promise.all(
    orderedIds.map((id, i) => supabase.from("categories").update({ sort: i + 1 }).eq("id", id)),
  );
  updateTag("content");
  revalidatePath("/admin/products");
  return { status: "success" };
}
