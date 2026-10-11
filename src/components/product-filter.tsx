"use client";

import { useMemo, useState } from "react";
import { SignColumn } from "@/components/sign-column";
import type { Category } from "@/content/types";

type ElementOption = { slug: string; name: string };

export function ProductFilter({
  categories,
  elements,
}: {
  categories: Category[];
  elements: ElementOption[];
}) {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(
    () => (active === "all" ? categories : categories.filter((c) => c.element === active)),
    [active, categories],
  );
  const half = Math.ceil(filtered.length / 2);

  const options = [{ slug: "all", name: "All products" }, ...elements];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products by element">
        {options.map((o) => {
          const on = active === o.slug;
          return (
            <button
              key={o.slug}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(o.slug)}
              className={`rounded-full px-4 py-2 text-[0.95rem] transition-colors ${
                on
                  ? "bg-forest text-sand"
                  : "text-forest shadow-[inset_0_0_0_1px_rgba(41,45,40,0.25)] hover:bg-forest/5"
              }`}
            >
              {o.name}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-forest/70">Nothing in this element yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10">
          <SignColumn items={filtered.slice(0, half)} />
          {filtered.length > 1 && <SignColumn items={filtered.slice(half)} />}
        </div>
      )}
    </div>
  );
}
