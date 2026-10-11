import type { Metadata } from "next";
import Image from "next/image";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { getSections, getSettings, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

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
            {founder.cta_label && (
              <p className="mt-8 font-display text-2xl text-walnut">{founder.cta_label}</p>
            )}
            <p className="text-sm text-forest/60">
              Founder, {settings.business_name}
            </p>
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
