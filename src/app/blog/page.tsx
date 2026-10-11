import type { Metadata } from "next";
import { BlogList } from "@/components/blog-list";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { getPosts, getTags } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Journal",
    description:
      "Practical notes on curtains, flooring, wallpapers and furnishing homes and businesses in Patna, from the New Ankur Furnishers team.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);

  return (
    <>
      <section className="container-site py-16 md:py-24">
        <p className="text-walnut">Journal</p>
        <h1 className="mt-3 max-w-[20ch] text-[clamp(2.6rem,5vw,4.5rem)]">
          Notes on furnishing a home you love.
        </h1>
        <p className="mt-6 max-w-[56ch] text-lg text-forest/75">
          Practical advice from four decades of measuring, supplying and fitting furnishings across
          Bihar — from choosing curtains for Patna summers to the right floor for a busy clinic.
        </p>

        <div className="mt-12">
          <BlogList posts={posts} tags={tags} />
        </div>
      </section>

      <EnquiryBanner />
    </>
  );
}
