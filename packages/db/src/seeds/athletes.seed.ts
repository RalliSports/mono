import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { athletes } from "@repo/db";
import * as schema from "@repo/db";
import { preSeasonAthletes } from "./data/athletes/preseason-athletes";

export const athletesData: (typeof athletes.$inferInsert)[] = preSeasonAthletes;

export const seedAthletes = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(athletes).values(athletesData).onConflictDoNothing();
  console.log("✅ Athletes seeded");
};
