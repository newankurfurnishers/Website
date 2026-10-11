"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ImagePicker, type Img } from "@/components/admin/image-uploader";
import { RichText } from "@/components/admin/rich-text";
import { type SaveState, SaveMessage } from "@/components/admin/ui";
import type { AdminPost } from "@/lib/admin/data";
import { slugify } from "@/lib/slug";
import { deletePost, type PostInput, savePost } from "./actions";

type Option = { slug: string; name: string };

export function PostEditor({
  post,
  tagOptions,
  categoryOptions,
}: {
  post: AdminPost | null;
  tagOptions: Option[];
  categoryOptions: Option[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<SaveState>({ status: "idle" });

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [author, setAuthor] = useState(post?.author ?? "New Ankur Furnishers");
  const [cover, setCover] = useState<Img>({ url: post?.cover_image_url ?? "", alt: post?.cover_image_alt ?? "" });
  const [ogImage, setOgImage] = useState<Img>({ url: post?.og_image_url ?? "", alt: "" });
  const [tagsText, setTagsText] = useState((post?.tags ?? []).join(", "));
  const [categories, setCategories] = useState<string[]>(post?.categories ?? []);
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [scheduledAt, setScheduledAt] = useState("");

  const content = useRef<{ html: string; json: unknown }>({
    html: post?.content_html ?? "",
    json: post?.content_json ?? null,
  });

  const effectiveSlug = slugEdited ? slug : slugify(title);

  const build = (status: "draft" | "published", published_at: string | null): PostInput => ({
    id: post?.id,
    slug: effectiveSlug,
    title,
    excerpt,
    cover_image_url: cover.url,
    cover_image_alt: cover.alt,
    author,
    content_html: content.current.html,
    content_json: content.current.json,
    status,
    published_at,
    seo_title: seoTitle,
    seo_description: seoDescription,
    og_image_url: ogImage.url,
    tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
    categories,
  });

  const run = (input: PostInput) => {
    startTransition(async () => {
      const res = await savePost(input);
      setState(res);
      if (res.status === "success") {
        router.push("/admin/blog");
        router.refresh();
      }
    });
  };

  const saveDraft = () => run(build("draft", post?.published_at ?? null));
  const publishNow = () => run(build("published", new Date().toISOString()));
  const schedule = () => {
    if (!scheduledAt) {
      setState({ status: "error", message: "Pick a date and time to schedule." });
      return;
    }
    run(build("published", new Date(scheduledAt).toISOString()));
  };

  const remove = () => {
    if (!post || !confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deletePost(post.id);
      if (res.status === "success") {
        router.push("/admin/blog");
        router.refresh();
      } else setState(res);
    });
  };

  const addTag = (name: string) => {
    const current = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
    if (!current.includes(name)) setTagsText([...current, name].join(", "));
  };

  return (
    <div className="grid gap-6">
      <Card title="Post">
        <Labeled label="Title">
          <input value={title} onChange={(e) => { setTitle(e.target.value); if (!slugEdited) setSlug(slugify(e.target.value)); }} className="admin-input" />
        </Labeled>
        <Labeled label="Web address (slug)" hint={`newankurfurnishers.in/blog/${effectiveSlug || "…"}`}>
          <input value={effectiveSlug} onChange={(e) => { setSlugEdited(true); setSlug(slugify(e.target.value)); }} className="admin-input" />
        </Labeled>
        <Labeled label="Excerpt" hint="A one or two line summary shown on the blog index.">
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="admin-input" />
        </Labeled>
        <Labeled label="Author">
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="admin-input" />
        </Labeled>
      </Card>

      <Card title="Content">
        <RichText
          initialHtml={post?.content_html ?? ""}
          initialJson={post?.content_json ?? null}
          onChange={(html, json) => {
            content.current = { html, json };
          }}
        />
      </Card>

      <Card title="Cover image">
        <ImagePicker value={cover} onChange={setCover} />
      </Card>

      <Card title="Tags">
        <Labeled label="Tags" hint="Separate with commas. New tags are created automatically.">
          <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="admin-input" />
        </Labeled>
        {tagOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((t) => (
              <button key={t.slug} type="button" onClick={() => addTag(t.name)} className="rounded-full bg-sand px-3 py-1 text-sm hover:bg-[#dcc4a8]">
                + {t.name}
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card title="Related products">
        <div className="grid gap-2 sm:grid-cols-2">
          {categoryOptions.map((o) => (
            <label key={o.slug} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={categories.includes(o.slug)}
                onChange={(e) => setCategories((prev) => (e.target.checked ? [...prev, o.slug] : prev.filter((s) => s !== o.slug)))}
                className="size-4"
              />
              {o.name}
            </label>
          ))}
        </div>
      </Card>

      <Card title="SEO & sharing">
        <Labeled label="Page title" hint="Leave blank to use the post title.">
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Meta description">
          <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} className="admin-input" />
        </Labeled>
        <div>
          <p className="text-sm font-medium">How it looks in Google</p>
          <div className="mt-2 rounded-lg border border-forest/15 bg-white p-4">
            <p className="truncate text-xs text-[#4d5156]">newankurfurnishers.in › blog › {effectiveSlug || "…"}</p>
            <p className="truncate text-lg text-[#1a0dab]">{seoTitle || title || "Post title"}</p>
            <p className="line-clamp-2 text-sm text-[#4d5156]">{seoDescription || excerpt || "Your meta description will appear here."}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Share image (optional)</p>
          <p className="text-xs text-forest/55">Used when the post is shared on social media. Defaults to the cover image.</p>
          <div className="mt-1.5">
            <ImagePicker value={ogImage} onChange={setOgImage} />
          </div>
        </div>
      </Card>

      <SaveMessage state={state} />

      <Card title="Publish">
        {post && (
          <p className="text-sm text-forest/60">
            Current status: <strong>{post.status}</strong>
            {post.published_at ? ` · ${new Date(post.published_at).toLocaleString("en-IN")}` : ""}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={saveDraft} disabled={pending} className="btn btn-line text-forest disabled:opacity-60">
            Save draft
          </button>
          <button type="button" onClick={publishNow} disabled={pending} className="btn btn-dark disabled:opacity-60">
            {pending ? "Saving…" : "Publish now"}
          </button>
        </div>
        <div className="flex flex-wrap items-end gap-3 border-t border-forest/10 pt-4">
          <label className="block">
            <span className="block text-sm font-medium">Schedule for later</span>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="admin-input mt-1.5" />
          </label>
          <button type="button" onClick={schedule} disabled={pending} className="btn btn-line text-forest disabled:opacity-60">
            Schedule
          </button>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.push("/admin/blog")} className="btn btn-line text-forest">
          Cancel
        </button>
        {post && (
          <button type="button" onClick={remove} disabled={pending} className="ml-auto text-sm text-walnut hover:underline">
            Delete post
          </button>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 rounded-xl bg-white p-6">
      <h2 className="text-lg">{title}</h2>
      {children}
    </section>
  );
}

function Labeled({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-forest/55">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
