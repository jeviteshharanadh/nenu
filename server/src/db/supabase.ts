import { createClient } from "@supabase/supabase-js";
import { config } from "../config/env";

if (!config.supabaseUrl) {
  console.warn("⚠️ Warning: SUPABASE_URL is not set. Supabase operations will fail unless configured.");
}

// Client authenticated with anon key (subject to RLS)
export const supabaseAnon = createClient(
  config.supabaseUrl || "https://placeholder.supabase.co",
  config.supabaseAnonKey || "placeholder-anon-key"
);

// Admin client using service role key (bypasses RLS - BACKEND ONLY)
export const supabaseAdmin = createClient(
  config.supabaseUrl || "https://placeholder.supabase.co",
  config.supabaseServiceRoleKey || config.supabaseAnonKey || "placeholder-service-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
