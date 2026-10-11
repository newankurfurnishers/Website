"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ImagePicker, type Img } from "@/components/admin/image-uploader";
import { ItemListEditor, type ListItem } from "@/components/admin/item-list";
import { type SaveState, SaveMessage } from "@/components/admin/ui";
import type { AdminSection } from "@/lib/admin/data";
import { saveSection, type SectionInput } from "./actions";

export function SectionEditor({ section }: { section: AdminSection }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<SaveState>({ status: "idle" });

  const [eyebrow, setEyebrow] = useState(section.eyebrow ?? "");
  const [heading, setHeading] = useState(section.heading ?? "");
  const [body, setBody] = useState(section.body ?? "");
  const [image, setImage] = useState<Img>({ url: section.image_url ?? "", alt: section.image_alt ?? "" });
  const [ctaLabel, setCtaLabel] = useState(section.cta_label ?? "");
  const [ctaHref, setCtaHref] = useState(section.cta_href ?? "");
  const [items, setItems] = useState<ListItem[]>(section.items ?? []);
  const [published, setPublished] = useState(section.published);

  const save = () => {
    const input: SectionInput = {
      id: section.id,
      eyebrow,
      heading,
      body,
      image_url: image.url,
      image_alt: image.alt,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      items,
      published,
    };
    startTransition(async () => {
      const res = await saveSection(input);
      setState(res);
      if (res.status === "success") {
        router.push("/admin/pages");
        router.refresh();
      }
    });
  };

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-xl bg-white p-6">
        <Labeled label="Eyebrow" hint="Small label above the heading (optional).">
          <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Heading">
          <input value={heading} onChange={(e) => setHeading(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Body" hint="Use a blank line to separate paragraphs.">
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="admin-input" />
        </Labeled>
      </section>

      <section className="grid gap-4 rounded-xl bg-white p-6">
        <h2 className="text-lg">Button</h2>
        <Labeled label="Button label" hint="Leave blank for no button.">
          <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Button link" hint="e.g. /products or /contact">
          <input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} className="admin-input" />
        </Labeled>
      </section>

      <section className="grid gap-4 rounded-xl bg-white p-6">
        <h2 className="text-lg">Image</h2>
        <ImagePicker value={image} onChange={setImage} />
      </section>

      <section className="grid gap-4 rounded-xl bg-white p-6">
        <h2 className="text-lg">List items</h2>
        <p className="text-sm text-forest/55">Used by sections that show a list (e.g. &ldquo;Why choose us&rdquo;).</p>
        <ItemListEditor items={items} onChange={setItems} addLabel="Add item" />
      </section>

      <section className="grid gap-4 rounded-xl bg-white p-6">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="size-4" />
          <span>Published (visible on the website)</span>
        </label>
      </section>

      <SaveMessage state={state} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={pending} className="btn btn-dark disabled:opacity-60">
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={() => router.push("/admin/pages")} className="btn btn-line text-forest">
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
