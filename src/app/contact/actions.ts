"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "phone" | "email" | "message", string>>;
  values?: { name: string; phone: string; email: string; interest: string; message: string };
};

// Accepts +91 93343 31429, 09334331429, 9334331429, etc.
const phoneOk = (v: string) => /^(0|\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ""));

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(120, "That name is too long"),
  phone: z
    .string()
    .trim()
    .min(1, "A phone number lets us call you back")
    .refine(phoneOk, "Please enter a valid Indian phone number"),
  email: z.union([z.literal(""), z.email("That email doesn't look right").max(200)]),
  interest: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(4000, "That message is a little too long").optional().default(""),
});

// Simple per-IP rate limit (best-effort; resets on redeploy / cold start).
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX_IN_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_IN_WINDOW;
}

async function notifyByEmail(e: {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!key || !to) return;
  const from = process.env.ENQUIRY_FROM_EMAIL ?? "New Ankur Website <onboarding@resend.dev>";
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: e.email || undefined,
        subject: `New enquiry from ${e.name}${e.interest ? ` — ${e.interest}` : ""}`,
        text:
          `Name: ${e.name}\nPhone: ${e.phone}\nEmail: ${e.email || "—"}\n` +
          `Interest: ${e.interest || "—"}\n\n${e.message || "(no message)"}`,
      }),
    });
  } catch {
    // Email is best-effort; the enquiry is already saved.
  }
}

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Honeypot: real visitors leave this hidden field empty.
  if ((formData.get("company") as string)?.trim()) {
    return { status: "success", message: "Thanks, we'll call you within one working day." };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? "").trim(),
    interest: String(formData.get("interest") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: EnquiryState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof NonNullable<EnquiryState["errors"]>;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", errors, values: raw };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "You've sent a few enquiries just now. Please call us instead and we'll help right away.",
      values: raw,
    };
  }

  const data = parsed.data;
  const { error } = await createPublicClient()
    .from("enquiries")
    .insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message || null,
      interest: data.interest || null,
      source_page: "/contact",
    });

  if (error) {
    return {
      status: "error",
      message: "Something went wrong saving your enquiry. Please try again, or call us.",
      values: raw,
    };
  }

  await notifyByEmail(data);
  return { status: "success", message: "Thanks, we'll call you within one working day." };
}
