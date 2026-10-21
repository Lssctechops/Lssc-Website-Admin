import { createClient } from "@supabase/supabase-js";

// Guarded: only create a real client if env vars exist.
// Avoids build crash ("supabaseUrl is required") when Supabase isn't used.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null;