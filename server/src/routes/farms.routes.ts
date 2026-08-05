import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { supabaseAdmin } from "../db/supabase";
import { farmSchema, updateFarmSchema } from "../schemas/advisory.schema";

const router = Router();

// GET /api/farms - List current user's farms
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const { data: farms, error } = await supabaseAdmin
      .from("farms")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ farms: farms || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to list farms" });
  }
});

// POST /api/farms - Create farm
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const validatedData = farmSchema.parse(req.body);

    const { data: farm, error } = await supabaseAdmin
      .from("farms")
      .insert({
        ...validatedData,
        owner_id: ownerId,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Farm registered successfully", farm });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: err.errors });
    }
    return res.status(500).json({ error: err.message || "Failed to create farm" });
  }
});

// GET /api/farms/:id - Get one farm detail (ownership enforced)
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const { id } = req.params;

    const { data: farm, error } = await supabaseAdmin
      .from("farms")
      .select("*")
      .eq("id", id)
      .eq("owner_id", ownerId)
      .single();

    if (error || !farm) {
      return res.status(404).json({ error: "Farm not found or access denied" });
    }

    return res.json({ farm });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch farm detail" });
  }
});

// PATCH /api/farms/:id - Update farm
router.patch("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const { id } = req.params;
    const validatedData = updateFarmSchema.parse(req.body);

    const { data: farm, error } = await supabaseAdmin
      .from("farms")
      .update(validatedData)
      .eq("id", id)
      .eq("owner_id", ownerId)
      .select()
      .single();

    if (error || !farm) {
      return res.status(404).json({ error: "Farm not found or update failed" });
    }

    return res.json({ message: "Farm updated successfully", farm });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: err.errors });
    }
    return res.status(500).json({ error: err.message || "Failed to update farm" });
  }
});

// DELETE /api/farms/:id - Delete farm
router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from("farms")
      .delete()
      .eq("id", id)
      .eq("owner_id", ownerId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: "Farm deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to delete farm" });
  }
});

export default router;
