"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middlewares
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check
app.get("/api/health", async (req, res) => {
    let dbStatus = "disconnected";
    try {
        await database_1.sequelize.authenticate();
        dbStatus = "connected";
    }
    catch {
        dbStatus = "disconnected";
    }
    res.status(200).json({
        status: "ok",
        database: dbStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use("/api", routes_1.default);
// 404 & Error Handlers
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        // Attempt database connection and model sync
        await (0, database_1.connectDB)();
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
            console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
        });
        // Graceful shutdown
        const handleShutdown = async (signal) => {
            console.log(`\n🛑 Received ${signal}. Closing server gracefully...`);
            server.close(async () => {
                try {
                    await database_1.sequelize.close();
                    console.log("🔌 Database connection closed.");
                    process.exit(0);
                }
                catch (err) {
                    console.error("Error closing database connection:", err);
                    process.exit(1);
                }
            });
        };
        process.on("SIGTERM", () => handleShutdown("SIGTERM"));
        process.on("SIGINT", () => handleShutdown("SIGINT"));
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
if (process.env.NODE_ENV !== "test") {
    startServer();
}
exports.default = app;
