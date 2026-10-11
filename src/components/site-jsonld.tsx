import { getSettings } from "@/lib/content";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.newankurfurnishers.in";

// Organization / local business structured data for the whole site.
export async function SiteJsonLd() {
  "use cache";
  const s = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: s.business_name,
    description: s.seo_description ?? undefined,
    url: SITE,
    telephone: s.phones[0],
    foundingDate: String(s.established_year),
    image: `${SITE}/logo.png`,
    logo: `${SITE}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address ?? undefined,
      addressLocality: "Patna",
      addressRegion: "Bihar",
      postalCode: "800001",
      addressCountry: "IN",
    },
    sameAs: [s.instagram_url, s.facebook_url].filter(Boolean),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
