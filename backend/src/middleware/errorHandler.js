const ApiError = require("../utils/ApiError");

// Central error handler: every error response is JSON { message }
function errorHandler(err, req, res, next) {
  if (err.isApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `${field} already in use.` });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const firstMsg = Object.values(err.errors)[0]?.message || "Validation failed.";
    return res.status(400).json({ message: firstMsg });
  }

  // Mongoose bad ObjectId cast
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}.` });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error." });
}

function notFoundHandler(req, res, next) {
  next(new ApiError(404, "Route not found."));
}

module.exports = { errorHandler, notFoundHandler };
