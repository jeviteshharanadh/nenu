import { Request, Response, NextFunction } from "express";
import { supabaseAdmin, supabaseAnon } from "../db/supabase";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    // Verify token with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      // Fallback try with anon client if admin client fails
      const { data: anonData, error: anonError } = await supabaseAnon.auth.getUser(token);
      if (anonError || !anonData.user) {
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
      }
      req.user = {
        id: anonData.user.id,
        email: anonData.user.email,
      };
      return next();
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Unauthorized authentication error" });
  }
}
