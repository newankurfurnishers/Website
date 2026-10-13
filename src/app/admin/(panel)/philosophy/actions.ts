"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";

export type ElementInput = {
  id: string;
  name: string;
  sanskrit: string;
  tagline: string;
  description: string;
  image_url: string;
  image_alt: string;
  subtitle: string;
  lead: string;
  principle: string;
  in_design: string;
  story_label: string;
  story_text: string;
  visual_language: string;
};

export type ElementActionState = { status: "idle" | "success" | "error"; message?: string };

export async function saveElement(input: ElementInput): Promise<ElementActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  const name = input.name.trim();
  if (!name) return { status: "error", message: "An element name is required." };

  const { error } = await supabase
    .from("elements")
    .update({
      name,
      sanskrit: input.sanskrit.trim() || null,
      tagline: input.tagline.trim() || null,
      description: input.description.trim() || null,
      image_url: input.image_url.trim() || null,
      image_alt: input.image_alt.trim() || null,
      subtitle: input.subtitle.trim() || null,
      lead: input.lead.trim() || null,
      principle: input.principle.trim() || null,
      in_design: input.in_design.trim() || null,
      story_label: input.story_label.trim() || null,
      story_text: input.story_text.trim() || null,
      visual_language: input.visual_language.trim() || null,
    })
    .eq("id", input.id);
  if (error) return { status: "error", message: "Couldn't save. Please try again." };

  updateTag("content");
  revalidatePath("/admin/philosophy");
  return { status: "success", message: "Saved. Live on the site now." };
}

export async function reorderElements(orderedIds: string[]): Promise<ElementActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };
  await Promise.all(orderedIds.map((id, i) => supabase.from("elements").update({ sort: i + 1 }).eq("id", id)));
  updateTag("content");
  revalidatePath("/admin/philosophy");
  return { status: "success" };
}
