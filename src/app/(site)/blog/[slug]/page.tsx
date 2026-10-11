import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { getCategories, getPost, getPosts } from "@/lib/content";
import { formatDate, readingTime } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

// No generateStaticParams: there may be no published posts at build time, and
// Cache Components rejects an empty param list. Posts are rendered on request
// (getPost is cached), with a static shell while params resolve.

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.og_image_url ?? post.cover_image_url,
    imageAlt: post.cover_image_alt,
    type: "article",
  });
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="container-site py-24" aria-hidden="true" />}>
      <Article params={params} />
    </Suspense>
  );
}

async function Article({ params }: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;
  const [post, allPosts, categories] = await Promise.all([getPost(slug), getPosts(), getCategories()]);
  if (!post) notFound();

  const relatedCategories = categories.filter((c) => post.categories.includes(c.slug));
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.categories.some((c) => post.categories.includes(c)))
    .slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.newankurfurnishers.in";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at,
    author: { "@type": "Organization", name: post.author },
    image: post.cover_image_url ? `${siteUrl}${post.cover_image_url}` : undefined,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container-site py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-forest/60">
            <Link href="/blog" className="link-underline">
              Journal
            </Link>
          </nav>
          <h1 className="mt-4 text-[clamp(2.2rem,4.5vw,3.6rem)]">{post.title}</h1>
          <p className="mt-4 text-forest/60">
            {formatDate(post.published_at)} · {readingTime(post.content_html)} min read · {post.author}
          </p>
          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t.slug} className="rounded-full bg-sand px-3 py-1 text-sm text-forest">
                  {t.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {post.cover_image_url && (
          <div className="relative mx-auto mt-10 aspect-[16/9] max-w-4xl overflow-hidden rounded-[1.5rem] bg-sand">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt ?? ""}
              fill
              priority
              sizes="(min-width: 1024px) 56rem, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose-brand mx-auto mt-12 max-w-3xl"
          // content_html is sanitised when the post is saved in the admin.
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />

        {relatedCategories.length > 0 && (
          <div className="mx-auto mt-12 max-w-3xl border-t border-forest/12 pt-8">
            <p className="text-sm text-walnut">Related products</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {relatedCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="inline-block rounded-full bg-sand px-4 py-2 text-forest transition-colors hover:bg-[#dcc4a8]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="border-t border-forest/10">
          <div className="container-site py-16">
            <h2 className="text-[clamp(1.8rem,3.4vw,2.4rem)]">More from the journal</h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group block">
                    <h3 className="text-xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-forest/60">{formatDate(p.published_at)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <EnquiryBanner />
    </>
  );
}
