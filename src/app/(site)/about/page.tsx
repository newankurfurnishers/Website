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

// NOTE: copy here follows the approved About mockup. Confirm the specifics (the
// 2002 milestone, regions served, 2024+ capabilities) are accurate, and replace
// the founder photo with a real workshop image via the admin → Media.
const timeline = [
  {
    year: "1984",
    title: "Inception on S.P. Verma Road",
    text: "Founded on foundational principles of uncompromised wood kiln-seasoning, authentic honest materials, and unshakeable multi-generational family trust.",
  },
  {
    year: "2002",
    title: "Expansion into Architectural Surfaces",
    text: "Pioneered engineered hardwood, luxury vinyl planking, and specialized acoustic panelling for premier hospitality and prominent residence projects across Bihar, Bengal, and Jharkhand.",
  },
  {
    year: "2024+",
    title: "End-to-End Turnkey Precision",
    text: "From 3D digital architectural styling, on-site laser precision measurement, to master joinery fabrication and motorized scene integration, delivered with flawless accountability.",
  },
];

function HeritageSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-gradient-to-b from-[#f6efe8] to-[#f1e8dd]">
      <div className="container-site grid gap-14 py-16 md:py-24 lg:grid-cols-2 lg:gap-20">
        {/* Left: heritage + founder quote */}
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-caramel">Heritage Chronicle</p>
          <h2 className="mt-5 text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.05]">
            Four Decades of Reverence for Wood &amp; Fabric
          </h2>

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
                <p className="text-sm text-caramel">Founder &amp; Master Patron, {settings.business_name}</p>
              </figcaption>
            </div>
          </figure>
        </div>

        {/* Right: pillars + timeline + concierge */}
        <div className="lg:pt-2">
          <h2 className="text-[clamp(2rem,3.6vw,3rem)]">The Pillars of Our Atelier</h2>
          <p className="mt-5 max-w-[46ch] text-lg text-forest/75">
            Rooted in the historical heart of Patna on S.P. Verma Road, {settings.business_name} has quietly grown into
            Eastern India&rsquo;s foremost destination for bespoke interior architecture, high-trust soft furnishings,
            and contract turnkeys.
          </p>

          <ol className="mt-12 space-y-9">
            {timeline.map((t) => (
              <li key={t.year} className="grid grid-cols-[3.5rem_1fr] gap-x-5 sm:grid-cols-[4.5rem_1fr] sm:gap-x-6">
                <span className="font-display text-2xl text-caramel">{t.year}</span>
                <div>
                  <h3 className="font-display text-xl text-forest">{t.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-forest/70">{t.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-col gap-5 rounded-[1.25rem] bg-white/70 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-caramel">
                Bespoke Architectural Concierge
              </p>
              <p className="mt-2 max-w-[30ch] font-display text-[1.4rem] leading-snug text-forest">
                Need specialized joinery drawings or sample swatches?
              </p>
            </div>
            <Link
              href="/contact?interest=Bespoke project brief"
              className="shrink-0 self-start bg-forest-deep px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#f4eee7] transition-colors hover:bg-forest sm:self-auto"
            >
              Initiate Project Brief
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
