const ApiError = require("../utils/ApiError");

// validate({ body, query, params }) - each is an optional zod schema
function validate(schemas) {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (err) {
      const firstIssue = err.errors?.[0];
      const message = firstIssue
        ? `${firstIssue.path.join(".")}: ${firstIssue.message}`
        : "Invalid request.";
      next(new ApiError(400, message));
    }
  };
}

module.exports = validate;
