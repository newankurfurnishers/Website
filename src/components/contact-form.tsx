"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { type EnquiryState, submitEnquiry } from "@/app/contact/actions";

const initial: EnquiryState = { status: "idle" };

export function ContactForm({ interests }: { interests: string[] }) {
  const searchParams = useSearchParams();
  const [state, action, pending] = useActionState(submitEnquiry, initial);

  const prefillInterest = state.values?.interest ?? searchParams.get("interest") ?? "";

  if (state.status === "success") {
    return (
      <div className="rounded-[1.5rem] bg-sand p-8 sm:p-10">
        <h2 className="text-2xl">Thank you.</h2>
        <p className="mt-3 text-lg text-forest/80">{state.message}</p>
        <p className="mt-2 text-forest/70">
          In a hurry? Call us and we&rsquo;ll help right away.
        </p>
      </div>
    );
  }

  const fieldErr = (name: keyof NonNullable<EnquiryState["errors"]>) => state.errors?.[name];

  return (
    <form action={action} className="grid gap-5" noValidate>
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-walnut/10 px-4 py-3 text-walnut">
          {state.message}
        </p>
      )}

      <Field label="Your name" name="name" required defaultValue={state.values?.name} error={fieldErr("name")} />
      <Field
        label="Phone number"
        name="phone"
        type="tel"
        required
        inputMode="tel"
        autoComplete="tel"
        defaultValue={state.values?.phone}
        error={fieldErr("phone")}
      />
      <Field
        label="Email (optional)"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={fieldErr("email")}
      />

      <div>
        <label htmlFor="interest" className="block font-medium">
          What are you interested in?
        </label>
        <select
          id="interest"
          name="interest"
          defaultValue={prefillInterest}
          className="mt-2 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-forest focus-visible:border-forest"
        >
          <option value="">General enquiry</option>
          {interests.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
          {prefillInterest && !interests.includes(prefillInterest) && (
            <option value={prefillInterest}>{prefillInterest}</option>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block font-medium">
          Tell us about your space (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={state.values?.message}
          className="mt-2 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-forest focus-visible:border-forest"
        />
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <button type="submit" disabled={pending} className="btn btn-dark disabled:opacity-60">
          {pending ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  error,
  inputMode,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  inputMode?: "tel" | "text" | "email";
  autoComplete?: string;
}) {
  const errId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="block font-medium">
        {label}
        {required && <span className="text-walnut"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className="mt-2 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-forest focus-visible:border-forest aria-[invalid=true]:border-walnut"
      />
      {error && (
        <p id={errId} className="mt-1.5 text-sm text-walnut">
          {error}
        </p>
      )}
    </div>
  );
}
