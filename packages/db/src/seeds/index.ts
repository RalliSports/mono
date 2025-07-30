import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@repo/db";
import { seedRoles } from "./roles.seed";
import { seedUsers } from "./users.seed";
import { seedGameModes } from "./game-modes.seed";
import { seedAthletes } from "./athletes.seed";
import { seedStats } from "./stats.seed";
import { seedMatchups } from "./matchups.seed";
import { seedGames } from "./games.seed";
import { seedParticipants } from "./participants.seed";
import { seedPredictions } from "./predictions.seed";
import { seedLines } from "./lines.seed";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed(db: NodePgDatabase<typeof schema>) {
  console.log("🌱 Starting database seeding...");
  try {
    await seedRoles(db);
    await seedUsers(db);
    await seedGameModes(db);
    await seedAthletes(db);
    await seedStats(db);
    await seedMatchups(db);
    await seedGames(db);
    await seedParticipants(db);
    await seedLines(db);
    await seedPredictions(db);
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
