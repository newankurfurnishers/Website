import Image from "next/image";
import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import { getCategories, getElements, getSections, getSectors, getSettings } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";
import type { Category } from "@/content/types";

export default async function HomePage() {
  const [s, elements, categories, sectors, settings] = await Promise.all([
    getSections("home"),
    getElements(),
    getCategories(),
    getSectors(),
    getSettings(),
  ]);
  const { hero, story, philosophy, categories: catHead, sectors: secHead, cta } = s;
  const half = Math.ceil(categories.length / 2);

  return (
    <>
      {/* Hero */}
      <section className="bg-forest text-sand">
        <div className="grid lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative order-1 h-[52svh] overflow-hidden lg:order-2 lg:h-auto">
            {hero?.image_url && (
              <Image
                src={hero.image_url}
                alt={hero.image_alt ?? ""}
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="hero-settle object-cover"
              />
            )}
          </div>
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-10 lg:order-1 lg:py-20 lg:pl-[max(2.5rem,calc((100vw-82rem)/2+2.5rem))] lg:pr-14">
            {hero?.eyebrow && <p className="text-sand/70">{hero.eyebrow}</p>}
            <h1 className="mt-4 text-[clamp(3rem,5.4vw,5.25rem)] text-sand">{hero?.heading}</h1>
            {hero?.body && <p className="mt-6 max-w-[34ch] text-lg text-sand/80">{hero.body}</p>}
            <div className="mt-10 flex flex-wrap gap-3">
              {hero?.cta_href && (
                <Link href={hero.cta_href} className="btn btn-solid">
                  {hero.cta_label}
                </Link>
              )}
              <Link href="/contact" className="btn btn-line text-sand">
                Make an enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      {story && (
        <section className="container-site grid gap-6 py-20 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-16 md:py-28">
          <h2 className="text-[clamp(2.1rem,4vw,3.4rem)]">{story.heading}</h2>
          <div className="md:pt-3">
            {story.body && <p className="max-w-[46ch] text-lg text-forest/80">{story.body}</p>}
            <Link href="/about" className="link-underline mt-6 inline-block font-medium">
              Our story
            </Link>
          </div>
        </section>
      )}

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
          <ul className="flex justify-center lg:justify-end" aria-label="The five elements">
            {elements.map((el, i) => (
              <li key={el.slug} className={i === 0 ? "" : "-ml-4 sm:-ml-6"} style={{ zIndex: i }}>
                <Link
                  href={`/philosophy#${el.slug}`}
                  className="group relative block h-[19rem] w-[4.6rem] overflow-hidden rounded-full ring-[5px] ring-forest sm:h-[26rem] sm:w-[7.5rem] lg:h-[30rem] lg:w-[8.5rem]"
                >
                  <Image
                    src={el.image_url}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 136px, 74px"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent" />
                  <span className="absolute bottom-7 left-1/2 block -translate-x-1/2 rotate-180 font-display text-xl text-sand [writing-mode:vertical-rl] sm:text-2xl">
                    {el.name}
                    <span className="sr-only"> ({el.sanskrit}): {el.tagline}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories: the showroom signage column */}
      <section className="container-site py-20 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-[18ch] text-[clamp(2.1rem,4vw,3.4rem)]">{catHead?.heading}</h2>
          {catHead?.cta_href && (
            <Link href={catHead.cta_href} className="link-underline font-medium">
              {catHead.cta_label}
            </Link>
          )}
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-10">
          <SignColumn items={categories.slice(0, half)} />
          <SignColumn items={categories.slice(half)} />
        </div>
      </section>

      {/* Sectors */}
      <section className="border-t border-forest/10">
        <div className="container-site py-20 md:py-28">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2.1rem,4vw,3.4rem)]">{secHead?.heading}</h2>
            {secHead?.body && <p className="mt-4 text-lg text-forest/75">{secHead.body}</p>}
          </div>
          <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sec) => (
              <li key={sec.slug}>
                <Link href={`/expertise/${sec.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-[11rem] bg-sand">
                    <Image
                      src={sec.image_url}
                      alt={sec.image_alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-5 text-2xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                    {sec.name}
                  </h3>
                  <p className="mt-1 text-forest/70">{sec.tagline}</p>
                </Link>
              </li>
            ))}
          </ul>
          {secHead?.cta_href && (
            <Link href={secHead.cta_href} className="btn btn-dark mt-14">
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

function SignColumn({ items }: { items: Category[] }) {
  return (
    <ul className="wave-right bg-sand py-4 pr-12 pl-5 shadow-[inset_0_0_80px_rgba(94,60,43,0.12)] sm:pl-8">
      {items.map((c) => (
        <li key={c.slug} className="border-b border-forest/15 last:border-b-0">
          <Link
            href={`/products/${c.slug}`}
            className="group flex items-center gap-5 py-4 sm:gap-6"
          >
            <CategoryIcon name={c.icon} className="size-10 shrink-0 text-forest/85 sm:size-11" />
            <span className="h-12 w-px bg-forest/25" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block font-display text-[1.6rem] leading-tight sm:text-[1.85rem]">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                  {c.name}
                </span>
              </span>
              <span className="mt-0.5 block text-[0.92rem] text-walnut">{c.tagline}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
