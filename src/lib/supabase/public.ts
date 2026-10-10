import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Cookie-less anon client for cached public reads (RLS limits it to published content). */
export function createPublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
