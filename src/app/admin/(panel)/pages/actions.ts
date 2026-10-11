"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";

export type SectionInput = {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  image_url: string;
  image_alt: string;
  cta_label: string;
  cta_href: string;
  items: { title: string; text: string }[];
  published: boolean;
};

export type SectionActionState = { status: "idle" | "success" | "error"; message?: string };

export async function saveSection(input: SectionInput): Promise<SectionActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };

  const { error } = await supabase
    .from("page_sections")
    .update({
      eyebrow: input.eyebrow.trim() || null,
      heading: input.heading.trim() || null,
      body: input.body.trim() || null,
      image_url: input.image_url.trim() || null,
      image_alt: input.image_alt.trim() || null,
      cta_label: input.cta_label.trim() || null,
      cta_href: input.cta_href.trim() || null,
      items: input.items.map((it) => ({ title: it.title.trim(), text: it.text.trim() })).filter((it) => it.title),
      published: input.published,
    })
    .eq("id", input.id);
  if (error) return { status: "error", message: "Couldn't save. Please try again." };

  updateTag("content");
  revalidatePath("/admin/pages");
  return { status: "success", message: "Saved. Live on the site now." };
}
