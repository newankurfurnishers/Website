"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";

export type EnquiryActionState = { status: "idle" | "success" | "error"; message?: string };

export async function updateEnquiry(
  _prev: EnquiryActionState,
  formData: FormData,
): Promise<EnquiryActionState> {
  const supabase = await getAdminClient();
  if (!supabase) return { status: "error", message: "You don't have permission to do that." };

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  if (!id || !["new", "contacted", "closed"].includes(status)) {
    return { status: "error", message: "Invalid request." };
  }

  const { error } = await supabase
    .from("enquiries")
    .update({ status, notes: notes || null })
    .eq("id", id);
  if (error) return { status: "error", message: "Couldn't save. Please try again." };

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin");
  return { status: "success", message: "Saved." };
}
