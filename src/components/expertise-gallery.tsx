"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Sector } from "@/content/types";

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

// Faint caramel line drift, drawn only while a card is hovered.
function HoverCanvas({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = 400;
    canvas.height = 400;
    const lines = Array.from({ length: 26 }, () => ({
      x: Math.random() * 400,
      y: Math.random() * 400,
      speed: Math.random() * 0.5 + 0.1,
      angle: Math.random() * Math.PI * 2,
      len: Math.random() * 20 + 5,
    }));
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, 400, 400);
      if (active) {
        for (const l of lines) {
          l.x += Math.cos(l.angle) * l.speed;
          l.y += Math.sin(l.angle) * l.speed;
          if (l.x < 0 || l.x > 400 || l.y < 0 || l.y > 400) {
            l.x = Math.random() * 400;
            l.y = Math.random() * 400;
          }
          ctx.beginPath();
          ctx.moveTo(l.x, l.y);
          ctx.lineTo(l.x - Math.cos(l.angle) * l.len, l.y - Math.sin(l.angle) * l.len);
          ctx.strokeStyle = `rgba(196,137,90,${Math.random() * 0.3 + 0.1})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
    />
  );
}

function Card({ sector, motion }: { sector: Sector; motion: boolean }) {
  const [hover, setHover] = useState(false);
  const inner = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!motion || !inner.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    inner.current.style.transform = `rotateX(${-py * 8}deg) rotateY(${px * 8}deg)`;
  };
  const reset = () => {
    setHover(false);
    if (inner.current) inner.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <Link
      href={`/expertise/${sector.slug}`}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={reset}
      className="exp-card group block [perspective:1000px]"
    >
      <div
        ref={inner}
        className="relative h-80 overflow-hidden rounded-xl bg-forest-deep ring-1 ring-sand/10 transition-transform duration-300 ease-[var(--ease-out-soft)] [transform-style:preserve-3d]"
      >
        <Image
          src={sector.image_url}
          alt={sector.image_alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-105"
        />
        {motion && <HoverCanvas active={hover} />}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/35 to-transparent" />
        <span className="absolute right-4 top-4 text-sand opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6 [transform:translateZ(40px)]">
          <h3 className="font-display text-2xl text-sand">{sector.name}</h3>
          <p className="mt-1 max-h-0 overflow-hidden text-sand/75 opacity-0 transition-all duration-300 group-hover:mt-1.5 group-hover:max-h-20 group-hover:opacity-100">
            {sector.tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function ExpertiseGallery({ sectors }: { sectors: Sector[] }) {
  const reduced = usePrefersReducedMotion();
  const motion = !reduced;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !motion) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".exp-card"));
    cards.forEach((el) => el.classList.add("exp-pre"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.remove("exp-pre");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2 },
    );
    cards.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i, 5) * 80}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, [motion]);

  return (
    <div ref={rootRef} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {sectors.map((sec) => (
        <Card key={sec.slug} sector={sec} motion={motion} />
      ))}
    </div>
  );
}
