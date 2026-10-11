import "server-only";
import { createSessionClient } from "@/lib/supabase/server";

export type EnquiryStatus = "new" | "contacted" | "closed";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  interest: string | null;
  source_page: string | null;
  status: EnquiryStatus;
  notes: string | null;
  created_at: string;
};

const ENQUIRY_COLS = "id,name,phone,email,message,interest,source_page,status,notes,created_at";

export async function getDashboard() {
  const supabase = await createSessionClient();
  const [newCount, latest, draftCount] = await Promise.all([
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("enquiries").select(ENQUIRY_COLS).order("created_at", { ascending: false }).limit(5),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
  ]);
  return {
    newEnquiries: newCount.count ?? 0,
    latest: (latest.data ?? []) as Enquiry[],
    draftPosts: draftCount.count ?? 0,
  };
}

export async function getEnquiries(status?: EnquiryStatus): Promise<Enquiry[]> {
  const supabase = await createSessionClient();
  let q = supabase.from("enquiries").select(ENQUIRY_COLS).order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Enquiry[];
}

export async function getEnquiry(id: string): Promise<Enquiry | null> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("enquiries").select(ENQUIRY_COLS).eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Enquiry | null) ?? null;
}

export async function getSettingsRow() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}
