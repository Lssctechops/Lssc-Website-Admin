import { createClient } from "@supabase/supabase-js";

// SERVER ONLY. Uses the service_role key which bypasses RLS.
// Never import this into a client component.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});