import type { Request, Response, NextFunction, RequestHandler } from "express";

// Wraps an async controller so rejected promises are passed to next(err)
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
