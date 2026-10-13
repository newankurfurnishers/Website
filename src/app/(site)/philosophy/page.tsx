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
      "The five elements of nature — Earth, Water, Fire, Air and Space. Rooted in Indian design tradition, they are the lens through which New Ankur Furnishers shapes every material, proportion and room.",
    path: "/philosophy",
    image: "/images/elements/earth.webp",
  });
}

const FRAMEWORK_FALLBACK = [
  {
    title: "A timeless framework",
    text: "Rooted in Indian philosophy and design tradition. Each element is a principle of balance, harmony and human flourishing — not a material or an aesthetic.",
  },
  {
    title: "A complete philosophy",
    text: "Together, the five elements form a coherent lens through which every design decision, every material choice and every spatial composition is made.",
  },
  {
    title: "Not a gimmick",
    text: "This is how we think, how we create, how we live. It is the organizing intelligence of everything we do.",
  },
];

export default async function PhilosophyPage() {
  const [elements, categories, sections] = await Promise.all([
    getElements(),
    getCategories(),
    getSections("philosophy"),
  ]);
  const intro = sections.intro;
  const framework = sections.framework?.items?.length ? sections.framework.items : FRAMEWORK_FALLBACK;

  return (
    <>
      <section className="bg-forest text-sand">
        <div className="container-site py-20 md:py-28">
          <p className="text-olive">{intro?.eyebrow ?? "The brand idea"}</p>
          <h1 className="mt-3 text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02]">
            {intro?.heading ?? "Five Elements of Nature"}
          </h1>
          <p className="mt-6 font-display text-xl tracking-[0.1em] text-sand/70">
            Earth · Water · Fire · Air · Space
          </p>
          <p className="mt-6 max-w-[56ch] text-lg text-sand/80">
            {intro?.body ??
              "Rooted in Indian philosophy and design tradition, the five elements are our organizing intelligence — a lens for every material we choose, every proportion we draw and every room we compose."}
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

      <section className="container-site py-16 md:py-20">
        <ul className="grid gap-6 md:grid-cols-3">
          {framework.map((f) => (
            <li key={f.title} className="rounded-[1.25rem] border-l-2 border-caramel bg-sand/45 p-7">
              <h2 className="font-display text-xl">{f.title}</h2>
              <p className="mt-3 text-forest/80">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {elements.map((el, i) => {
        const inElement = categories.filter((c) => c.element === el.slug);
        return (
          <section key={el.slug} id={el.slug} className="scroll-mt-24 border-t border-forest/10">
            <div className="container-site grid items-start gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 ? "lg:order-2" : ""}>
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-stone lg:sticky lg:top-24">
                  <Image
                    src={el.image_url}
                    alt={el.image_alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <p className="font-display text-olive">{el.sanskrit}</p>
                <h2 className="mt-1 text-[clamp(2rem,4vw,3.2rem)] leading-tight">
                  {el.name}
                  {el.subtitle && <span className="text-forest/50"> — {el.subtitle}</span>}
                </h2>
                {el.lead && <p className="mt-5 max-w-[48ch] text-lg italic text-forest/70">{el.lead}</p>}

                <dl className="mt-8 grid gap-6">
                  {el.principle && <Block label="The principle" text={el.principle} />}
                  {el.in_design && <Block label="In design" text={el.in_design} />}
                  {el.story_label && el.story_text && <Block label={el.story_label} text={el.story_text} />}
                  {el.visual_language && <Block label="Visual language" text={el.visual_language} />}
                </dl>

                {inElement.length > 0 && (
                  <div className="mt-9">
                    <p className="text-sm text-walnut">In this element</p>
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
                  </div>
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

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <dt className="font-medium text-walnut">{label}</dt>
      <dd className="mt-1 max-w-[52ch] text-lg text-forest/80">{text}</dd>
    </div>
  );
}
