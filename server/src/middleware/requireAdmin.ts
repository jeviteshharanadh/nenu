import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../db/supabase";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (error || !profile || profile.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin privileges required" });
    }

    next();
  } catch (err) {
    console.error("Admin check error:", err);
    return res.status(500).json({ error: "Failed to verify admin status" });
  }
}
