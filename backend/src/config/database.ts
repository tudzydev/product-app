import { Sequelize, Options } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Ensure environment variables are loaded
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const rawDatabaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED;

const dbName = process.env.POSTGRES_DB || process.env.PGDATABASE || "product_db";
const dbUser = process.env.POSTGRES_USER || process.env.PGUSER || "postgres";
const dbPassword = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || "postgres";
const dbHost = process.env.POSTGRES_HOST || process.env.PGHOST || "localhost";
const dbPort = Number(process.env.POSTGRES_PORT) || 5432;

const isNeon = Boolean(
  (rawDatabaseUrl && rawDatabaseUrl.includes("neon.tech")) ||
  (dbHost && dbHost.includes("neon.tech"))
);

const isSsl = Boolean(
  isNeon ||
  process.env.DB_SSL === "true" ||
  (rawDatabaseUrl && rawDatabaseUrl.includes("sslmode=require"))
);

const sequelizeOptions: Options = {
  dialect: "postgres",
  logging:
    process.env.NODE_ENV === "development" && process.env.DB_LOGGING === "true"
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
} else if (isSsl) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

export const sequelize = rawDatabaseUrl
  ? new Sequelize(rawDatabaseUrl, sequelizeOptions)
  : isNeon
  ? new Sequelize(
      `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}?sslmode=require`,
      sequelizeOptions
    )
  : new Sequelize(dbName, dbUser, dbPassword, {
      ...sequelizeOptions,
      host: dbHost,
      port: dbPort,
    });

export const connectDB = async (retryCount = 5, retryDelay = 3000): Promise<boolean> => {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      await sequelize.authenticate();
      console.log(
        `✅ PostgreSQL database connected successfully${isNeon ? " (Neon Cloud)" : ""}`
      );
      await sequelize.sync();
      console.log("✅ Database models synchronized");
      return true;
    } catch (error: any) {
      console.warn(
        `⚠️  [Database] Connection attempt ${attempt}/${retryCount} failed: ${error.message}`
      );
      if (attempt < retryCount) {
        console.log(`⏳ Retrying in ${retryDelay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        console.error(
          "❌ Could not connect to PostgreSQL database after multiple attempts."
        );
        const targetDisplay = rawDatabaseUrl
          ? rawDatabaseUrl.replace(/:([^:@]+)@/, ":****@")
          : `postgres://${dbUser}:****@${dbHost}:${dbPort}/${dbName}`;
        console.error(`   Target: ${targetDisplay}`);
      }
    }
  }
  return false;
};