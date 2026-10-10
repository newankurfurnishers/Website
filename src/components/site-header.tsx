import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";

export const nav = [
  { href: "/philosophy", label: "Philosophy" },
  { href: "/expertise", label: "Expertise" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-stone/95 backdrop-blur supports-[backdrop-filter]:bg-stone/80">
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="New Ankur Furnishers, home">
          <Image src="/logo.png" alt="New Ankur Furnishers" width={1713} height={675} priority className="h-11 w-auto md:h-[3.25rem]" />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.98rem]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="py-2 text-forest/80 transition-colors hover:text-forest">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn btn-dark hidden min-h-11 px-5 text-[0.95rem] sm:inline-flex">
            Make an enquiry
          </Link>
          <MobileNav items={[...nav, { href: "/contact", label: "Contact" }]} />
        </div>
      </div>
    </header>
  );
}
