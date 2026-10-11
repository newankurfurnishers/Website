import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { getSectors } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Expertise & domains",
    description:
      "From cosy homes to busy hospitals, hotels, schools and offices — the same furnishing care from New Ankur Furnishers, scaled to the space.",
    path: "/expertise",
    image: "/images/brochure/sector-hospitality.webp",
  });
}

export default async function ExpertisePage() {
  const sectors = await getSectors();

  return (
    <>
      <section className="container-site py-16 md:py-24">
        <p className="text-walnut">Expertise &amp; domains</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.6rem,5vw,4.5rem)]">
          From cosy homes to busy hospitals.
        </h1>
        <p className="mt-6 max-w-[56ch] text-lg text-forest/75">
          For over forty years we have furnished every kind of space in Patna and across Bihar —
          measuring, supplying and installing with the same care, whether it is a single bedroom or
          an entire hospital wing.
        </p>

        <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sec) => (
            <li key={sec.slug}>
              <Link href={`/expertise/${sec.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[11rem] bg-sand">
                  <Image
                    src={sec.image_url}
                    alt={sec.image_alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                  />
                </div>
                <h2 className="mt-5 text-2xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                  {sec.name}
                </h2>
                <p className="mt-1 text-forest/70">{sec.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <EnquiryBanner />
    </>
  );
}
