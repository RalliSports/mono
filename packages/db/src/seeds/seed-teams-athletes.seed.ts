import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@repo/db";

import { seedAthletes } from "./athletes.seed";
import { seedTeams } from "./teams.seed";
import { seedStats } from "./stats.seed";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed(db: NodePgDatabase<typeof schema>) {
  console.log("🌱 Starting database seeding < teams | athletes >...");
  try {
    await seedTeams(db);
    await seedAthletes(db);
    await seedStats(db);
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding data failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed(db).catch((error) => {
  console.error("Seed script failed:", error);
  process.exit(1);
});
