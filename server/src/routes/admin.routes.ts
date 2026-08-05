import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";
import { marketPriceSchema } from "../schemas/advisory.schema";
import { supabaseAdmin } from "../db/supabase";

const router = Router();

// POST /api/admin/market-prices - Create or update market price row
router.post("/market-prices", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = marketPriceSchema.parse(req.body);

    const { data: priceRow, error } = await supabaseAdmin
      .from("market_prices")
      .upsert(
        {
          ...validatedData,
          created_by: req.user!.id,
          recorded_date: validatedData.recorded_date || new Date().toISOString().split("T")[0],
        },
        { onConflict: "crop_name,region,recorded_date" }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Market price saved successfully", marketPrice: priceRow });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    return res.status(500).json({ error: err.message || "Failed to save market price" });
  }
});

// DELETE /api/admin/market-prices/:id - Delete market price entry
router.delete("/market-prices/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from("market_prices")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: "Market price deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to delete market price" });
  }
});

export default router;
