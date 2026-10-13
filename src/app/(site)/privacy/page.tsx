import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const UPDATED = "13 October 2026";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Privacy policy",
    description:
      "How New Ankur Furnishers collects, uses and protects the information you share through our website and enquiry form.",
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <section className="container-site py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="text-walnut">Legal</p>
        <h1 className="mt-3 text-[clamp(2.4rem,4.5vw,3.6rem)]">Privacy policy</h1>
        <p className="mt-3 text-sm text-forest/55">Last updated: {UPDATED}</p>

        <div className="prose-brand mt-10">
          <p>
            This policy explains how {s.business_name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses and protects
            the information you share with us through this website.
          </p>

          <h2>Information we collect</h2>
          <p>
            When you send an enquiry, we collect the details you provide — your name and phone number, and optionally
            your email address, the product or sector you&rsquo;re interested in, and your message. We also collect
            privacy-friendly, aggregate usage data (such as page views) that does not identify you personally.
          </p>

          <h2>How we use it</h2>
          <p>
            We use your details only to respond to your enquiry, prepare quotes, arrange a site visit or installation,
            and improve how this website works. We do not use your information for unrelated marketing without your
            consent.
          </p>

          <h2>Sharing</h2>
          <p>
            We do not sell your personal information. We share it only with the trusted service providers that help us
            run this website and respond to you — for example, our database and email providers — and only to the extent
            needed to serve you, or where required by law.
          </p>

          <h2>Cookies</h2>
          <p>
            This site uses only essential, functional cookies (for example, to keep staff signed in to the admin area).
            We do not use advertising or cross-site tracking cookies. Our analytics are aggregate and do not rely on
            tracking cookies.
          </p>

          <h2>Keeping your information</h2>
          <p>
            We keep enquiry details for as long as needed to serve you and maintain our records. You can ask us to
            access, correct or delete your information at any time.
          </p>

          <h2>Contact us</h2>
          <p>
            For any question about your privacy, or to request access or deletion, contact us
            {s.phones[0] ? ` on ${s.phones[0]}` : ""}
            {s.email ? ` or at ${s.email}` : ""}
            {s.address ? `, or visit us at ${s.address}` : ""}.
          </p>

          <h2>Changes</h2>
          <p>We may update this policy from time to time. The latest version will always appear on this page.</p>
        </div>
      </div>
    </section>
  );
}
