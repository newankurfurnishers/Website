"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GalleryEditor, type Img, ImagePicker } from "@/components/admin/image-uploader";
import { type SaveState, SaveMessage } from "@/components/admin/ui";
import { CategoryIcon, iconKeys } from "@/components/category-icon";
import type { AdminCategory } from "@/lib/admin/data";
import { slugify } from "@/lib/slug";
import { type CategoryInput, deleteCategory, saveCategory } from "./actions";

type Option = { slug: string; name: string };

export function CategoryEditor({
  category,
  elementOptions,
  sectorOptions,
}: {
  category: AdminCategory | null;
  elementOptions: Option[];
  sectorOptions: Option[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<SaveState>({ status: "idle" });

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(category));
  const [tagline, setTagline] = useState(category?.tagline ?? "");
  const [icon, setIcon] = useState(category?.icon ?? iconKeys[0]);
  const [intro, setIntro] = useState(category?.intro ?? "");
  const [body, setBody] = useState(category?.body ?? "");
  const [subtypes, setSubtypes] = useState<string[]>(category?.subtypes ?? []);
  const [element, setElement] = useState<string>(category?.element ?? "");
  const [sectors, setSectors] = useState<string[]>(category?.sectors ?? []);
  const [hero, setHero] = useState<Img>({
    url: category?.hero_image_url ?? "",
    alt: category?.hero_image_alt ?? "",
  });
  const [images, setImages] = useState<Img[]>(category?.images ?? []);
  const [seoTitle, setSeoTitle] = useState(category?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(category?.seo_description ?? "");
  const [published, setPublished] = useState(category?.published ?? true);

  const effectiveSlug = slugEdited ? slug : slugify(name);

  const onNameChange = (v: string) => {
    setName(v);
    if (!slugEdited) setSlug(slugify(v));
  };

  const save = () => {
    const input: CategoryInput = {
      id: category?.id,
      slug: effectiveSlug,
      name,
      tagline,
      icon,
      intro,
      body,
      subtypes,
      element: element || null,
      sectors,
      hero_image_url: hero.url,
      hero_image_alt: hero.alt,
      images,
      seo_title: seoTitle,
      seo_description: seoDescription,
      published,
    };
    startTransition(async () => {
      const res = await saveCategory(input);
      setState(res);
      if (res.status === "success") {
        router.push("/admin/products");
        router.refresh();
      }
    });
  };

  const remove = () => {
    if (!category || !confirm(`Delete "${category.name}"? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deleteCategory(category.id);
      if (res.status === "success") {
        router.push("/admin/products");
        router.refresh();
      } else {
        setState(res);
      }
    });
  };

  return (
    <div className="grid gap-6">
      <Card title="Basics">
        <Labeled label="Product name">
          <input value={name} onChange={(e) => onNameChange(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Web address (slug)" hint={`newankurfurnishers.in/products/${effectiveSlug || "…"}`}>
          <input
            value={effectiveSlug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(slugify(e.target.value));
            }}
            className="admin-input"
          />
        </Labeled>
        <Labeled label="Tagline">
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="admin-input" />
        </Labeled>
        <Labeled label="Icon">
          <div className="flex flex-wrap gap-2">
            {iconKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setIcon(key)}
                aria-pressed={icon === key}
                aria-label={key}
                className={`grid size-11 place-items-center rounded-lg border ${
                  icon === key ? "border-forest bg-forest text-sand" : "border-forest/15 text-forest hover:bg-stone"
                }`}
              >
                <CategoryIcon name={key} className="size-6" />
              </button>
            ))}
          </div>
        </Labeled>
        <Labeled label="Intro">
          <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={3} className="admin-input" />
        </Labeled>
        <Labeled label="Full description (optional)">
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="admin-input" />
        </Labeled>
      </Card>

      <Card title="Sub-types">
        <StringList values={subtypes} onChange={setSubtypes} placeholder="e.g. Blackout curtains" addLabel="Add sub-type" />
      </Card>

      <Card title="Element & sectors">
        <Labeled label="Element">
          <select value={element} onChange={(e) => setElement(e.target.value)} className="admin-input">
            <option value="">None</option>
            {elementOptions.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </Labeled>
        <fieldset>
          <legend className="text-sm font-medium">Sectors served</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {sectorOptions.map((o) => (
              <label key={o.slug} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sectors.includes(o.slug)}
                  onChange={(e) =>
                    setSectors((prev) => (e.target.checked ? [...prev, o.slug] : prev.filter((s) => s !== o.slug)))
                  }
                  className="size-4"
                />
                {o.name}
              </label>
            ))}
          </div>
        </fieldset>
      </Card>

      <Card title="Hero image">
        <ImagePicker value={hero} onChange={setHero} />
      </Card>

      <Card title="Gallery">
        <GalleryEditor images={images} onChange={setImages} />
      </Card>

      <Card title="SEO">
        <Labeled label="Page title" hint="Leave blank to use the product name.">
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
          {pending ? "Saving…" : category ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="btn btn-line text-forest">
          Cancel
        </button>
        {category && (
          <button type="button" onClick={remove} disabled={pending} className="ml-auto text-sm text-walnut hover:underline">
            Delete product
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

function StringList({
  values,
  onChange,
  placeholder,
  addLabel,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="grid gap-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            value={v}
            onChange={(e) => onChange(values.map((x, idx) => (idx === i ? e.target.value : x)))}
            placeholder={placeholder}
            className="admin-input"
          />
          <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-2 py-2 hover:bg-stone disabled:opacity-30" aria-label="Move up">
            ↑
          </button>
          <button type="button" onClick={() => move(i, 1)} disabled={i === values.length - 1} className="rounded px-2 py-2 hover:bg-stone disabled:opacity-30" aria-label="Move down">
            ↓
          </button>
          <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} className="rounded px-2 py-2 text-walnut hover:bg-stone" aria-label="Remove">
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...values, ""])} className="btn btn-line min-h-10 w-fit px-4 text-sm text-forest">
        {addLabel}
      </button>
    </div>
  );
}
