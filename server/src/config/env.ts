import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config(); // also check current workdir .env

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  supabaseUrl: process.env.SUPABASE_URL || "https://aykjagxwxyfkaehcmueu.supabase.co",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Qgze_7RZZuOANz_KLolqDg_2cXRB2os",
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Qgze_7RZZuOANz_KLolqDg_2cXRB2os",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "",
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || "",
  supabaseJwksUrl: process.env.SUPABASE_JWKS_URL || "https://aykjagxwxyfkaehcmueu.supabase.co/auth/v1/.well-known/jwks.json",
  databaseUrl: process.env.DATABASE_URL || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  advisoryRateLimitPerHour: parseInt(process.env.ADVISORY_RATE_LIMIT_PER_HOUR || "20", 10),
};
