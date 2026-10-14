"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Props = {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

const SCROLL_K = 0.22; // how much slower the image moves than the page
const SCROLL_MAX = 70; // px — cap so the image edge never shows
const MOUSE_K = 8; // px of drift from cursor movement

export function HeroParallax({ eyebrow, heading, body, ctaLabel, ctaHref, imageUrl, imageAlt }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    if (!section || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let mx = 0;
    let my = 0; // cursor target offset
    let cx = 0;
    let cy = 0; // eased current offset

    const render = () => {
      raf = 0;
      const top = section.getBoundingClientRect().top;
      const scrollShift = Math.min(SCROLL_MAX, Math.max(0, -top) * SCROLL_K);
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      layer.style.transform = `translate3d(${cx.toFixed(2)}px, ${(scrollShift + cy).toFixed(2)}px, 0) scale(1.06)`;
      if (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1) schedule();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onScroll = () => schedule();
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * -MOUSE_K;
      my = (e.clientY / window.innerHeight - 0.5) * -MOUSE_K;
      schedule();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    schedule();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const words = (heading ?? "").trim().split(" ");
  const accent = words.length > 1 ? words.pop() : null;
  const lead = words.join(" ");

  return (
    <section ref={sectionRef} className="relative isolate -mt-[4.5rem] overflow-hidden bg-stone">
      <div className="relative min-h-[100svh]">
        {/* Parallax image layer — oversized so the drift never reveals an edge */}
        <div ref={layerRef} className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
          {imageUrl && (
            <Image src={imageUrl} alt={imageAlt ?? ""} fill priority sizes="100vw" className="object-cover" />
          )}
        </div>

        {/* Legibility scrims: lighten the left for the text, a soft band up top for the floating nav */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone/75 via-stone/30 to-transparent lg:from-stone/60 lg:via-stone/10" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-stone/70 via-stone/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-stone/35 to-transparent" />

        {/* Content */}
        <div className="relative flex min-h-[100svh] flex-col justify-center px-5 pb-16 pt-[7rem] sm:px-10 lg:pb-24 lg:pt-[8rem] lg:pl-[max(2.5rem,calc((100vw-82rem)/2+2.5rem))] lg:pr-14">
          <div className="hero-rise max-w-[40rem]">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.3em] text-walnut/70 sm:text-sm">{eyebrow}</p>
            )}
            <h1 className="font-hero mt-6 text-[clamp(3.25rem,6.6vw,6rem)] font-medium leading-[0.96] text-walnut">
              {lead}
              {accent && (
                <>
                  {lead && <br />}
                  <em className="italic text-[#a35d35]">{accent}</em>
                </>
              )}
            </h1>
            {body && <p className="mt-7 max-w-[32ch] text-lg leading-relaxed text-walnut/80">{body}</p>}

            <div className="mt-11 flex flex-wrap items-center gap-x-9 gap-y-5">
              {ctaHref && (
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-walnut"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-walnut/40 transition-colors duration-300 group-hover:border-walnut group-hover:bg-walnut group-hover:text-stone">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {ctaLabel ?? "Explore"}
                </Link>
              )}
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-walnut/90"
              >
                Enquire
                <span className="h-px w-6 bg-walnut/50 transition-all duration-300 group-hover:w-10 group-hover:bg-walnut" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
