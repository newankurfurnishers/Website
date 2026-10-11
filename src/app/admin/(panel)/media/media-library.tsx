"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { uploadImageFile } from "@/components/admin/image-uploader";
import type { MediaItem } from "@/lib/admin/data";
import { deleteMedia, updateMediaAlt } from "./actions";

export function MediaLibrary({ media }: { media: MediaItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ id: string; message: string; usage?: string[] } | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setUploadError(null);
    try {
      await Promise.all(Array.from(files).map((f) => uploadImageFile(f)));
      router.refresh();
    } catch {
      setUploadError("Upload failed. Please use JPG, PNG or WebP under 10 MB.");
    } finally {
      setBusy(false);
    }
  };

  const saveAlt = (id: string, alt: string) => {
    startTransition(async () => {
      await updateMediaAlt(id, alt);
    });
  };

  const remove = (m: MediaItem) => {
    if (!confirm("Delete this image? This can't be undone.")) return;
    startTransition(async () => {
      const res = await deleteMedia(m.id, m.path, m.url);
      if (res.status === "success") {
        setNotice(null);
        router.refresh();
      } else {
        setNotice({ id: m.id, message: res.message ?? "Couldn't delete.", usage: res.usage });
      }
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="btn btn-dark disabled:opacity-60">
          {busy ? "Uploading…" : "Upload images"}
        </button>
        <span className="text-sm text-forest/55">Compressed to WebP automatically.</span>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      </div>
      {uploadError && <p className="mt-2 text-sm text-walnut">{uploadError}</p>}

      {media.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white px-5 py-10 text-center text-forest/60">
          No images yet. Upload your first photo.
        </p>
      ) : (
        <ul className={`mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${pending ? "opacity-80" : ""}`}>
          {media.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-xl bg-white">
              <div className="relative aspect-[4/3] bg-stone">
                <Image src={m.url} alt={m.alt} fill sizes="(min-width:1024px) 30vw, 45vw" className="object-cover" />
              </div>
              <div className="p-3">
                <input
                  defaultValue={m.alt}
                  placeholder="Describe this image"
                  onBlur={(e) => saveAlt(m.id, e.target.value)}
                  className="admin-input text-sm"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-forest/50">
                  <span>{m.width && m.height ? `${m.width}×${m.height}` : ""}</span>
                  <button type="button" onClick={() => remove(m)} className="text-walnut hover:underline">
                    Delete
                  </button>
                </div>
                {notice?.id === m.id && (
                  <div className="mt-2 rounded-lg bg-walnut/10 p-2 text-xs text-walnut">
                    <p>{notice.message}</p>
                    {notice.usage && (
                      <ul className="mt-1 list-disc pl-4">
                        {notice.usage.map((u) => (
                          <li key={u}>{u}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
