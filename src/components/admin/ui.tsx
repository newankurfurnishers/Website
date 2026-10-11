"use client";

import { useFormStatus } from "react-dom";

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-forest/55">{hint}</span>}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? undefined}
        placeholder={placeholder}
        required={required}
        className="admin-input mt-1.5"
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-forest/55">{hint}</span>}
      <textarea name={name} defaultValue={defaultValue ?? undefined} rows={rows} className="admin-input mt-1.5" />
    </label>
  );
}

export function SubmitButton({ children = "Save changes" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-dark justify-center disabled:opacity-60">
      {pending ? "Saving…" : children}
    </button>
  );
}

export type SaveState = { status: "idle" | "success" | "error"; message?: string };

export function SaveMessage({ state }: { state: SaveState }) {
  if (state.status === "idle") return null;
  const ok = state.status === "success";
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`rounded-lg px-4 py-2.5 text-sm ${ok ? "bg-olive/15 text-forest" : "bg-walnut/10 text-walnut"}`}
    >
      {state.message ?? (ok ? "Saved. Live on the site now." : "Something went wrong.")}
    </p>
  );
}
