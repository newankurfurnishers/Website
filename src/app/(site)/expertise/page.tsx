import type { Metadata } from "next";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { ExpertiseReveal } from "@/components/expertise-reveal";
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

        <div className="mt-16">
          <ExpertiseReveal sectors={sectors} />
        </div>
      </section>

      <EnquiryBanner />
    </>
  );
}
