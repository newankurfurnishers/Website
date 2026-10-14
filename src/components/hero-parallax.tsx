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
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-stone">
      <div className="relative min-h-[calc(100svh-4.5rem)]">
        {/* Parallax image layer — oversized so the drift never reveals an edge */}
        <div ref={layerRef} className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
          {imageUrl && (
            <Image src={imageUrl} alt={imageAlt ?? ""} fill priority sizes="100vw" className="object-cover" />
          )}
        </div>

        {/* Legibility scrim: lighten the left for the text, let the scene breathe on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone/70 via-stone/25 to-transparent lg:from-stone/55 lg:via-stone/10" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-stone/35 to-transparent" />

        {/* Content */}
        <div className="relative flex min-h-[calc(100svh-4.5rem)] flex-col justify-center px-5 py-16 sm:px-10 lg:py-24 lg:pl-[max(2.5rem,calc((100vw-82rem)/2+2.5rem))] lg:pr-14">
          <div className="hero-rise max-w-[42rem]">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.3em] text-walnut sm:text-sm">{eyebrow}</p>
            )}
            <h1 className="mt-5 text-[clamp(3rem,6.2vw,5.75rem)] leading-[0.98] text-forest">
              {lead}
              {accent && (
                <>
                  {lead && " "}
                  <em className="italic text-caramel">{accent}</em>
                </>
              )}
            </h1>
            {body && <p className="mt-6 max-w-[36ch] text-lg text-forest/75">{body}</p>}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {ctaHref && (
                <Link href={ctaHref} className="btn btn-dark">
                  {ctaLabel}
                </Link>
              )}
              <Link href="/contact" className="btn btn-line text-forest">
                Make an enquiry
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
