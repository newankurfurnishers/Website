import Image from "next/image";
import Link from "next/link";
import { ExpertiseGallery } from "@/components/expertise-gallery";
import { HeroParallax } from "@/components/hero-parallax";
import { PhilosophyAccordion } from "@/components/philosophy-accordion";
import { ProductCarousel } from "@/components/product-carousel";
import { StoryBloom } from "@/components/story-bloom";
import { getCategories, getElements, getSections, getSectors, getSettings } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";

export default async function HomePage() {
  const [s, elements, categories, sectors, settings] = await Promise.all([
    getSections("home"),
    getElements(),
    getCategories(),
    getSectors(),
    getSettings(),
  ]);
  const { hero, story, philosophy, categories: catHead, sectors: secHead, cta } = s;

  return (
    <>
      {/* Hero */}
      <HeroParallax
        eyebrow={hero?.eyebrow}
        heading={hero?.heading}
        body={hero?.body}
        ctaLabel={hero?.cta_label}
        ctaHref={hero?.cta_href}
        imageUrl={hero?.image_url}
        imageAlt={hero?.image_alt}
      />

      {/* Plain-language summary line — context for readers and search engines */}
      <section className="border-b border-forest/10 bg-stone">
        <p className="container-site py-7 text-center text-[0.95rem] leading-relaxed text-walnut/75">
          Complete <strong className="font-medium text-walnut">home furnishings and interiors in Patna</strong> since
          1984 — curtains, flooring, wallpaper, blinds and furniture, measured, supplied and fitted by our own team for
          homes, hotels, hospitals, offices and institutions across Bihar.
        </p>
      </section>

      {/* Story */}
      {story && <StoryBloom eyebrow={story.eyebrow} heading={story.heading} body={story.body} />}

      {/* Philosophy: the five elements, drawn like the brand's colour card */}
      <section className="bg-forest text-sand">
        <div className="container-site grid items-center gap-14 py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            {philosophy?.eyebrow && <p className="text-olive">{philosophy.eyebrow}</p>}
            <h2 className="mt-3 text-[clamp(2.1rem,4vw,3.4rem)]">{philosophy?.heading}</h2>
            {philosophy?.body && <p className="mt-6 max-w-[42ch] text-lg text-sand/80">{philosophy.body}</p>}
            {philosophy?.cta_href && (
              <Link href={philosophy.cta_href} className="btn btn-line mt-10 text-sand">
                {philosophy.cta_label}
              </Link>
            )}
          </div>
          <PhilosophyAccordion elements={elements} />
        </div>
      </section>

      {/* Products: interactive category carousel */}
      <section className="container-site py-20 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            {catHead?.eyebrow && <p className="text-walnut">{catHead.eyebrow}</p>}
            <h2 className="mt-2 max-w-[18ch] text-[clamp(2.1rem,4vw,3.4rem)]">{catHead?.heading}</h2>
          </div>
          {catHead?.cta_href && (
            <Link href={catHead.cta_href} className="link-underline font-medium">
              {catHead.cta_label}
            </Link>
          )}
        </div>
        <div className="mt-12">
          <ProductCarousel categories={categories} />
        </div>
      </section>

      {/* Expertise & domains */}
      <section className="bg-forest-deep text-sand">
        <div className="container-site py-20 md:py-28">
          <div className="max-w-2xl">
            {secHead?.eyebrow && <p className="text-olive">{secHead.eyebrow}</p>}
            <h2 className="mt-3 text-[clamp(2.1rem,4vw,3.4rem)] text-sand">{secHead?.heading}</h2>
            {secHead?.body && <p className="mt-4 text-lg text-sand/75">{secHead.body}</p>}
          </div>
          <ExpertiseGallery sectors={sectors} />
          {secHead?.cta_href && (
            <Link href={secHead.cta_href} className="btn btn-solid mt-14">
              {secHead.cta_label}
            </Link>
          )}
        </div>
      </section>

      {/* Enquiry */}
      {cta && (
        <section className="bg-walnut text-sand">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-72 md:min-h-[32rem]">
              {cta.image_url && (
                <Image src={cta.image_url} alt={cta.image_alt ?? ""} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              )}
            </div>
            <div className="flex flex-col justify-center px-5 py-16 sm:px-10 md:px-14 lg:px-20">
              <h2 className="max-w-[16ch] text-[clamp(2.1rem,4vw,3.4rem)]">{cta.heading}</h2>
              {cta.body && <p className="mt-6 max-w-[40ch] text-lg text-sand/80">{cta.body}</p>}
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={cta.cta_href ?? "/contact"} className="btn btn-solid">
                  {cta.cta_label ?? "Make an enquiry"}
                </Link>
                {settings.phones[0] && (
                  <a href={telHref(settings.phones[0])} className="btn btn-line text-sand">
                    Call {settings.phones[0]}
                  </a>
                )}
              </div>
              {settings.whatsapp && (
                <a
                  href={whatsappHref(settings.whatsapp, "Hello New Ankur Furnishers, I'd like to know more about")}
                  className="link-underline mt-6 self-start text-sand/85"
                  target="_blank"
                  rel="noopener"
                >
                  Or message us on WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
