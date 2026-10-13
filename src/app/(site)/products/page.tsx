import type { Metadata } from "next";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { ProductFilter } from "@/components/product-filter";
import { getCategories, getElements } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Products",
    description:
      "Curtains, blinds, flooring, wallpapers, mattresses, rugs, furniture and more — everything New Ankur Furnishers supplies and fits, in one place.",
    path: "/products",
    image: "/images/brochure/curtains-sheer.webp",
  });
}

export default async function ProductsPage() {
  const [categories, elements] = await Promise.all([getCategories(), getElements()]);

  return (
    <>
      <section className="container-site py-16 md:py-24">
        <p className="text-walnut">What we do</p>
        <h1 className="mt-3 max-w-[20ch] text-[clamp(2.6rem,5vw,4.5rem)]">
          Everything your space needs.
        </h1>
        <p className="mt-6 max-w-[58ch] text-lg text-forest/75">
          Curtains, flooring, wallpaper, mattresses, rugs, furniture and more — every category
          measured, supplied and fitted by our own team. Filter by one of the five elements, or
          browse the full range.
        </p>

        <div className="mt-12">
          <ProductFilter
            categories={categories}
            elements={elements.map((e) => ({ slug: e.slug, name: e.name }))}
          />
        </div>
      </section>

      <EnquiryBanner />
    </>
  );
}
