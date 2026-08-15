const ApiError = require("../utils/ApiError");
const { ACCESS_COOKIE, verifyAccessToken } = require("../utils/customerTokens");

// Verifies the customer access-token cookie, attaches { id } to req.customer.
// Completely independent from the staff requireAuth middleware (different
// cookie, different secret, never touches the Authorization header).
function requireCustomerAuth(req, res, next) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) {
    return next(new ApiError(401, "Not signed in."));
  }
  try {
    const payload = verifyAccessToken(token);
    req.customer = { id: payload.sub };
    next();
  } catch (err) {
    next(new ApiError(401, "Session expired. Please sign in again."));
  }
}

module.exports = { requireCustomerAuth };
