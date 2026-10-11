"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AdminSector } from "@/lib/admin/data";
import { reorderSectors, setSectorPublished } from "./actions";

export function SectorList({ sectors }: { sectors: AdminSector[] }) {
  const router = useRouter();
  const [items, setItems] = useState(sectors);
  const [pending, startTransition] = useTransition();

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    startTransition(async () => {
      await reorderSectors(next.map((s) => s.id));
      router.refresh();
    });
  };

  const togglePublished = (id: string, next: boolean) => {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, published: next } : s)));
    startTransition(async () => {
      await setSectorPublished(id, next);
      router.refresh();
    });
  };

  if (items.length === 0) {
    return <p className="mt-6 rounded-xl bg-white px-5 py-10 text-center text-forest/60">No sectors yet.</p>;
  }

  return (
    <ul className={`mt-6 divide-y divide-forest/10 overflow-hidden rounded-xl bg-white ${pending ? "opacity-70" : ""}`}>
      {items.map((s, i) => (
        <li key={s.id} className="flex items-center gap-3 px-4 py-3">
          <div className="flex flex-col">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-1 text-forest/50 hover:bg-stone disabled:opacity-25" aria-label="Move up">
              ↑
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded px-1 text-forest/50 hover:bg-stone disabled:opacity-25" aria-label="Move down">
              ↓
            </button>
          </div>
          <Link href={`/admin/expertise/${s.id}`} className="min-w-0 flex-1">
            <span className="block font-medium hover:underline">{s.name}</span>
            <span className="block truncate text-sm text-forest/55">{s.tagline ?? `/expertise/${s.slug}`}</span>
          </Link>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-forest/70">
            <input type="checkbox" checked={s.published} onChange={(e) => togglePublished(s.id, e.target.checked)} className="size-4" />
            <span className="hidden sm:inline">{s.published ? "Published" : "Hidden"}</span>
          </label>
          <Link href={`/admin/expertise/${s.id}`} className="btn btn-line min-h-9 px-3 text-sm text-forest">
            Edit
          </Link>
        </li>
      ))}
    </ul>
  );
}
