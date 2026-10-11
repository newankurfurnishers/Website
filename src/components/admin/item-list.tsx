"use client";

export type ListItem = { title: string; text: string };

export function ItemListEditor({
  items,
  onChange,
  addLabel = "Add item",
}: {
  items: ListItem[];
  onChange: (v: ListItem[]) => void;
  addLabel?: string;
}) {
  const update = (i: number, patch: Partial<ListItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-forest/15 p-3">
          <div className="flex items-center gap-1">
            <input
              value={it.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Title"
              className="admin-input font-medium"
            />
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-2 py-2 hover:bg-stone disabled:opacity-30" aria-label="Move up">
              ↑
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded px-2 py-2 hover:bg-stone disabled:opacity-30" aria-label="Move down">
              ↓
            </button>
            <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="rounded px-2 py-2 text-walnut hover:bg-stone" aria-label="Remove">
              ✕
            </button>
          </div>
          <textarea
            value={it.text}
            onChange={(e) => update(i, { text: e.target.value })}
            placeholder="Description"
            rows={2}
            className="admin-input mt-2"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { title: "", text: "" }])}
        className="btn btn-line min-h-10 w-fit px-4 text-sm text-forest"
      >
        {addLabel}
      </button>
    </div>
  );
}
