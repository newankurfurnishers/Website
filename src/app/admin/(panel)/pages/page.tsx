import Link from "next/link";
import { type AdminSection, getAdminSections } from "@/lib/admin/data";

export const metadata = { title: "Pages" };

const PAGE_NAMES: Record<string, string> = {
  home: "Home page",
  about: "About page",
  philosophy: "Philosophy page",
  expertise: "Expertise page",
  products: "Products page",
  blog: "Blog page",
  contact: "Contact page",
};

export default async function PagesAdminPage() {
  const sections = await getAdminSections();
  const groups = new Map<string, AdminSection[]>();
  for (const s of sections) {
    const list = groups.get(s.page) ?? [];
    list.push(s);
    groups.set(s.page, list);
  }

  return (
    <div>
      <h1 className="text-3xl">Pages</h1>
      <p className="mt-1 text-forest/65">Edit the text, images and buttons in each section of these pages.</p>

      {[...groups.entries()].map(([page, list]) => (
        <section key={page} className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">{PAGE_NAMES[page] ?? page}</h2>
            <Link href={page === "home" ? "/" : `/${page}`} target="_blank" rel="noopener" className="link-underline text-sm">
              View ↗
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-forest/10 overflow-hidden rounded-xl bg-white">
            {list.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/pages/${s.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-stone/50">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{s.label}</span>
                    <span className="block truncate text-sm text-forest/55">{s.heading ?? "—"}</span>
                  </span>
                  {!s.published && <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-xs text-forest/60">Hidden</span>}
                  <span className="text-sm text-forest/40">Edit →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
