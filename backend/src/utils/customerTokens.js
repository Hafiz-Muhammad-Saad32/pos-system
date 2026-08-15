const jwt = require("jsonwebtoken");

const ACCESS_COOKIE = "customer_access_token";
const REFRESH_COOKIE = "customer_refresh_token";

// Parses simple duration strings like "15m", "30d", "1h", "45s" into milliseconds.
// Falls back to a sane default if the input is missing/unparseable.
function toMs(duration, fallbackMs) {
  if (!duration) return fallbackMs;
  const match = /^(\d+)\s*(ms|s|m|h|d)$/i.exec(String(duration).trim());
  if (!match) return fallbackMs;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { ms: 1, s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return value * multipliers[unit];
}

function signAccessToken(customerId) {
  return jwt.sign({ sub: customerId.toString(), type: "customer_access" }, process.env.CUSTOMER_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.CUSTOMER_ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
}

function signRefreshToken(customerId) {
  return jwt.sign({ sub: customerId.toString(), type: "customer_refresh" }, process.env.CUSTOMER_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.CUSTOMER_REFRESH_TOKEN_EXPIRES_IN || "30d",
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.CUSTOMER_ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.CUSTOMER_REFRESH_TOKEN_SECRET);
}

// Cross-domain-friendly defaults: in production the website and API are
// commonly on different Vercel domains, so cookies need SameSite=None+Secure.
// Locally (http, same-ish origin during dev) Lax is fine and doesn't require HTTPS.
function baseCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };
}

function setAuthCookies(res, customerId) {
  const accessToken = signAccessToken(customerId);
  const refreshToken = signRefreshToken(customerId);

  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseCookieOptions(),
    maxAge: toMs(process.env.CUSTOMER_ACCESS_TOKEN_EXPIRES_IN, 15 * 60 * 1000),
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseCookieOptions(),
    maxAge: toMs(process.env.CUSTOMER_REFRESH_TOKEN_EXPIRES_IN, 30 * 24 * 60 * 60 * 1000),
  });
}

function setAccessCookie(res, customerId) {
  const accessToken = signAccessToken(customerId);
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseCookieOptions(),
    maxAge: toMs(process.env.CUSTOMER_ACCESS_TOKEN_EXPIRES_IN, 15 * 60 * 1000),
  });
}

function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE, baseCookieOptions());
  res.clearCookie(REFRESH_COOKIE, baseCookieOptions());
}

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  setAccessCookie,
  clearAuthCookies,
};
