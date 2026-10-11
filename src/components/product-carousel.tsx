"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { CategoryIcon } from "@/components/category-icon";
import type { Category } from "@/content/types";

const AUTO_PLAY_MS = 3500;
const ITEM_HEIGHT = 60; // px, vertical spacing of chips

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

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export function ProductCarousel({ categories }: { categories: Category[] }) {
  const reduced = usePrefersReducedMotion();
  const n = categories.length;
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const currentIndex = ((step % n) + n) % n;
  const next = useCallback(() => setStep((s) => s + 1), []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [paused, reduced, next]);

  const goTo = (index: number) => {
    const diff = (index - currentIndex + n) % n;
    if (diff !== 0) setStep((s) => s + diff);
  };

  const status = (index: number) => {
    const len = n;
    let d = index - currentIndex;
    if (d > len / 2) d -= len;
    if (d < -len / 2) d += len;
    if (d === 0) return "active" as const;
    if (d === -1) return "prev" as const;
    if (d === 1) return "next" as const;
    return "hidden" as const;
  };

  const trans = reduced ? "none" : "transform 0.6s var(--ease-out-soft), opacity 0.6s var(--ease-out-soft)";

  return (
    <div
      className="overflow-hidden rounded-[2rem] border border-forest/10 lg:rounded-[3rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex min-h-[560px] flex-col lg:min-h-[32rem] lg:flex-row">
        {/* Left: rotating chip list */}
        <div className="relative z-10 flex min-h-[320px] w-full items-center overflow-hidden bg-walnut px-6 sm:px-10 lg:w-[42%] lg:px-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-walnut to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-walnut to-transparent" />
          <div className="relative flex w-full items-center justify-center lg:justify-start">
            {categories.map((c, index) => {
              const d = wrap(-(n / 2), n / 2, index - currentIndex);
              const active = index === currentIndex;
              return (
                <div
                  key={c.slug}
                  className="absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0"
                  style={{
                    height: ITEM_HEIGHT,
                    transform: `translateY(${d * ITEM_HEIGHT}px)`,
                    opacity: Math.max(0, 1 - Math.abs(d) * 0.26),
                    transition: trans,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-current={active ? "true" : undefined}
                    className={`flex items-center gap-3 rounded-full border px-5 py-3 text-left transition-colors duration-500 ${
                      active
                        ? "border-sand bg-sand text-walnut"
                        : "border-sand/20 bg-transparent text-sand/60 hover:border-sand/40 hover:text-sand"
                    }`}
                  >
                    <CategoryIcon name={c.icon} className="size-5 shrink-0" />
                    <span className="whitespace-nowrap text-sm tracking-tight">{c.name}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: image card stack */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden border-t border-forest/10 bg-stone px-6 py-14 lg:border-l lg:border-t-0 lg:py-10">
          <div className="relative aspect-[4/5] w-full max-w-[22rem]">
            {categories.map((c, index) => {
              const st = status(index);
              const active = st === "active";
              const x = st === "active" ? 0 : st === "prev" ? -90 : st === "next" ? 90 : 0;
              const scale = active ? 1 : st === "prev" || st === "next" ? 0.85 : 0.7;
              const opacity = active ? 1 : st === "prev" || st === "next" ? 0.4 : 0;
              const rotate = st === "prev" ? -3 : st === "next" ? 3 : 0;
              const z = active ? 20 : st === "prev" || st === "next" ? 10 : 0;
              return (
                <div
                  key={c.slug}
                  className="absolute inset-0 overflow-hidden rounded-[1.75rem] border-[6px] border-white bg-white"
                  style={{
                    transform: `translateX(${x}px) scale(${scale}) rotate(${rotate}deg)`,
                    opacity,
                    zIndex: z,
                    pointerEvents: active ? "auto" : "none",
                    transition: trans,
                  }}
                  aria-hidden={active ? undefined : true}
                >
                  <Image
                    src={c.hero_image_url}
                    alt={c.hero_image_alt}
                    fill
                    sizes="(min-width: 1024px) 24rem, 90vw"
                    className={`object-cover transition-all duration-700 ${active ? "" : "grayscale brightness-75 blur-[2px]"}`}
                  />
                  {active && (
                    <Link href={`/products/${c.slug}`} className="absolute inset-0 flex flex-col justify-end">
                      <span className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-forest-deep/90 via-forest-deep/40 to-transparent" />
                      <div className="relative z-10 p-7">
                        <span className="inline-block rounded-full border border-white/40 bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-forest">
                          {index + 1} · {c.name}
                        </span>
                        <p className="mt-3 font-display text-2xl leading-tight text-sand drop-shadow">{c.tagline}</p>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
