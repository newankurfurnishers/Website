"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AdminElement } from "@/lib/admin/data";
import { reorderElements } from "./actions";

export function ElementList({ elements }: { elements: AdminElement[] }) {
  const router = useRouter();
  const [items, setItems] = useState(elements);
  const [pending, startTransition] = useTransition();

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    startTransition(async () => {
      await reorderElements(next.map((e) => e.id));
      router.refresh();
    });
  };

  return (
    <ul className={`mt-6 divide-y divide-forest/10 overflow-hidden rounded-xl bg-white ${pending ? "opacity-70" : ""}`}>
      {items.map((el, i) => (
        <li key={el.id} className="flex items-center gap-3 px-4 py-3">
          <div className="flex flex-col">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-1 text-forest/50 hover:bg-stone disabled:opacity-25" aria-label="Move up">
              ↑
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded px-1 text-forest/50 hover:bg-stone disabled:opacity-25" aria-label="Move down">
              ↓
            </button>
          </div>
          <Link href={`/admin/philosophy/${el.id}`} className="min-w-0 flex-1">
            <span className="block font-medium hover:underline">
              {el.name} <span className="font-normal text-forest/50">· {el.sanskrit}</span>
            </span>
            <span className="block truncate text-sm text-forest/55">{el.tagline}</span>
          </Link>
          <Link href={`/admin/philosophy/${el.id}`} className="btn btn-line min-h-9 px-3 text-sm text-forest">
            Edit
          </Link>
        </li>
      ))}
    </ul>
  );
}
