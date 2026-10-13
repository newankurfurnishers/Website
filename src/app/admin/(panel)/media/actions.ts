"use server";

import { revalidatePath, updateTag } from "next/cache";
import { runMediaCleanup } from "@/lib/admin/media-cleanup";
import { getAdminClient } from "@/lib/supabase/admin";

export type MediaActionState = { status: "idle" | "success" | "error"; message?: string; usage?: string[] };

/** Find where an image URL is used across the site's content. */
export async function findMediaUsage(url: string): Promise<string[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const uses: string[] = [];

  const [cats, catImgs, secs, els, sections, postsCover, postsOg] = await Promise.all([
    supabase.from("categories").select("name").eq("hero_image_url", url),
    supabase.from("category_images").select("categories(name)").eq("url", url),
    supabase.from("sectors").select("name").eq("image_url", url),
    supabase.from("elements").select("name").eq("image_url", url),
    supabase.from("page_sections").select("label").eq("image_url", url),
    supabase.from("posts").select("title").eq("cover_image_url", url),
    supabase.from("posts").select("title").eq("og_image_url", url),
  ]);

  for (const r of cats.data ?? []) uses.push(`Product hero: ${r.name}`);
  for (const r of catImgs.data ?? []) {
    const rel = (r as { categories: { name: string } | { name: string }[] | null }).categories;
    const name = Array.isArray(rel) ? rel[0]?.name : rel?.name;
    uses.push(`Product gallery${name ? `: ${name}` : ""}`);
  }
  for (const r of secs.data ?? []) uses.push(`Sector: ${r.name}`);
  for (const r of els.data ?? []) uses.push(`Element: ${r.name}`);
  for (const r of sections.data ?? []) uses.push(`Page section: ${r.label}`);
  for (const r of postsCover.data ?? []) uses.push(`Post cover: ${r.title}`);
  for (const r of postsOg.data ?? []) uses.push(`Post share image: ${r.title}`);
  return uses;
}

export async function updateMediaAlt(id: string, alt: string): Promise<MediaActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  const { error } = await supabase.from("media").update({ alt: alt.trim() }).eq("id", id);
  if (error) return { status: "error", message: "Couldn't save." };
  revalidatePath("/admin/media");
  return { status: "success" };
}

/**
 * Delete every uploaded file that is no longer referenced anywhere on the site
 * (e.g. images left behind when a hero/gallery/section image was replaced).
 * Files uploaded in the last hour are left alone so a fresh library upload that
 * hasn't been placed on a page yet is not swept away.
 */
export async function cleanupUnusedMedia(): Promise<MediaActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  const removed = await runMediaCleanup(supabase, 1);
  updateTag("content");
  revalidatePath("/admin/media");
  return {
    status: "success",
    message: removed > 0 ? `Freed ${removed} unused file${removed === 1 ? "" : "s"}.` : "No unused files to remove.",
  };
}

export async function deleteMedia(id: string, path: string, url: string): Promise<MediaActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };

  const usage = await findMediaUsage(url);
  if (usage.length > 0) {
    return { status: "error", message: "This image is still in use. Remove it from these first:", usage };
  }

  await supabase.storage.from("media").remove([path]);
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return { status: "error", message: "Couldn't delete. Please try again." };
  updateTag("content");
  revalidatePath("/admin/media");
  return { status: "success" };
}
