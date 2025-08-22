import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { stats } from "@repo/db";
import * as schema from "@repo/db";
import { statsData } from "./data/stats/stats-data";
import { eq } from "drizzle-orm";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

export const updateStats = async (db: NodePgDatabase<typeof schema>) => {
  for (const stat of statsData) {
    await db
      .update(stats)
      .set({
        name: stat.name,
        description: stat.description,
        displayName: stat.displayName,
        shortDisplayName: stat.shortDisplayName,
        abbreviation: stat.abbreviation,
        statOddsName: stat.statOddsName,
      })
      .where(eq(stats.customId, stat.customId));
  }
  console.log("✅ Stats updated");
};

async function seed(db: NodePgDatabase<typeof schema>) {
  console.log("🌱 Updating stats...");
  try {
    await updateStats(db);
    console.log("🎉 Stats updated successfully!");
  } catch (error) {
    console.error(" ❌ Stats update failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed(db).catch((error) => {
  console.error("Stats update failed:", error);
  process.exit(1);
});
