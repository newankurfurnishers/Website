"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export type Img = { url: string; alt: string };

const MAX = 2000; // longest edge, px

async function compressToWebp(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  if (width > MAX || height > MAX) {
    const scale = MAX / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", 0.82));
  if (!blob) throw new Error("Could not process the image");
  return { blob, width, height };
}

/** Compress an image to WebP, upload to the media bucket, record it, and return its public URL. */
export async function uploadImageFile(file: File): Promise<string> {
  const supabase = createBrowserSupabase();
  const { blob, width, height } = await compressToWebp(file);
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const up = await supabase.storage.from("media").upload(path, blob, { contentType: "image/webp" });
  if (up.error) throw up.error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  const url = data.publicUrl;
  await supabase.from("media").insert({ path, url, width, height, alt: "" });
  return url;
}

function useUpload() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (files: FileList | null, onDone: (urls: string[]) => void) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadImageFile(f)));
      onDone(urls);
    } catch {
      setError("Upload failed. Please use JPG, PNG or WebP under 10 MB.");
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run };
}

/** Single image with alt text (e.g. a hero image). */
export function ImagePicker({ value, onChange }: { value: Img; onChange: (v: Img) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useUpload();

  return (
    <div className="rounded-lg border border-forest/15 p-4">
      <div className="flex items-start gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-stone">
          {value.url ? (
            <Image src={value.url} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <span className="grid h-full place-items-center text-xs text-forest/40">No image</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="btn btn-line min-h-10 px-4 text-sm text-forest disabled:opacity-60"
            >
              {busy ? "Uploading…" : value.url ? "Replace" : "Upload image"}
            </button>
            {value.url && (
              <button
                type="button"
                onClick={() => onChange({ url: "", alt: "" })}
                className="btn btn-line min-h-10 px-4 text-sm text-walnut"
              >
                Remove
              </button>
            )}
          </div>
          <input
            type="text"
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="Describe the image (for accessibility)"
            className="admin-input mt-2"
          />
          {error && <p className="mt-1 text-sm text-walnut">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => run(e.target.files, (urls) => onChange({ url: urls[0], alt: value.alt }))}
      />
    </div>
  );
}

/** Ordered gallery of images with alt text. */
export function GalleryEditor({ images, onChange }: { images: Img[]; onChange: (v: Img[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useUpload();

  const update = (i: number, patch: Partial<Img>) =>
    onChange(images.map((im, idx) => (idx === i ? { ...im, ...patch } : im)));
  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {images.map((im, i) => (
          <li key={`${im.url}-${i}`} className="rounded-lg border border-forest/15 p-3">
            <div className="flex gap-3">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-stone">
                <Image src={im.url} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={im.alt}
                  onChange={(e) => update(i, { alt: e.target.value })}
                  placeholder="Describe this image"
                  className="admin-input"
                />
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-2 py-1 hover:bg-stone disabled:opacity-30" aria-label="Move up">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="rounded px-2 py-1 hover:bg-stone disabled:opacity-30" aria-label="Move down">
                    ↓
                  </button>
                  <button type="button" onClick={() => remove(i)} className="ml-auto rounded px-2 py-1 text-walnut hover:bg-stone">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="btn btn-line mt-3 min-h-10 px-4 text-sm text-forest disabled:opacity-60"
      >
        {busy ? "Uploading…" : "Add images"}
      </button>
      {error && <p className="mt-1 text-sm text-walnut">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => run(e.target.files, (urls) => onChange([...images, ...urls.map((url) => ({ url, alt: "" }))]))}
      />
    </div>
  );
}
