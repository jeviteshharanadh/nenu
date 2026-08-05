import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { supabaseAdmin } from "../db/supabase";
import { updateProfileSchema } from "../schemas/advisory.schema";

const router = Router();

// GET /api/profile
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json({ profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch profile" });
  }
});

// PATCH /api/profile
router.patch("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const validatedData = updateProfileSchema.parse(req.body);

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .update(validatedData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: `Failed to update profile: ${error.message}` });
    }

    return res.json({ message: "Profile updated successfully", profile });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: err.errors });
    }
    return res.status(500).json({ error: err.message || "Failed to update profile" });
  }
});

export default router;
