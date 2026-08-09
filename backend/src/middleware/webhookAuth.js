const ApiError = require("../utils/ApiError");

// Checks x-webhook-secret header against WEBHOOK_SECRET env var
function requireWebhookSecret(req, res, next) {
  const secret = req.headers["x-webhook-secret"];
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return next(new ApiError(401, "Invalid or missing webhook secret."));
  }
  next();
}

module.exports = requireWebhookSecret;
