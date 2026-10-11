"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/expertise", label: "Expertise" },
  { href: "/admin/philosophy", label: "Philosophy" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-sand/15 bg-forest px-4 py-3 text-sand lg:hidden">
        <Link href="/admin" className="font-display text-lg">
          New Ankur admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="grid size-10 place-items-center rounded-lg hover:bg-sand/10"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      <aside
        className={`${open ? "block" : "hidden"} border-b border-sand/15 bg-forest text-sand lg:sticky lg:top-0 lg:block lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0`}
      >
        <div className="flex h-full flex-col">
          <Link href="/admin" className="hidden px-6 py-6 font-display text-xl lg:block">
            New Ankur admin
          </Link>
          <nav aria-label="Admin" className="flex-1 px-3 py-2 lg:py-0">
            <ul className="space-y-0.5">
              {items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(it.href) ? "page" : undefined}
                    className="block rounded-lg px-3 py-2.5 text-sand/75 transition-colors hover:bg-sand/10 hover:text-sand aria-[current=page]:bg-sand/15 aria-[current=page]:text-sand"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-sand/15 px-5 py-4">
            <Link href="/" target="_blank" rel="noopener" className="block text-sm text-sand/70 hover:text-sand">
              View site ↗
            </Link>
            {email && <p className="mt-3 truncate text-xs text-sand/45">{email}</p>}
            <form action={signOut} className="mt-2">
              <button type="submit" className="text-sm text-sand/70 hover:text-sand">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
