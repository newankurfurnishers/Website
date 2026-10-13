import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { getCategories, getSectors } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/expertise/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const sector = (await getSectors()).find((s) => s.slug === slug);
  if (!sector) return {};
  return pageMetadata({
    title: sector.seo_title ?? (/furnish/i.test(sector.name) ? sector.name : `${sector.name} furnishings`),
    description: sector.seo_description ?? sector.summary,
    path: `/expertise/${sector.slug}`,
    image: sector.image_url,
    imageAlt: sector.image_alt,
  });
}

export default function SectorPage({ params }: PageProps<"/expertise/[slug]">) {
  // Await params inside Suspense so the shell stays instant (Partial Prefetching).
  return (
    <Suspense fallback={<div className="min-h-[46svh] bg-forest" aria-hidden="true" />}>
      <SectorContent params={params} />
    </Suspense>
  );
}

async function SectorContent({ params }: Pick<PageProps<"/expertise/[slug]">, "params">) {
  const { slug } = await params;
  const [sectors, categories] = await Promise.all([getSectors(), getCategories()]);
  const sector = sectors.find((s) => s.slug === slug);
  if (!sector) notFound();

  const related = categories.filter((c) => c.sectors.includes(sector.slug));

  return (
    <>
      <section className="bg-forest text-sand">
        <div className="grid lg:grid-cols-2">
          <div className="relative order-1 h-[46svh] overflow-hidden lg:order-2 lg:h-auto lg:min-h-[32rem]">
            <Image
              src={sector.image_url}
              alt={sector.image_alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-10 lg:order-1 lg:py-20 lg:pl-[max(2.5rem,calc((100vw-82rem)/2+2.5rem))] lg:pr-14">
            <p className="text-olive">Expertise &amp; domains</p>
            <h1 className="mt-3 text-[clamp(2.4rem,4.5vw,4rem)]">{sector.name}</h1>
            <p className="mt-4 text-xl text-sand/90">{sector.tagline}</p>
            {sector.summary && <p className="mt-6 max-w-[44ch] text-lg text-sand/75">{sector.summary}</p>}
            <div className="mt-10">
              <Link href={`/contact?interest=${encodeURIComponent(sector.name)}`} className="btn btn-solid">
                Enquire about {sector.name.toLowerCase()}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {sector.body && (
        <section className="container-site py-16 md:py-20">
          <p className="max-w-[60ch] text-lg text-forest/80">{sector.body}</p>
        </section>
      )}

      {sector.highlights.length > 0 && (
        <section className="container-site py-16 md:py-24">
          <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)]">What we furnish here</h2>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {sector.highlights.map((h) => (
              <li key={h.title} className="border-t border-forest/15 pt-5">
                <h3 className="text-xl">{h.title}</h3>
                {h.text && <p className="mt-2 text-forest/75">{h.text}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-forest/10">
          <div className="container-site py-16 md:py-20">
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)]">Products for this sector</h2>
            <ul className="mt-8 flex flex-wrap gap-3">
              {related.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="inline-block rounded-full bg-sand px-5 py-2.5 text-forest transition-colors hover:bg-[#dcc4a8]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <EnquiryBanner interest={sector.name} />
    </>
  );
}
