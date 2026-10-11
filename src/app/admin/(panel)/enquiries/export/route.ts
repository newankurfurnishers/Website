import { getAdmin } from "@/lib/supabase/admin";

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET() {
  const { supabase, isAdmin } = await getAdmin();
  if (!isAdmin) return new Response("Forbidden", { status: 403 });

  const { data, error } = await supabase
    .from("enquiries")
    .select("created_at,name,phone,email,interest,status,source_page,message,notes")
    .order("created_at", { ascending: false });
  if (error) return new Response("Error", { status: 500 });

  const headers = ["created_at", "name", "phone", "email", "interest", "status", "source_page", "message", "notes"];
  const rows = (data ?? []).map((r) => headers.map((h) => cell((r as Record<string, unknown>)[h])).join(","));
  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="enquiries.csv"`,
    },
  });
}
