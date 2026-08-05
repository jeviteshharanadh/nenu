import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { supabaseAdmin } from "../db/supabase";

const router = Router();

// POST /api/auth/bootstrap-profile
// Creates profile row if missing after Supabase Auth Signup
router.post("/bootstrap-profile", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { full_name, phone, preferred_language, default_region } = req.body;

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (existingProfile) {
      return res.json({ message: "Profile already exists", profile: existingProfile });
    }

    // Insert new profile using admin service role
    const { data: newProfile, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        full_name: full_name || "Farmer User",
        phone: phone || null,
        preferred_language: preferred_language || "en",
        default_region: default_region || null,
        role: "farmer",
      })
      .select()
      .single();

    if (error) {
      console.error("Bootstrap profile error:", error);
      return res.status(500).json({ error: `Failed to bootstrap profile: ${error.message}` });
    }

    return res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (err: any) {
    console.error("Auth bootstrap endpoint error:", err);
    return res.status(500).json({ error: err.message || "Failed to bootstrap user profile" });
  }
});

export default router;
