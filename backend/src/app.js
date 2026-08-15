// Express app setup - routes are mounted here as later phases add them
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    // CLIENT_URL is the new env var for the customer website's origin (cookie
    // auth needs an exact origin, never "*"). Falls back to the pre-existing
    // CORS_ORIGIN so already-configured deployments keep working unchanged.
    origin: [process.env.CORS_ORIGIN, process.env.CLIENT_URL] || "http://localhost:3000",
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
app.use("/api/auth", require("./routes/customerAuthRoutes"));
app.use("/api/foods", require("./routes/publicFoodRoutes"));
app.use("/api/customers", require("./routes/customerProfileRoutes"));
app.use("/api/orders", require("./routes/customerOrderRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));

// --- Staff (POS) routes 
app.use("/api/pos/auth", require("./routes/authRoutes"));
app.use("/api/pos/foods", require("./routes/foodRoutes"));
app.use("/api/pos/customers", require("./routes/customerRoutes"));
app.use("/api/pos/orders", require("./routes/orderRoutes"));
app.use("/api/pos/analytics", require("./routes/analyticsRoutes"));

// webhook for WhatsApp AI 
app.use("/api/webhook", require("./routes/webhookRoutes"));


const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
