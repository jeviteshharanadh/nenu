import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getWeatherContext } from "../services/weatherService";

const router = Router();

// GET /api/weather/:region
router.get("/:region", requireAuth, async (req: Request, res: Response) => {
  try {
    const { region } = req.params;
    const weather = await getWeatherContext(region);
    return res.json({ weather });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch weather context" });
  }
});

export default router;
