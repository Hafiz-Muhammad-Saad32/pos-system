// Express app setup - routes are mounted here as later phases add them
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import customerAuthRoutes from "./routes/customerAuthRoutes.js";
import publicFoodRoutes from "./routes/publicFoodRoutes.js";
import customerProfileRoutes from "./routes/customerProfileRoutes.js";
import customerOrderRoutes from "./routes/customerOrderRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    // CLIENT_URL is the new env var for the customer website's origin (cookie
    // auth needs an exact origin, never "*"). Falls back to the pre-existing
    // CORS_ORIGIN so already-configured deployments keep working unchanged.
    origin: [
      process.env.CLIENT_URL,
      process.env.CORS_ORIGIN,
      "http://localhost:5173",
    ].filter((origin): origin is string => Boolean(origin)),
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Customer (website) routes
app.use("/api/auth", customerAuthRoutes);
app.use("/api/foods", publicFoodRoutes);
app.use("/api/customers", customerProfileRoutes);
app.use("/api/orders", customerOrderRoutes);
app.use("/api/favorites", favoriteRoutes);

// --- Staff (POS) routes
app.use("/api/pos/auth", authRoutes);
app.use("/api/pos/foods", foodRoutes);
app.use("/api/pos/customers", customerRoutes);
app.use("/api/pos/orders", orderRoutes);
app.use("/api/pos/analytics", analyticsRoutes);

// webhook for WhatsApp AI
app.use("/api/webhook", webhookRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
