"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { NatureElement } from "@/content/types";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function PhilosophyAccordion({ elements }: { elements: NatureElement[] }) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  return (
    <ul className="flex h-[360px] gap-2 sm:h-[460px] sm:gap-3" aria-label="The five elements">
      {elements.map((el, i) => {
        const on = i === active;
        return (
          <li
            key={el.slug}
            onMouseEnter={() => setActive(i)}
            style={{
              flexGrow: on ? 6 : 1,
              flexBasis: 0,
              transition: reduced ? "none" : "flex-grow 0.6s var(--ease-out-soft)",
            }}
            className="relative min-w-0 overflow-hidden rounded-[1.25rem] ring-1 ring-sand/15"
          >
            <Link
              href={`/philosophy#${el.slug}`}
              onFocus={() => setActive(i)}
              aria-label={`${el.name} (${el.sanskrit}) — read our philosophy`}
              className="group block h-full w-full"
            >
              <Image
                src={el.image_url}
                alt={el.image_alt ?? el.name}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/20 to-transparent" />

              {/* Collapsed: vertical name. Active: horizontal name + sanskrit. */}
              {on ? (
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block font-display text-2xl text-sand sm:text-3xl">{el.name}</span>
                  <span className="mt-0.5 block text-sm text-sand/70">
                    {el.sanskrit} · {el.tagline}
                  </span>
                </span>
              ) : (
                <span className="absolute bottom-5 left-1/2 block -translate-x-1/2 rotate-180 whitespace-nowrap font-display text-lg text-sand/90 [writing-mode:vertical-rl] sm:text-xl">
                  {el.name}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
