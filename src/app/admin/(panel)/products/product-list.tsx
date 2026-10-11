"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { CategoryIcon } from "@/components/category-icon";
import type { AdminCategory } from "@/lib/admin/data";
import { reorderCategories, setCategoryPublished } from "./actions";

export function ProductList({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter();
  const [items, setItems] = useState(categories);
  const [pending, startTransition] = useTransition();

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    startTransition(async () => {
      await reorderCategories(next.map((c) => c.id));
      router.refresh();
    });
  };

  const togglePublished = (id: string, next: boolean) => {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, published: next } : c)));
    startTransition(async () => {
      await setCategoryPublished(id, next);
      router.refresh();
    });
  };

  if (items.length === 0) {
    return (
      <p className="mt-6 rounded-xl bg-white px-5 py-10 text-center text-forest/60">
        No products yet. Add your first one.
      </p>
    );
  }

  return (
    <ul className={`mt-6 divide-y divide-forest/10 overflow-hidden rounded-xl bg-white ${pending ? "opacity-70" : ""}`}>
      {items.map((c, i) => (
        <li key={c.id} className="flex items-center gap-3 px-4 py-3">
          <div className="flex flex-col">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-1 text-forest/50 hover:bg-stone disabled:opacity-25" aria-label="Move up">
              ↑
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded px-1 text-forest/50 hover:bg-stone disabled:opacity-25" aria-label="Move down">
              ↓
            </button>
          </div>
          <CategoryIcon name={c.icon ?? "layers"} className="size-7 shrink-0 text-forest/70" />
          <Link href={`/admin/products/${c.id}`} className="min-w-0 flex-1">
            <span className="block font-medium hover:underline">{c.name}</span>
            <span className="block truncate text-sm text-forest/55">/products/{c.slug}</span>
          </Link>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-forest/70">
            <input
              type="checkbox"
              checked={c.published}
              onChange={(e) => togglePublished(c.id, e.target.checked)}
              className="size-4"
            />
            <span className="hidden sm:inline">{c.published ? "Published" : "Hidden"}</span>
          </label>
          <Link href={`/admin/products/${c.id}`} className="btn btn-line min-h-9 px-3 text-sm text-forest">
            Edit
          </Link>
        </li>
      ))}
    </ul>
  );
}
