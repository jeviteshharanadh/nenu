import rateLimit from "express-rate-limit";
import { config } from "../config/env";

export const advisoryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: config.advisoryRateLimitPerHour,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: `Rate limit exceeded. You can only make ${config.advisoryRateLimitPerHour} advisory requests per hour.`,
  },
  keyGenerator: (req) => {
    return req.user?.id || req.ip || "anonymous";
  },
});

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
