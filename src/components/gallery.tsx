"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CategoryImage } from "@/content/types";

export function Gallery({ images }: { images: CategoryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  if (images.length === 0) return null;
  const current = open === null ? null : images[open];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((im, i) => (
          <li key={im.url}>
            <button
              type="button"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setOpen(i);
              }}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-sand"
              aria-label={`View larger: ${im.alt || `image ${i + 1}`}`}
            >
              <Image
                src={im.url}
                alt={im.alt}
                fill
                sizes="(min-width: 640px) 30vw, 45vw"
                className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 flex flex-col bg-forest-deep/95 p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="grid size-11 place-items-center rounded-full text-sand hover:bg-sand/10"
            >
              <span className="sr-only">Close</span>
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center gap-2 sm:gap-4">
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => step(-1)}
                className="grid size-11 shrink-0 place-items-center rounded-full text-sand hover:bg-sand/10"
              >
                <span className="sr-only">Previous image</span>
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
            )}
            <div className="relative h-full min-h-0 w-full">
              <Image
                src={current.url}
                alt={current.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => step(1)}
                className="grid size-11 shrink-0 place-items-center rounded-full text-sand hover:bg-sand/10"
              >
                <span className="sr-only">Next image</span>
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          {current.alt && <p className="mt-3 text-center text-sm text-sand/80">{current.alt}</p>}
        </div>
      )}
    </>
  );
}
