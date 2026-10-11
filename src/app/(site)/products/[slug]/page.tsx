import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { Gallery } from "@/components/gallery";
import { getCategories, getPosts, getSectors } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) return {};
  return pageMetadata({
    title: category.seo_title ?? category.name,
    description: category.seo_description ?? category.intro,
    path: `/products/${category.slug}`,
    image: category.hero_image_url,
    imageAlt: category.hero_image_alt,
  });
}

export default function CategoryPage({ params }: PageProps<"/products/[slug]">) {
  // Await params inside Suspense so the shell stays instant (Partial Prefetching).
  return (
    <Suspense fallback={<div className="min-h-[46svh] bg-forest" aria-hidden="true" />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const [categories, sectors, posts] = await Promise.all([getCategories(), getSectors(), getPosts()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const servedSectors = sectors.filter((s) => category.sectors.includes(s.slug));
  const relatedPosts = posts.filter((p) => p.categories.includes(category.slug)).slice(0, 3);

  return (
    <>
      <section className="bg-forest text-sand">
        <div className="grid lg:grid-cols-2">
          <div className="relative order-1 h-[46svh] overflow-hidden lg:order-2 lg:h-auto lg:min-h-[30rem]">
            <Image
              src={category.hero_image_url}
              alt={category.hero_image_alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-10 lg:order-1 lg:py-20 lg:pl-[max(2.5rem,calc((100vw-82rem)/2+2.5rem))] lg:pr-14">
            <nav aria-label="Breadcrumb" className="text-sand/60">
              <Link href="/products" className="link-underline">
                Products
              </Link>
            </nav>
            <h1 className="mt-3 text-[clamp(2.4rem,4.5vw,4rem)]">{category.name}</h1>
            <p className="mt-3 text-xl text-olive">{category.tagline}</p>
            <p className="mt-6 max-w-[46ch] text-lg text-sand/80">{category.intro}</p>
            <div className="mt-10">
              <Link href={`/contact?interest=${encodeURIComponent(category.name)}`} className="btn btn-solid">
                Enquire about {category.name.toLowerCase()}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {category.subtypes.length > 0 && (
        <section className="container-site py-16 md:py-20">
          <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)]">What&rsquo;s in the range</h2>
          <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {category.subtypes.map((t) => (
              <li key={t} className="flex items-baseline gap-3 border-b border-forest/12 py-3 text-lg">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-caramel" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {category.images.length > 0 && (
        <section className="container-site pb-16 md:pb-20">
          <h2 className="sr-only">Gallery</h2>
          <Gallery images={category.images} />
        </section>
      )}

      {servedSectors.length > 0 && (
        <section className="border-t border-forest/10">
          <div className="container-site py-16 md:py-20">
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)]">Where we fit it</h2>
            <ul className="mt-8 flex flex-wrap gap-3">
              {servedSectors.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/expertise/${s.slug}`}
                    className="inline-block rounded-full bg-sand px-5 py-2.5 text-forest transition-colors hover:bg-[#dcc4a8]"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section className="border-t border-forest/10">
          <div className="container-site py-16 md:py-20">
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)]">From the journal</h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((p) => (
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
                    <h3 className="mt-4 text-xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
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

      <EnquiryBanner interest={category.name} />
    </>
  );
}
