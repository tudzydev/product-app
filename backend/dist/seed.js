"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_1 = require("./config/database");
const product_seeder_1 = require("./seeders/product.seeder");
const runSeed = async () => {
    console.log("🌱 Starting database seeding...");
    const connected = await (0, database_1.connectDB)(3, 2000);
    if (!connected) {
        console.error("❌ Failed to connect to database for seeding.");
        process.exit(1);
    }
    try {
        const result = await (0, product_seeder_1.seedDatabase)(true);
        console.log(`✅ ${result.message}`);
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
    finally {
        await database_1.sequelize.close();
    }
};
runSeed();
