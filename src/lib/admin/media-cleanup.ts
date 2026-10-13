import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Every image URL referenced by site content. */
async function referencedUrls(sb: SupabaseClient): Promise<Set<string>> {
  const [cats, catImgs, secs, els, sections, posts] = await Promise.all([
    sb.from("categories").select("hero_image_url"),
    sb.from("category_images").select("url"),
    sb.from("sectors").select("image_url"),
    sb.from("elements").select("image_url"),
    sb.from("page_sections").select("image_url"),
    sb.from("posts").select("cover_image_url,og_image_url"),
  ]);
  const used = new Set<string>();
  const add = (v: unknown) => {
    if (typeof v === "string" && v) used.add(v);
  };
  for (const r of cats.data ?? []) add((r as { hero_image_url?: string }).hero_image_url);
  for (const r of catImgs.data ?? []) add((r as { url?: string }).url);
  for (const r of secs.data ?? []) add((r as { image_url?: string }).image_url);
  for (const r of els.data ?? []) add((r as { image_url?: string }).image_url);
  for (const r of sections.data ?? []) add((r as { image_url?: string }).image_url);
  for (const r of posts.data ?? []) {
    add((r as { cover_image_url?: string }).cover_image_url);
    add((r as { og_image_url?: string }).og_image_url);
  }
  return used;
}

/**
 * Delete uploaded media (storage object + media row) that is not referenced by
 * any content. `graceHours` protects recently uploaded files (e.g. library
 * uploads not yet placed on a page). Returns how many files were removed.
 */
export async function runMediaCleanup(sb: SupabaseClient, graceHours = 0): Promise<number> {
  const used = await referencedUrls(sb);
  const { data, error } = await sb.from("media").select("id,path,url,created_at");
  if (error || !data) return 0;

  const cutoff = Date.now() - graceHours * 3_600_000;
  const unused = (data as { id: string; path: string; url: string; created_at: string }[]).filter(
    (m) => !used.has(m.url) && new Date(m.created_at).getTime() < cutoff,
  );
  if (unused.length === 0) return 0;

  await sb.storage.from("media").remove(unused.map((m) => m.path));
  const { error: delErr } = await sb.from("media").delete().in(
    "id",
    unused.map((m) => m.id),
  );
  if (delErr) return 0;
  return unused.length;
}
