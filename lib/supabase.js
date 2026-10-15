import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://wbiuelscmobbvbubyqec.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaXVlbHNjbW9iYnZidWJ5cWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMzE0NzQsImV4cCI6MjEwMDgwNzQ3NH0.eP-c6ew0UqXhwpP3WudzbTiuSbBmYRHd2CQ1JQWOHzE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "lssc-auth",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});