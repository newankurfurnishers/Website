"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Sector } from "@/content/types";

const CLIPS = ["clip-grid", "clip-mosaic", "clip-panels"];

export function ExpertiseReveal({ sectors }: { sectors: Sector[] }) {
  const items = sectors.map((s, i) => ({
    ...s,
    num: String(i + 1).padStart(2, "0"),
    clipId: CLIPS[i % CLIPS.length],
  }));

  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reducedRef = useRef(false);

  const createLoop = (index: number) => {
    const item = items[index];
    if (!item) return;
    const selector = `#${item.clipId} .path`;
    tlRef.current?.kill();
    imageRef.current?.setAttribute("href", item.image_url);
    groupRef.current?.setAttribute("clip-path", `url(#${item.clipId})`);

    if (reducedRef.current) {
      gsap.set(selector, { scale: 1, transformOrigin: "50% 50%" });
      return;
    }
    gsap.set(selector, { scale: 0, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    tl.to(selector, { scale: 1, duration: 0.8, stagger: { amount: 0.4, from: "random" }, ease: "expo.out" })
      .to(selector, {
        scale: 1.05,
        duration: 1.5,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
        stagger: { amount: 0.2, from: "center" },
      })
      .to(selector, { scale: 0, duration: 0.6, stagger: { amount: 0.3, from: "edges" }, ease: "expo.in" });
    tlRef.current = tl;
  };

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => createLoop(0), containerRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preview = (i: number) => {
    if (i === active) return;
    setActive(i);
    createLoop(i);
  };

  return (
    <div ref={containerRef} className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
      <nav>
        <ul className="flex flex-col gap-7 sm:gap-9">
          {items.map((item, i) => (
            <li key={item.slug} onMouseEnter={() => preview(i)}>
              <Link
                href={`/expertise/${item.slug}`}
                onFocus={() => preview(i)}
                className="group flex items-start gap-4 sm:gap-6"
              >
                <span
                  className={`mt-1.5 font-display text-lg transition-all duration-500 ${
                    active === i ? "text-caramel" : "text-forest/35"
                  }`}
                >
                  {item.num}
                </span>
                <span
                  className={`font-sans text-2xl font-semibold uppercase leading-tight tracking-tight transition-all duration-500 sm:text-[2rem] ${
                    active === i ? "translate-x-1 text-forest" : "text-forest/30"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative flex items-center justify-center">
        <div className="absolute size-[110%] rounded-full bg-caramel/10 blur-[110px]" aria-hidden="true" />
        <svg viewBox="0 0 500 500" className="z-10 h-auto w-full max-w-[460px] drop-shadow-xl" role="img" aria-label={items[active]?.name}>
          <defs>
            {/* 3×3 grid */}
            <clipPath id="clip-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <rect key={i} className="path" x={(i % 3) * 160 + 20} y={Math.floor(i / 3) * 160 + 20} width="140" height="140" rx="6" />
              ))}
            </clipPath>
            {/* asymmetric mosaic */}
            <clipPath id="clip-mosaic">
              <rect className="path" x="20" y="20" width="200" height="280" rx="12" />
              <rect className="path" x="20" y="320" width="200" height="160" rx="12" />
              <rect className="path" x="240" y="20" width="240" height="140" rx="12" />
              <rect className="path" x="240" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="370" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="240" y="360" width="240" height="120" rx="12" />
            </clipPath>
            {/* vertical panels */}
            <clipPath id="clip-panels">
              {Array.from({ length: 4 }).map((_, i) => (
                <rect key={i} className="path" x={20 + i * 120} y="20" width="100" height="460" rx="12" />
              ))}
            </clipPath>
          </defs>
          <g ref={groupRef} clipPath={`url(#${items[0]?.clipId})`}>
            <image ref={imageRef} href={items[0]?.image_url} width="500" height="500" preserveAspectRatio="xMidYMid slice" />
          </g>
        </svg>
      </div>
    </div>
  );
}
