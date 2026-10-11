import Link from "next/link";
import { getSettings } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";

// Shared enquiry call-to-action for interior pages. `interest` prefills the
// contact form (a category or sector name) and the WhatsApp message.
export async function EnquiryBanner({
  interest,
  heading = "Let's create your dream space together.",
  body = "Tell us about your space. We'll visit, measure and suggest options that fit your budget.",
}: {
  interest?: string;
  heading?: string;
  body?: string;
}) {
  "use cache";
  const settings = await getSettings();
  const href = interest ? `/contact?interest=${encodeURIComponent(interest)}` : "/contact";
  const waText = interest
    ? `Hello New Ankur Furnishers, I'd like to know more about ${interest}`
    : "Hello New Ankur Furnishers, I'd like to know more about";

  return (
    <section className="bg-walnut text-sand">
      <div className="container-site flex flex-col items-start gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(2rem,3.6vw,3rem)]">{heading}</h2>
          <p className="mt-5 max-w-[46ch] text-lg text-sand/80">{body}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <Link href={href} className="btn btn-solid">
            Make an enquiry
          </Link>
          {settings.phones[0] && (
            <a href={telHref(settings.phones[0])} className="btn btn-line text-sand">
              Call {settings.phones[0]}
            </a>
          )}
          {settings.whatsapp && (
            <a
              href={whatsappHref(settings.whatsapp, waText)}
              className="btn btn-line text-sand"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
