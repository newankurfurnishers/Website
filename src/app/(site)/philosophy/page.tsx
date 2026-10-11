import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { getCategories } from "@/lib/content";
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

// Curated from the brand's Five Elements of Nature pitch. Hardcoded for now;
// to be wired into the CMS in the final pass (see CMS-TODO.md).
const FRAMEWORK = [
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

type Element = {
  slug: string;
  sanskrit: string;
  name: string;
  subtitle: string;
  image: string;
  alt: string;
  lead?: string;
  principle: string;
  inDesign: string;
  story?: { label: string; text: string };
  visual: string;
};

const ELEMENTS: Element[] = [
  {
    slug: "earth",
    sanskrit: "Prithvi",
    name: "Earth",
    subtitle: "Foundation, Craft, Permanence",
    image: "/images/elements/earth.webp",
    alt: "Earthy room with a stone sculpture, terracotta leather sofa and an autumn tree",
    principle:
      "Earth grounds us — materiality, authenticity, the honest expression of wood, stone, clay and natural fibre.",
    inDesign:
      "Visible joinery. Tactile surfaces. Furniture that reveals its construction. Textiles that age beautifully.",
    story: {
      label: "The craft story",
      text: "Our mastery lies in understanding materials deeply — how wood moves, how leather develops a patina, how upholstery holds its form across decades. This is not mass production. It is stewardship.",
    },
    visual: "Warm ochre, terracotta and deep browns. Textures that invite touch. Compositions that feel rooted and stable.",
  },
  {
    slug: "water",
    sanskrit: "Jal",
    name: "Water",
    subtitle: "Flow, Adaptability, Softness",
    image: "/images/elements/water.webp",
    alt: "Seaside setting with a glass table, sheer glassware and the ocean beyond",
    principle:
      "Water flows and adapts to its container — gentle and powerful. In living spaces: flexibility, comfort, the softness that makes a house a home.",
    inDesign: "Curved forms. Layered textiles. Upholstery that invites you to sink in. Lighting that shifts through the day.",
    story: {
      label: "The comfort story",
      text: "Luxury is not hardness or severity. It is the moment you sit into a perfectly proportioned sofa, the weight of a linen curtain, the temperature of a room at dusk.",
    },
    visual: "Soft blues, greens and greys. Flowing lines. Generous proportions. Spaces that breathe.",
  },
  {
    slug: "fire",
    sanskrit: "Agni",
    name: "Fire",
    subtitle: "Warmth, Character, Energy",
    image: "/images/elements/fire.webp",
    alt: "Coral arched alcove with a fire and a cream curved sofa",
    principle:
      "Fire brings warmth and character — the spark of personality in a space. Without it, even the most beautiful room feels cold.",
    inDesign:
      "Accent colours that surprise. Lighting that creates drama and intimacy. Materials with depth — velvet, brass, dark wood. Compositions with a point of view.",
    story: {
      label: "The personality story",
      text: "A space should reflect the people who live in it. Our role is to provide the palette, the forms and the materials — tools that let you express your own warmth. We design for living, not for magazines.",
    },
    visual: "Deep jewel tones. Warm metallics. Dramatic contrasts. Moments of unexpected richness.",
  },
  {
    slug: "air",
    sanskrit: "Vayu",
    name: "Air",
    subtitle: "Light, Openness, Freedom",
    image: "/images/elements/air.webp",
    alt: "Soft pink and blue scene with clouds, an arch and a boucle stool",
    lead: "Luxury today is not about abundance — it is about clarity. Every piece in a space should earn its place.",
    principle:
      "Air is invisible but essential: the space between objects, the light that defines form, the freedom to move and breathe.",
    inDesign:
      "Generous spacing. Minimal visual clutter. Furniture scaled to human proportion. Negative space as a design element.",
    visual: "Light, neutral backgrounds. Breathing room. Clarity of form. Simplicity that reveals complexity.",
  },
  {
    slug: "space",
    sanskrit: "Akasha",
    name: "Space",
    subtitle: "Architecture, Possibility, Balance",
    image: "/images/elements/space.webp",
    alt: "Beige fluted arch with a palm, a coral disc and a terracotta shell chair",
    principle:
      "Space is the container — the fifth element that holds all others in balance. Architecture and interior design are inseparable.",
    inDesign:
      "Furniture as architecture. Spatial planning that considers sightlines, acoustics and movement. Collections that work as a system, not isolated pieces.",
    story: {
      label: "Systems thinking",
      text: "We do not design individual products; we design environments. A sofa is never separate from the wall behind it, the light above it, the rug beneath it. Every element is in conversation.",
    },
    visual: "Architectural clarity. Balanced compositions. Spatial depth. Harmony across scales.",
  },
];

export default async function PhilosophyPage() {
  const categories = await getCategories();

  return (
    <>
      <section className="bg-forest text-sand">
        <div className="container-site py-20 md:py-28">
          <p className="text-olive">The brand idea</p>
          <h1 className="mt-3 text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02]">Five Elements of Nature</h1>
          <p className="mt-6 font-display text-xl tracking-[0.1em] text-sand/70">
            Earth · Water · Fire · Air · Space
          </p>
          <p className="mt-6 max-w-[56ch] text-lg text-sand/80">
            Rooted in Indian philosophy and design tradition, the five elements are our organizing intelligence — a lens
            for every material we choose, every proportion we draw and every room we compose.
          </p>
          <nav aria-label="The five elements" className="mt-10 flex flex-wrap gap-3">
            {ELEMENTS.map((el) => (
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
          {FRAMEWORK.map((f) => (
            <li key={f.title} className="rounded-[1.25rem] border-l-2 border-caramel bg-sand/45 p-7">
              <h2 className="font-display text-xl">{f.title}</h2>
              <p className="mt-3 text-forest/80">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {ELEMENTS.map((el, i) => {
        const inElement = categories.filter((c) => c.element === el.slug);
        return (
          <section key={el.slug} id={el.slug} className="scroll-mt-24 border-t border-forest/10">
            <div className="container-site grid items-start gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 ? "lg:order-2" : ""}>
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-stone lg:sticky lg:top-24">
                  <Image
                    src={el.image}
                    alt={el.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <p className="font-display text-olive">{el.sanskrit}</p>
                <h2 className="mt-1 text-[clamp(2rem,4vw,3.2rem)] leading-tight">
                  {el.name} <span className="text-forest/50">— {el.subtitle}</span>
                </h2>
                {el.lead && <p className="mt-5 max-w-[48ch] text-lg italic text-forest/70">{el.lead}</p>}

                <dl className="mt-8 grid gap-6">
                  <Block label="The principle" text={el.principle} />
                  <Block label="In design" text={el.inDesign} />
                  {el.story && <Block label={el.story.label} text={el.story.text} />}
                  <Block label="Visual language" text={el.visual} />
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
