import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { supabaseAdmin } from "../db/supabase";

const router = Router();

// GET /api/market-prices - List/query market prices
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { crop, region } = req.query;

    let query = supabaseAdmin
      .from("market_prices")
      .select("*")
      .order("recorded_date", { ascending: false });

    if (crop) query = query.ilike("crop_name", `%${crop}%`);
    if (region) query = query.ilike("region", `%${region}%`);

    let { data: prices, error } = await query.limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Seed default demo market prices if table is empty
    if (!prices || prices.length === 0) {
      const defaultSeeds = [
        { crop_name: "Wheat (HD 2967)", region: "Punjab", price_per_kg: 24.50, unit: "kg", recorded_date: new Date().toISOString().split("T")[0] },
        { crop_name: "Paddy Rice (Basmati 1121)", region: "Haryana", price_per_kg: 42.00, unit: "kg", recorded_date: new Date().toISOString().split("T")[0] },
        { crop_name: "Cotton (Medium Staple)", region: "Gujarat", price_per_kg: 68.00, unit: "kg", recorded_date: new Date().toISOString().split("T")[0] },
        { crop_name: "Tomato (Hybrid)", region: "Karnataka", price_per_kg: 18.00, unit: "kg", recorded_date: new Date().toISOString().split("T")[0] },
        { crop_name: "Potato (Jyoti)", region: "West Bengal", price_per_kg: 16.50, unit: "kg", recorded_date: new Date().toISOString().split("T")[0] },
        { crop_name: "Maize (Yellow)", region: "Bihar", price_per_kg: 21.00, unit: "kg", recorded_date: new Date().toISOString().split("T")[0] },
        { crop_name: "Chickpea (Desi Gram)", region: "Madhya Pradesh", price_per_kg: 54.00, unit: "kg", recorded_date: new Date().toISOString().split("T")[0] },
        { crop_name: "Soybean (Yellow)", region: "Maharashtra", price_per_kg: 46.50, unit: "kg", recorded_date: new Date().toISOString().split("T")[0] },
      ];

      await supabaseAdmin.from("market_prices").upsert(defaultSeeds, { onConflict: "crop_name,region,recorded_date" });
      const { data: freshlySeeded } = await supabaseAdmin.from("market_prices").select("*").order("recorded_date", { ascending: false });
      prices = freshlySeeded || defaultSeeds as any;
    }

    return res.json({ marketPrices: prices });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch market prices" });
  }
});

export default router;
