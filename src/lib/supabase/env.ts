export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False in local preview without credentials; the site then renders bundled launch content. */
export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);
