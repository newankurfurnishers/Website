"use server";

import { revalidatePath, updateTag } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { getAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

export type PostInput = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  cover_image_alt: string;
  author: string;
  content_html: string;
  content_json: unknown;
  status: "draft" | "published";
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  og_image_url: string;
  tags: string[];
  categories: string[];
};

export type PostActionState = { status: "idle" | "success" | "error"; message?: string; id?: string };

function clean(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "h4", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "br", "img", "code", "pre", "hr"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}

export async function savePost(input: PostInput): Promise<PostActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };

  const title = input.title.trim();
  if (!title) return { status: "error", message: "A title is required." };
  const slug = slugify(input.slug || input.title);
  if (!slug) return { status: "error", message: "Please provide a valid web address (slug)." };

  const dup = await supabase.from("posts").select("id").eq("slug", slug).maybeSingle();
  if (dup.data && dup.data.id !== input.id) {
    return { status: "error", message: `The web address "${slug}" is already used by another post.` };
  }

  const fields = {
    slug,
    title,
    excerpt: input.excerpt.trim() || null,
    content_html: clean(input.content_html),
    content_json: input.content_json ?? null,
    cover_image_url: input.cover_image_url.trim() || null,
    cover_image_alt: input.cover_image_alt.trim() || null,
    author: input.author.trim() || "New Ankur Furnishers",
    status: input.status,
    published_at: input.published_at,
    seo_title: input.seo_title.trim() || null,
    seo_description: input.seo_description.trim() || null,
    og_image_url: input.og_image_url.trim() || null,
  };

  let postId = input.id;
  if (postId) {
    const { error } = await supabase.from("posts").update(fields).eq("id", postId);
    if (error) return { status: "error", message: "Couldn't save the post. Please try again." };
  } else {
    const { data, error } = await supabase.from("posts").insert(fields).select("id").single();
    if (error || !data) return { status: "error", message: "Couldn't create the post. Please try again." };
    postId = data.id;
  }

  // Tags (create any that don't exist)
  await supabase.from("post_tags").delete().eq("post_id", postId);
  const tagRows = input.tags.map((n) => ({ slug: slugify(n), name: n.trim() })).filter((t) => t.slug);
  if (tagRows.length) {
    await supabase.from("tags").upsert(tagRows, { onConflict: "slug", ignoreDuplicates: true });
    const existing = await supabase.from("tags").select("id").in("slug", tagRows.map((t) => t.slug));
    const links = (existing.data ?? []).map((t) => ({ post_id: postId!, tag_id: t.id }));
    if (links.length) await supabase.from("post_tags").insert(links);
  }

  // Related categories
  await supabase.from("post_categories").delete().eq("post_id", postId);
  if (input.categories.length) {
    const cats = await supabase.from("categories").select("id").in("slug", input.categories);
    const links = (cats.data ?? []).map((c) => ({ post_id: postId!, category_id: c.id }));
    if (links.length) await supabase.from("post_categories").insert(links);
  }

  updateTag("content");
  revalidatePath("/admin/blog");
  return { status: "success", message: "Saved.", id: postId };
}

export async function deletePost(id: string): Promise<PostActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { status: "error", message: "Couldn't delete. Please try again." };
  updateTag("content");
  revalidatePath("/admin/blog");
  return { status: "success", message: "Deleted." };
}
