"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

export type SectorInput = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  body: string;
  highlights: { title: string; text: string }[];
  image_url: string;
  image_alt: string;
  seo_title: string;
  seo_description: string;
  published: boolean;
};

export type SectorActionState = { status: "idle" | "success" | "error"; message?: string; id?: string };

export async function saveSector(input: SectorInput): Promise<SectorActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };

  const name = input.name.trim();
  if (!name) return { status: "error", message: "A sector name is required." };
  const slug = slugify(input.slug || input.name);
  if (!slug) return { status: "error", message: "Please provide a valid web address (slug)." };

  const dup = await supabase.from("sectors").select("id").eq("slug", slug).maybeSingle();
  if (dup.data && dup.data.id !== input.id) {
    return { status: "error", message: `The web address "${slug}" is already used by another sector.` };
  }

  const fields = {
    slug,
    name,
    tagline: input.tagline.trim() || null,
    summary: input.summary.trim() || null,
    body: input.body.trim() || null,
    highlights: input.highlights
      .map((h) => ({ title: h.title.trim(), text: h.text.trim() }))
      .filter((h) => h.title),
    image_url: input.image_url.trim() || null,
    image_alt: input.image_alt.trim() || null,
    published: input.published,
    seo_title: input.seo_title.trim() || null,
    seo_description: input.seo_description.trim() || null,
  };

  if (input.id) {
    const { error } = await supabase.from("sectors").update(fields).eq("id", input.id);
    if (error) return { status: "error", message: "Couldn't save the sector. Please try again." };
    finish();
    return { status: "success", message: "Saved. Live on the site now.", id: input.id };
  }

  const max = await supabase.from("sectors").select("sort").order("sort", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase
    .from("sectors")
    .insert({ ...fields, sort: (max.data?.sort ?? 0) + 1 })
    .select("id")
    .single();
  if (error || !data) return { status: "error", message: "Couldn't create the sector. Please try again." };
  finish();
  return { status: "success", message: "Saved. Live on the site now.", id: data.id };
}

export async function deleteSector(id: string): Promise<SectorActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  const { error } = await supabase.from("sectors").delete().eq("id", id);
  if (error) return { status: "error", message: "Couldn't delete. Please try again." };
  finish();
  return { status: "success", message: "Deleted." };
}

export async function setSectorPublished(id: string, published: boolean): Promise<SectorActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  const { error } = await supabase.from("sectors").update({ published }).eq("id", id);
  if (error) return { status: "error", message: "Couldn't update. Please try again." };
  finish();
  return { status: "success" };
}

export async function reorderSectors(orderedIds: string[]): Promise<SectorActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  await Promise.all(orderedIds.map((id, i) => supabase.from("sectors").update({ sort: i + 1 }).eq("id", id)));
  finish();
  return { status: "success" };
}

function finish() {
  updateTag("content");
  revalidatePath("/admin/expertise");
}
