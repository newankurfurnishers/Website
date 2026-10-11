"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostSummary, Tag } from "@/content/types";
import { formatDate } from "@/lib/format";

export function BlogList({ posts, tags }: { posts: PostSummary[]; tags: Tag[] }) {
  const [active, setActive] = useState("all");

  const usableTags = useMemo(() => {
    const used = new Set(posts.flatMap((p) => p.tags.map((t) => t.slug)));
    return tags.filter((t) => used.has(t.slug));
  }, [posts, tags]);

  const filtered = useMemo(
    () => (active === "all" ? posts : posts.filter((p) => p.tags.some((t) => t.slug === active))),
    [active, posts],
  );

  if (posts.length === 0) {
    return (
      <div className="rounded-[1.5rem] bg-sand/50 px-6 py-16 text-center">
        <p className="font-display text-2xl">No posts yet.</p>
        <p className="mt-2 text-forest/70">
          We&rsquo;re writing our first stories on furnishing homes and businesses in Patna. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      {usableTags.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts by tag">
          {[{ slug: "all", name: "All posts" }, ...usableTags].map((t) => {
            const on = active === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(t.slug)}
                className={`rounded-full px-4 py-2 text-[0.95rem] transition-colors ${
                  on
                    ? "bg-forest text-sand"
                    : "text-forest shadow-[inset_0_0_0_1px_rgba(41,45,40,0.25)] hover:bg-forest/5"
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      )}

      <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block">
              {p.cover_image_url && (
                <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-sand">
                  <Image
                    src={p.cover_image_url}
                    alt={p.cover_image_alt ?? ""}
                    fill
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <p className="mt-4 text-sm text-forest/60">{formatDate(p.published_at)}</p>
              <h2 className="mt-1 text-xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                {p.title}
              </h2>
              {p.excerpt && <p className="mt-2 text-forest/75">{p.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
