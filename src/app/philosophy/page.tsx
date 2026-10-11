import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { getCategories, getElements, getSections } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Our philosophy",
    description:
      "Earth, water, fire, air and space. New Ankur Furnishers furnishes each of the five elements so a whole home feels in balance.",
    path: "/philosophy",
    image: "/images/brochure/art-decor-lounge.webp",
  });
}

export default async function PhilosophyPage() {
  const [elements, categories, sections] = await Promise.all([
    getElements(),
    getCategories(),
    getSections("philosophy"),
  ]);
  const intro = sections.intro;

  return (
    <>
      <section className="bg-forest text-sand">
        <div className="container-site py-20 md:py-28">
          <p className="text-olive">{intro?.eyebrow ?? "Our philosophy"}</p>
          <h1 className="mt-3 max-w-[20ch] text-[clamp(2.6rem,5vw,4.5rem)]">
            {intro?.heading ?? "Every home is made of five elements."}
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg text-sand/80">
            {intro?.body ??
              "Earth, water, fire, air and space. We furnish each one — what holds you, what restores you, what warms you, what lets you breathe and what surrounds you — so the whole house feels in balance."}
          </p>
          <nav aria-label="The five elements" className="mt-10 flex flex-wrap gap-3">
            {elements.map((el) => (
              <a
                key={el.slug}
                href={`#${el.slug}`}
                className="rounded-full px-4 py-2 text-sand/85 shadow-[inset_0_0_0_1px_var(--color-olive)] transition-colors hover:bg-olive/15"
              >
                {el.name}
                <span className="text-sand/50"> · {el.sanskrit}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {elements.map((el, i) => {
        const inElement = categories.filter((c) => c.element === el.slug);
        return (
          <section
            key={el.slug}
            id={el.slug}
            className="scroll-mt-24 border-b border-forest/10 last:border-b-0"
          >
            <div className="container-site grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
              <div className={`relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand ${i % 2 ? "md:order-2" : ""}`}>
                <Image
                  src={el.image_url}
                  alt={el.image_alt}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute bottom-6 left-1/2 block -translate-x-1/2 rotate-180 font-display text-xl text-sand drop-shadow [writing-mode:vertical-rl]">
                  {el.name}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-forest/70 to-transparent" />
              </div>
              <div>
                <p className="font-display text-olive">{el.sanskrit}</p>
                <h2 className="mt-1 text-[clamp(2rem,4vw,3.2rem)]">
                  {el.name} — {el.tagline.toLowerCase()}
                </h2>
                <p className="mt-5 max-w-[46ch] text-lg text-forest/80">{el.description}</p>
                {inElement.length > 0 && (
                  <>
                    <p className="mt-8 text-sm text-walnut">In this element</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {inElement.map((c) => (
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
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <EnquiryBanner />
    </>
  );
}
