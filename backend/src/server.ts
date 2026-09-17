import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB, sequelize } from "./config/database";
import apiRoutes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/api/health", async (req: Request, res: Response) => {
  let dbStatus = "disconnected";
  try {
    await sequelize.authenticate();
    dbStatus = "connected";
  } catch {
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
app.use("/api", apiRoutes);

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    // Attempt database connection and model sync
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
    });

    // Graceful shutdown
    const handleShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Closing server gracefully...`);
      server.close(async () => {
        try {
          await sequelize.close();
          console.log("🔌 Database connection closed.");
          process.exit(0);
        } catch (err) {
          console.error("Error closing database connection:", err);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
