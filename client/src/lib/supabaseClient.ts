import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://aykjagxwxyfkaehcmueu.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_Qgze_7RZZuOANz_KLolqDg_2cXRB2os";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
