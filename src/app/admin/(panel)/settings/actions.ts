"use server";

import { updateTag } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";

export type SettingsState = { status: "idle" | "success" | "error"; message?: string };

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };

  const str = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v || null;
  };
  const business_name = String(formData.get("business_name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  if (!business_name || !tagline) {
    return { status: "error", message: "Business name and tagline can't be empty." };
  }
  const year = parseInt(String(formData.get("established_year") ?? ""), 10);
  const phones = String(formData.get("phones") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("site_settings")
    .update({
      business_name,
      tagline,
      established_year: Number.isFinite(year) ? year : 1984,
      phones,
      whatsapp: str("whatsapp"),
      email: str("email"),
      address: str("address"),
      map_embed_url: str("map_embed_url"),
      instagram_url: str("instagram_url"),
      facebook_url: str("facebook_url"),
      seo_title: str("seo_title"),
      seo_description: str("seo_description"),
    })
    .eq("id", 1);

  if (error) return { status: "error", message: "Couldn't save. Please try again." };

  updateTag("content");
  return { status: "success", message: "Saved. Live on the site now." };
}
