"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dbName = process.env.POSTGRES_DB || "product_db";
const dbUser = process.env.POSTGRES_USER || "postgres";
const dbPassword = process.env.POSTGRES_PASSWORD || "postgres";
const dbHost = process.env.POSTGRES_HOST || "localhost";
const dbPort = Number(process.env.POSTGRES_PORT) || 5432;
exports.sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
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
});
const connectDB = async (retryCount = 5, retryDelay = 3000) => {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
            await exports.sequelize.authenticate();
            console.log("✅ PostgreSQL database connected successfully");
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
                console.error(`   Target: postgres://${dbUser}:****@${dbHost}:${dbPort}/${dbName}`);
            }
        }
    }
    return false;
};
exports.connectDB = connectDB;
