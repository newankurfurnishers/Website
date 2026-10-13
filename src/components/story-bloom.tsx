"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function StoryBloom({
  eyebrow,
  heading,
  body,
  ctaLabel = "Our story",
  ctaHref = "/about",
}: {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maxDepth = 9;
    const mouse = { x: 0, y: 0, active: false };
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#1f221e";
      ctx.fillRect(0, 0, w, h);
      mouse.x = w / 2;
      mouse.y = h;
    };

    const drawBranch = (x: number, y: number, angle: number, length: number, depth: number, grown: number) => {
      if (depth > grown || length < 1) return;
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      const fade = 1 - depth / maxDepth;
      ctx.strokeStyle = `rgba(208,180,149,${fade * 0.75})`;
      ctx.lineWidth = Math.max(0.4, 1.6 - (depth / maxDepth) * 1.2);
      ctx.stroke();

      const dist = Math.hypot(endX - mouse.x, endY - mouse.y);
      const effect = mouse.active ? Math.max(0, 1 - dist / (h / 2)) : 0;
      const offset = (Math.PI / 8) * effect;
      drawBranch(endX, endY, angle - Math.PI / 10 - offset, length * 0.8, depth + 1, grown);
      drawBranch(endX, endY, angle + Math.PI / 10 + offset, length * 0.8, depth + 1, grown);
    };

    let raf = 0;
    let grown = 0;

    const frame = () => {
      ctx.fillStyle = "rgba(31,34,30,0.16)"; // forest-deep trail fade
      ctx.fillRect(0, 0, w, h);
      drawBranch(w / 2, h, -Math.PI / 2, h / 5, 0, grown);
      if (grown < maxDepth) grown += 0.03;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    if (reduced) {
      // Draw a single full-grown tree, no animation or interaction.
      ctx.fillStyle = "#1f221e";
      ctx.fillRect(0, 0, w, h);
      drawBranch(w / 2, h, -Math.PI / 2, h / 5, 0, maxDepth);
    } else {
      frame();
      window.addEventListener("resize", resize);
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[88svh] items-center justify-center overflow-hidden bg-forest-deep py-24"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/20 to-transparent" />

      <div className="container-site relative z-10 text-center">
        <p
          className="story-up inline-flex items-center gap-2 rounded-full border border-sand/20 bg-sand/10 px-4 py-1.5 text-sm text-sand/85 backdrop-blur-sm"
          style={{ animationDelay: "1.1s" }}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 21V9" />
            <path d="M12 13c-4 0-6-3-6-6 3.5 0 6 2 6 6Z" />
            <path d="M12 11c3.3 0 5-2.4 5-5-3 0-5 1.8-5 5Z" />
          </svg>
          {eyebrow || "Rooted in Patna since 1984"}
        </p>
        <h2
          className="story-up mx-auto mt-6 max-w-[20ch] text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.05] text-sand"
          style={{ animationDelay: "1.25s" }}
        >
          {heading}
        </h2>
        {body && (
          <p className="story-up mx-auto mt-6 max-w-[52ch] text-lg text-sand/75" style={{ animationDelay: "1.4s" }}>
            {body}
          </p>
        )}
        <div className="story-up mt-10" style={{ animationDelay: "1.55s" }}>
          <Link href={ctaHref} className="btn btn-solid">
            {ctaLabel}
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
