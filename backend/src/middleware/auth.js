const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// Verifies Authorization: Bearer <token>, attaches { id, role } to req.user
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Missing or invalid authorization header."));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token."));
  }
}

// Must run after requireAuth
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access required."));
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
