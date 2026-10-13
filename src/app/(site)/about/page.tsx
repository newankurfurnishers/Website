import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { getSections, getSettings, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { SiteSettings } from "@/content/types";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "About us",
    description:
      "New Ankur Furnishers has furnished homes and businesses in Patna since 1984 — four decades of comfort, style and warmth, from the first measurement to the final fitting.",
    path: "/about",
    image: "/images/brochure/about-armchair.webp",
  });
}

export default async function AboutPage() {
  const [s, settings, testimonials] = await Promise.all([
    getSections("about"),
    getSettings(),
    getTestimonials(),
  ]);
  const { intro, why, founder } = s;

  return (
    <>
      {intro && (
        <section className="container-site grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          <div>
            <p className="text-walnut">{intro.eyebrow ?? "About us"}</p>
            <h1 className="mt-3 text-[clamp(2.4rem,4.5vw,4rem)]">{intro.heading}</h1>
            {intro.body?.split("\n\n").map((para) => (
              <p key={para.slice(0, 24)} className="mt-5 max-w-[48ch] text-lg text-forest/80">
                {para}
              </p>
            ))}
          </div>
          {intro.image_url && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand">
              <Image
                src={intro.image_url}
                alt={intro.image_alt ?? ""}
                fill
                priority
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </section>
      )}

      <HeritageSection settings={settings} />

      {why?.items && why.items.length > 0 && (
        <section className="bg-forest text-sand">
          <div className="container-site py-16 md:py-24">
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)]">{why.heading ?? "Why choose us"}</h2>
            <ul className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {why.items.map((it, i) => (
                <li key={it.title} className="border-t border-sand/20 pt-5">
                  <p className="font-display text-olive">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-xl text-sand">{it.title}</h3>
                  {it.text && <p className="mt-2 text-sand/75">{it.text}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {founder && (
        <section className="container-site grid items-center gap-10 py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:py-24">
          {founder.image_url && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand md:order-2">
              <Image
                src={founder.image_url}
                alt={founder.image_alt ?? ""}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-walnut">{founder.eyebrow ?? "From our founder"}</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)]">{founder.heading}</h2>
            {founder.body?.split("\n\n").map((para) => (
              <p key={para.slice(0, 24)} className="mt-5 max-w-[52ch] text-lg text-forest/80">
                {para}
              </p>
            ))}
            {founder.cta_label && <p className="mt-8 font-display text-2xl text-walnut">{founder.cta_label}</p>}
            <p className="text-sm text-forest/60">Founder, {settings.business_name}</p>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="border-t border-forest/10">
          <div className="container-site py-16 md:py-24">
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)]">In their words</h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <li key={`${t.name}-${t.sort}`} className="rounded-[1.5rem] bg-sand/60 p-7">
                  <blockquote className="text-lg text-forest/85">&ldquo;{t.quote}&rdquo;</blockquote>
                  <p className="mt-5 font-display text-lg">{t.name}</p>
                  {t.context && <p className="text-sm text-forest/60">{t.context}</p>}
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

// The founder photo is still a grayscale placeholder — replace with a real
// workshop / founder image via admin → Media.
const timeline = [
  {
    year: "1984",
    title: "Where it began",
    text: "New Ankur Furnishers opened on S.P. Verma Road in Patna, with a simple belief: honest materials, measured well and fitted properly.",
  },
  {
    year: "Over the years",
    title: "Beyond the home",
    text: "The same craft grew from living rooms to hotels, hospitals, schools and offices across Bihar.",
  },
  {
    year: "Today",
    title: "Start to finish",
    text: "From the first site visit and measurement to the final fitting, every project is handled end to end by our own team.",
  },
];

function HeritageSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-gradient-to-b from-[#f6efe8] to-[#f1e8dd]">
      <div className="container-site grid gap-14 py-16 md:py-24 lg:grid-cols-2 lg:gap-20">
        {/* Left: heritage + founder quote */}
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-caramel">Our story</p>
          <h2 className="mt-5 text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.05]">Rooted in Patna, since 1984.</h2>

          <figure className="mt-10 rounded-[1.5rem] bg-white p-5 shadow-[0_1px_0_rgba(41,45,40,0.05),0_24px_60px_-30px_rgba(41,45,40,0.35)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-stone">
              {/* Placeholder — replace with a real founder / workshop photo via Media */}
              <Image
                src="/images/brochure/wooden-furniture.webp"
                alt="Master craftsman and apprentice at the workbench"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover grayscale"
              />
            </div>
            <div className="mt-6 px-1 pb-1">
              <span aria-hidden="true" className="block font-display text-5xl leading-none text-caramel">
                &rdquo;
              </span>
              <blockquote className="mt-1 font-display text-[1.35rem] italic leading-snug text-forest/85">
                In 1984, we set out with a singular conviction: that a home is not furnished with objects, but with
                memories, textures, and enduring grace.
              </blockquote>
              <figcaption className="mt-5">
                <p className="font-medium text-forest">Santosh Kumar Agrawal</p>
                <p className="text-sm text-caramel">Founder, {settings.business_name}</p>
              </figcaption>
            </div>
          </figure>
        </div>

        {/* Right: pillars + timeline + concierge */}
        <div className="lg:pt-2">
          <h2 className="text-[clamp(2rem,3.6vw,3rem)]">What we stand for.</h2>
          <p className="mt-5 max-w-[48ch] text-lg text-forest/75">
            From a single shop on S.P. Verma Road, {settings.business_name} has grown into a trusted
            name for furnishings and interiors across Patna and Bihar — for homes, hotels, hospitals,
            offices and institutions.
          </p>

          <ol className="mt-12 space-y-8">
            {timeline.map((t) => (
              <li key={t.year}>
                <p className="font-display text-caramel">{t.year}</p>
                <h3 className="mt-1 font-display text-xl text-forest">{t.title}</h3>
                <p className="mt-2 max-w-[50ch] text-forest/70">{t.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-col gap-5 rounded-[1.25rem] bg-white/70 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-caramel">
                Visit or get in touch
              </p>
              <p className="mt-2 max-w-[30ch] font-display text-[1.4rem] leading-snug text-forest">
                Planning a project? Let&rsquo;s start with a conversation.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 self-start bg-forest-deep px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#f4eee7] transition-colors hover:bg-forest sm:self-auto"
            >
              Make an enquiry
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
