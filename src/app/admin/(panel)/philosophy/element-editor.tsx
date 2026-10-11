"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ImagePicker, type Img } from "@/components/admin/image-uploader";
import { type SaveState, SaveMessage } from "@/components/admin/ui";
import type { AdminElement } from "@/lib/admin/data";
import { type ElementInput, saveElement } from "./actions";

export function ElementEditor({ element }: { element: AdminElement }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<SaveState>({ status: "idle" });

  const [name, setName] = useState(element.name);
  const [sanskrit, setSanskrit] = useState(element.sanskrit ?? "");
  const [tagline, setTagline] = useState(element.tagline ?? "");
  const [description, setDescription] = useState(element.description ?? "");
  const [image, setImage] = useState<Img>({ url: element.image_url ?? "", alt: element.image_alt ?? "" });

  const save = () => {
    const input: ElementInput = {
      id: element.id,
      name,
      sanskrit,
      tagline,
      description,
      image_url: image.url,
      image_alt: image.alt,
    };
    startTransition(async () => {
      const res = await saveElement(input);
      setState(res);
      if (res.status === "success") {
        router.push("/admin/philosophy");
        router.refresh();
      }
    });
  };

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-xl bg-white p-6">
        <p className="text-sm text-forest/55">
          Web anchor: <code className="rounded bg-stone px-1.5 py-0.5">/philosophy#{element.slug}</code> (fixed)
        </p>
        <Labeled label="Name (English)">
          <input value={name} onChange={(e) => setName(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Sanskrit name">
          <input value={sanskrit} onChange={(e) => setSanskrit(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Tagline" hint="e.g. What holds you">
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="admin-input" />
        </Labeled>
      </section>

      <section className="grid gap-4 rounded-xl bg-white p-6">
        <h2 className="text-lg">Image</h2>
        <ImagePicker value={image} onChange={setImage} />
      </section>

      <SaveMessage state={state} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={pending} className="btn btn-dark disabled:opacity-60">
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={() => router.push("/admin/philosophy")} className="btn btn-line text-forest">
          Cancel
        </button>
      </div>
    </div>
  );
}

function Labeled({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-forest/55">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
