import { createClient } from "@supabase/supabase-js";
import { runMediaCleanup } from "@/lib/admin/media-cleanup";
import { hasSupabase, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

// Keeps the free-tier Supabase project active (it pauses after ~7 days of
// inactivity) by making a lightweight request on a schedule. Triggered daily
// by the Vercel Cron defined in vercel.json.
//
// If CRON_SECRET and SUPABASE_SERVICE_ROLE_KEY are both set, it also sweeps
// uploaded images that are no longer used anywhere, to free storage.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!hasSupabase) {
    return Response.json({ ok: false, reason: "Supabase not configured" });
  }

  const anon = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  const { error } = await anon.from("site_settings").select("id").limit(1);

  // Optional garbage-collection of orphaned uploads (needs an authorized cron
  // request + the service-role key to bypass RLS). 7-day grace keeps recent
  // library uploads that haven't been placed on a page yet.
  let cleaned: number | null = null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret && serviceKey) {
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    cleaned = await runMediaCleanup(admin, 24 * 7);
  }

  return Response.json({ ok: !error, at: new Date().toISOString(), cleaned });
}
