"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const sequelize_1 = require("sequelize");
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${req.method} ${req.url}:`, err);
    if (err instanceof sequelize_1.UniqueConstraintError) {
        const messages = err.errors.map((e) => e.message || `${e.path} must be unique`);
        res.status(409).json({
            success: false,
            message: "Resource already exists",
            errors: messages,
        });
        return;
    }
    if (err instanceof sequelize_1.ValidationError) {
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
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};
exports.notFoundHandler = notFoundHandler;
