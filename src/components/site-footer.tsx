import Image from "next/image";
import Link from "next/link";
import { getCategories, getSettings } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";
import { nav } from "./site-header";

export async function SiteFooter() {
  "use cache";
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest text-sand">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <Image src="/logo-light.png" alt="New Ankur Furnishers" width={1713} height={675} className="h-12 w-auto" />
          <p className="mt-6 text-sand/75">
            Home furnishings for homes, hotels, hospitals, offices and institutions in Patna since {settings.established_year}.
          </p>
          {settings.address && <address className="mt-6 not-italic text-sand/90">{settings.address}</address>}
          <ul className="mt-4 space-y-1">
            {settings.phones.map((p) => (
              <li key={p}>
                <a href={telHref(p)} className="link-underline">
                  {p}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {settings.whatsapp && (
              <a href={whatsappHref(settings.whatsapp)} className="link-underline" target="_blank" rel="noopener">
                WhatsApp
              </a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} className="link-underline" target="_blank" rel="noopener">
                Instagram
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} className="link-underline" target="_blank" rel="noopener">
                Facebook
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Products">
          <h2 className="font-display text-xl text-sand">Products</h2>
          <ul className="mt-4 space-y-2 text-sand/75">
            {categories.slice(0, 8).map((c) => (
              <li key={c.slug}>
                <Link href={`/products/${c.slug}`} className="hover:text-sand">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="link-underline text-sand">
                All products
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="font-display text-xl text-sand">New Ankur</h2>
          <ul className="mt-4 space-y-2 text-sand/75">
            {[...nav, { href: "/contact", label: "Contact us" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-sand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-sand/15">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-sand/60 sm:flex-row sm:justify-between">
          <p>
            © {year} {settings.business_name}
          </p>
          <p>{settings.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
