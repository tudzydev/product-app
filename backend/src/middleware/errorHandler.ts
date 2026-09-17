import { Request, Response, NextFunction } from "express";
import { ValidationError, UniqueConstraintError } from "sequelize";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  if (err instanceof UniqueConstraintError) {
    const messages = err.errors.map((e) => e.message || `${e.path} must be unique`);
    res.status(409).json({
      success: false,
      message: "Resource already exists",
      errors: messages,
    });
    return;
  }

  if (err instanceof ValidationError) {
    const messages = err.errors.map((e) => e.message);
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: messages,
    });
    return;
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
