import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/env";
import { generalRateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import farmsRoutes from "./routes/farms.routes";
import advisoryRequestsRoutes from "./routes/advisoryRequests.routes";
import marketPricesRoutes from "./routes/marketPrices.routes";
import weatherRoutes from "./routes/weather.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// Secure Headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === config.frontendOrigin || config.nodeEnv === "development") {
        callback(null, true);
      } else {
        callback(new Error("CORS Policy: Origin not allowed"));
      }
    },
    credentials: true,
  })
);

// General Rate Limiting & Body Parsing
app.use(generalRateLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), service: "AgriAdvisor AI Backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/farms", farmsRoutes);
app.use("/api/advisory-requests", advisoryRequestsRoutes);
app.use("/api/market-prices", marketPricesRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
