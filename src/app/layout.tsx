import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteJsonLd } from "@/components/site-jsonld";
import { getSettings } from "@/lib/content";
import "./globals.css";

const marcellus = localFont({
  src: "../fonts/marcellus-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const jost = localFont({
  src: [
    { path: "../fonts/jost-latin-wght-normal.woff2", style: "normal", weight: "300 700" },
    { path: "../fonts/jost-latin-wght-italic.woff2", style: "italic", weight: "300 700" },
  ],
  variable: "--font-jost",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.newankurfurnishers.in"),
    title: { default: s.seo_title ?? s.business_name, template: `%s | ${s.business_name}` },
    description: s.seo_description ?? undefined,
    openGraph: { siteName: s.business_name, locale: "en_IN", type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#292d28" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${marcellus.variable} ${jost.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-sand">
          Skip to content
        </a>
        <SiteJsonLd />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
