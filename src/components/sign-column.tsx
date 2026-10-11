import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import type { Category } from "@/content/types";

// The showroom signage column: sand panel with a wavy right edge,
// line icon | thin rule | name + tagline. Shared by the home page and /products.
export function SignColumn({ items }: { items: Category[] }) {
  return (
    <ul className="wave-right bg-sand py-4 pr-12 pl-5 shadow-[inset_0_0_80px_rgba(94,60,43,0.12)] sm:pl-8">
      {items.map((c) => (
        <li key={c.slug} className="border-b border-forest/15 last:border-b-0">
          <Link href={`/products/${c.slug}`} className="group flex items-center gap-5 py-4 sm:gap-6">
            <CategoryIcon name={c.icon} className="size-10 shrink-0 text-forest/85 sm:size-11" />
            <span className="h-12 w-px bg-forest/25" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block font-display text-[1.6rem] leading-tight sm:text-[1.85rem]">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                  {c.name}
                </span>
              </span>
              <span className="mt-0.5 block text-[0.92rem] text-walnut">{c.tagline}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
