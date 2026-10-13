import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Thanks for your enquiry — we'll be in touch within one working day.",
  robots: { index: false, follow: true },
};

export default async function ThankYouPage() {
  const settings = await getSettings();
  return (
    <section className="container-site flex min-h-[70svh] flex-col justify-center py-20">
      <p className="text-walnut">Enquiry received</p>
      <h1 className="mt-3 max-w-[18ch] text-[clamp(2.4rem,5vw,4rem)]">Thank you — we&rsquo;ll be in touch.</h1>
      <p className="mt-5 max-w-[48ch] text-lg text-forest/75">
        We&rsquo;ve received your message and will call you back within one working day. In a hurry? Reach us
        directly below.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        {settings.phones[0] && (
          <a href={telHref(settings.phones[0])} className="btn btn-dark">
            Call {settings.phones[0]}
          </a>
        )}
        {settings.whatsapp && (
          <a
            href={whatsappHref(settings.whatsapp, "Hello New Ankur Furnishers, I just sent an enquiry.")}
            target="_blank"
            rel="noopener"
            className="btn btn-line text-forest"
          >
            WhatsApp
          </a>
        )}
        <Link href="/products" className="btn btn-line text-forest">
          Browse products
        </Link>
      </div>
    </section>
  );
}
