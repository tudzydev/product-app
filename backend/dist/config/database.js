"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Ensure environment variables are loaded
dotenv_1.default.config();
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../.env") });
const rawDatabaseUrl = process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;
const dbName = process.env.POSTGRES_DB || process.env.PGDATABASE || "product_db";
const dbUser = process.env.POSTGRES_USER || process.env.PGUSER || "postgres";
const dbPassword = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || "postgres";
const dbHost = process.env.POSTGRES_HOST || process.env.PGHOST || "localhost";
const dbPort = Number(process.env.POSTGRES_PORT) || 5432;
const isNeon = Boolean((rawDatabaseUrl && rawDatabaseUrl.includes("neon.tech")) ||
    (dbHost && dbHost.includes("neon.tech")));
const isSsl = Boolean(isNeon ||
    process.env.DB_SSL === "true" ||
    (rawDatabaseUrl && rawDatabaseUrl.includes("sslmode=require")));
const sequelizeOptions = {
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" && process.env.DB_LOGGING === "true"
        ? (msg) => console.log(`[DB] ${msg}`)
        : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
if (isNeon) {
    // Use @neondatabase/serverless with WebSockets for secure connection over port 443
    // Bypasses ISP/firewall blocks on standard PostgreSQL port 5432
    const neon = require("@neondatabase/serverless");
    const ws = require("ws");
    neon.neonConfig.webSocketConstructor = ws;
    sequelizeOptions.dialectModule = neon;
}
else if (isSsl) {
    sequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}
exports.sequelize = rawDatabaseUrl
    ? new sequelize_1.Sequelize(rawDatabaseUrl, sequelizeOptions)
    : isNeon
        ? new sequelize_1.Sequelize(`postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}?sslmode=require`, sequelizeOptions)
        : new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
            ...sequelizeOptions,
            host: dbHost,
            port: dbPort,
        });
const connectDB = async (retryCount = 5, retryDelay = 3000) => {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
            await exports.sequelize.authenticate();
            console.log(`✅ PostgreSQL database connected successfully${isNeon ? " (Neon Cloud)" : ""}`);
            await exports.sequelize.sync();
            console.log("✅ Database models synchronized");
            return true;
        }
        catch (error) {
            console.warn(`⚠️  [Database] Connection attempt ${attempt}/${retryCount} failed: ${error.message}`);
            if (attempt < retryCount) {
                console.log(`⏳ Retrying in ${retryDelay / 1000}s...`);
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
            else {
                console.error("❌ Could not connect to PostgreSQL database after multiple attempts.");
                const targetDisplay = rawDatabaseUrl
                    ? rawDatabaseUrl.replace(/:([^:@]+)@/, ":****@")
                    : `postgres://${dbUser}:****@${dbHost}:${dbPort}/${dbName}`;
                console.error(`   Target: ${targetDisplay}`);
            }
        }
    }
    return false;
};
exports.connectDB = connectDB;
