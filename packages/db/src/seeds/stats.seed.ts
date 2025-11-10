import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { stats } from "@repo/db";
import * as schema from "@repo/db";
import { statsData } from "./data/stats/nfl/stats-data";

export const seedStats = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(stats).values(statsData).onConflictDoNothing();
  console.log("✅ Stats seeded");
};
