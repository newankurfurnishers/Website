"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ImagePicker, type Img } from "@/components/admin/image-uploader";
import { ItemListEditor, type ListItem } from "@/components/admin/item-list";
import { type SaveState, SaveMessage } from "@/components/admin/ui";
import type { AdminSector } from "@/lib/admin/data";
import { slugify } from "@/lib/slug";
import { deleteSector, saveSector, type SectorInput } from "./actions";

export function SectorEditor({ sector }: { sector: AdminSector | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<SaveState>({ status: "idle" });

  const [name, setName] = useState(sector?.name ?? "");
  const [slug, setSlug] = useState(sector?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(sector));
  const [tagline, setTagline] = useState(sector?.tagline ?? "");
  const [summary, setSummary] = useState(sector?.summary ?? "");
  const [body, setBody] = useState(sector?.body ?? "");
  const [highlights, setHighlights] = useState<ListItem[]>(sector?.highlights ?? []);
  const [image, setImage] = useState<Img>({ url: sector?.image_url ?? "", alt: sector?.image_alt ?? "" });
  const [seoTitle, setSeoTitle] = useState(sector?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(sector?.seo_description ?? "");
  const [published, setPublished] = useState(sector?.published ?? true);

  const effectiveSlug = slugEdited ? slug : slugify(name);

  const save = () => {
    const input: SectorInput = {
      id: sector?.id,
      slug: effectiveSlug,
      name,
      tagline,
      summary,
      body,
      highlights,
      image_url: image.url,
      image_alt: image.alt,
      seo_title: seoTitle,
      seo_description: seoDescription,
      published,
    };
    startTransition(async () => {
      const res = await saveSector(input);
      setState(res);
      if (res.status === "success") {
        router.push("/admin/expertise");
        router.refresh();
      }
    });
  };

  const remove = () => {
    if (!sector || !confirm(`Delete "${sector.name}"? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deleteSector(sector.id);
      if (res.status === "success") {
        router.push("/admin/expertise");
        router.refresh();
      } else {
        setState(res);
      }
    });
  };

  return (
    <div className="grid gap-6">
      <Card title="Basics">
        <Labeled label="Sector name">
          <input value={name} onChange={(e) => { setName(e.target.value); if (!slugEdited) setSlug(slugify(e.target.value)); }} className="admin-input" />
        </Labeled>
        <Labeled label="Web address (slug)" hint={`newankurfurnishers.in/expertise/${effectiveSlug || "…"}`}>
          <input value={effectiveSlug} onChange={(e) => { setSlugEdited(true); setSlug(slugify(e.target.value)); }} className="admin-input" />
        </Labeled>
        <Labeled label="Tagline">
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Summary">
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="admin-input" />
        </Labeled>
        <Labeled label="Full description (optional)">
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="admin-input" />
        </Labeled>
      </Card>

      <Card title="Highlights">
        <ItemListEditor items={highlights} onChange={setHighlights} addLabel="Add highlight" />
      </Card>

      <Card title="Image">
        <ImagePicker value={image} onChange={setImage} />
      </Card>

      <Card title="SEO">
        <Labeled label="Page title" hint="Leave blank to use the sector name.">
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Meta description">
          <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} className="admin-input" />
        </Labeled>
      </Card>

      <Card title="Visibility">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="size-4" />
          <span>Published (visible on the website)</span>
        </label>
      </Card>

      <SaveMessage state={state} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={pending} className="btn btn-dark disabled:opacity-60">
          {pending ? "Saving…" : sector ? "Save changes" : "Create sector"}
        </button>
        <button type="button" onClick={() => router.push("/admin/expertise")} className="btn btn-line text-forest">
          Cancel
        </button>
        {sector && (
          <button type="button" onClick={remove} disabled={pending} className="ml-auto text-sm text-walnut hover:underline">
            Delete sector
          </button>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 rounded-xl bg-white p-6">
      <h2 className="text-lg">{title}</h2>
      {children}
    </section>
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
