import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const UPDATED = "13 October 2026";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Terms of use",
    description: "The terms on which you may use the New Ankur Furnishers website.",
    path: "/terms",
  });
}

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <section className="container-site py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="text-walnut">Legal</p>
        <h1 className="mt-3 text-[clamp(2.4rem,4.5vw,3.6rem)]">Terms of use</h1>
        <p className="mt-3 text-sm text-forest/55">Last updated: {UPDATED}</p>

        <div className="prose-brand mt-10">
          <p>
            By using this website you agree to these terms. If you do not agree, please do not use the site.
          </p>

          <h2>Using this site</h2>
          <p>
            This website is provided for information about {s.business_name} and our products and services. You may
            browse and share it for personal, non-commercial use.
          </p>

          <h2>Products, prices and enquiries</h2>
          <p>
            Product descriptions and images are indicative. We do not sell online — prices, availability,
            specifications, measurements and timelines are confirmed when you make an enquiry and after a site visit. An
            enquiry is a request for information, not a confirmed order.
          </p>

          <h2>Content and intellectual property</h2>
          <p>
            The text, images and design on this site belong to {s.business_name} or are used with permission. Please
            don&rsquo;t copy or reuse them without our written consent.
          </p>

          <h2>Other websites</h2>
          <p>
            This site may link to other websites (such as social media). We are not responsible for their content or
            privacy practices.
          </p>

          <h2>No warranties and liability</h2>
          <p>
            We take care to keep this website accurate and available, but it is provided &ldquo;as is&rdquo; without
            warranties of any kind. To the extent permitted by law, we are not liable for any loss arising from your use
            of the site.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of India, and any disputes are subject to the courts of Patna, Bihar.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Contact us{s.phones[0] ? ` on ${s.phones[0]}` : ""}
            {s.email ? ` or at ${s.email}` : ""}.
          </p>
        </div>
      </div>
    </section>
  );
}
