import "dotenv/config";
import { connectDB, sequelize } from "./config/database";
import { seedDatabase } from "./seeders/product.seeder";

const runSeed = async () => {
  console.log("🌱 Starting database seeding...");
  const connected = await connectDB(3, 2000);
  if (!connected) {
    console.error("❌ Failed to connect to database for seeding.");
    process.exit(1);
  }

  try {
    const result = await seedDatabase(true);
    console.log(`✅ ${result.message}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

runSeed();
