import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { teams } from "@repo/db";
import * as schema from "@repo/db";
import { preSeasonTeams32 } from "./data/teams/preseason-teams32";

export const teamsData: (typeof teams.$inferInsert)[] = preSeasonTeams32;

export const seedTeams = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(teams).values(teamsData).onConflictDoNothing();
  console.log("✅ Teams seeded");
};
