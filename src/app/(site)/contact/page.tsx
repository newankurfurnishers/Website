import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { getCategories, getSectors, getSettings } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Contact us",
    description:
      "Tell New Ankur Furnishers about your space. We'll visit, measure and suggest options that fit your budget. Call, WhatsApp or send an enquiry.",
    path: "/contact",
    image: "/images/brochure/why-dining.webp",
  });
}

export default async function ContactPage() {
  const [settings, categories, sectors] = await Promise.all([
    getSettings(),
    getCategories(),
    getSectors(),
  ]);
  const interests = [...categories.map((c) => c.name), ...sectors.map((s) => s.name)];

  return (
    <section className="container-site py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="text-walnut">Contact</p>
        <h1 className="mt-3 text-[clamp(2.4rem,4.5vw,4rem)]">Let&rsquo;s talk about your space.</h1>
        <p className="mt-6 text-lg text-forest/75">
          Tell us what you&rsquo;re planning. We&rsquo;ll visit, measure and suggest options that fit
          your budget — then supply and fit it with our own team.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <Suspense fallback={<div className="h-96 rounded-[1.5rem] bg-sand/40" />}>
            <ContactForm interests={interests} />
          </Suspense>
        </div>

        <aside className="space-y-8">
          {settings.address && (
            <div>
              <h2 className="font-display text-xl">Visit the showroom</h2>
              <address className="mt-2 not-italic text-forest/80">{settings.address}</address>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl">Call us</h2>
            <ul className="mt-2 space-y-1">
              {settings.phones.map((p) => (
                <li key={p}>
                  <a href={telHref(p)} className="link-underline text-lg">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
            {settings.whatsapp && (
              <a
                href={whatsappHref(settings.whatsapp, "Hello New Ankur Furnishers, I'd like to make an enquiry.")}
                className="btn btn-dark mt-4"
                target="_blank"
                rel="noopener"
              >
                Message on WhatsApp
              </a>
            )}
          </div>

          {settings.map_embed_url && (
            <div>
              <h2 className="font-display text-xl">Find us</h2>
              <div className="mt-3 aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sand">
                <iframe
                  src={settings.map_embed_url}
                  title="Map to New Ankur Furnishers"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
