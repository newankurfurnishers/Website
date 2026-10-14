"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileNav } from "./mobile-nav";
import { nav } from "./nav";

export function SiteHeader() {
  const pathname = usePathname();
  const overHero = pathname === "/"; // only the home page has a full-bleed hero behind the header
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  // Transparent while sitting over the hero; solid once the page scrolls (or on any other page).
  const solid = !overHero || scrolled;

  return (
    <header
      className={`sticky top-0 z-40 transform-gpu border-b backface-hidden transition-colors duration-300 ${
        solid
          ? "border-forest/10 bg-stone shadow-[0_6px_20px_-12px_rgba(31,34,30,0.35)]"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="New Ankur Furnishers, home">
          <Image src="/logo.png" alt="New Ankur Furnishers" width={1713} height={675} priority className="h-11 w-auto md:h-[3.25rem]" />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.98rem]">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:bg-forest after:transition-transform after:duration-300 ${
                      active
                        ? "text-forest after:scale-x-100"
                        : "text-forest/80 after:scale-x-0 hover:text-forest hover:after:scale-x-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
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
