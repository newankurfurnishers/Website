import type { SupabaseClient } from "@supabase/supabase-js";
import { createSessionClient } from "./server";

export type AdminState = {
  supabase: SupabaseClient;
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
};

/** Current session + whether it is an admin. Reads cookies, so call at request time. */
export async function getAdmin(): Promise<AdminState> {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, userId: null, email: null, isAdmin: false };
  const { data, error } = await supabase.rpc("is_admin");
  return { supabase, userId: user.id, email: user.email ?? null, isAdmin: !error && data === true };
}

/**
 * For Server Actions: returns the session client only if the caller is an admin,
 * otherwise null. Every admin mutation must guard on this.
 */
export async function getAdminClient(): Promise<SupabaseClient | null> {
  const { supabase, isAdmin } = await getAdmin();
  return isAdmin ? supabase : null;
}
