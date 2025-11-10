import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { teams } from "@repo/db";
import * as schema from "@repo/db";
// import { nflTeams32 } from "./data/teams/nfl/nfl-teams32";
import { nbaTeams30 } from "./data/teams/nba/nba-teams30";

export const teamsData: (typeof teams.$inferInsert)[] = nbaTeams30;

export const seedTeams = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(teams).values(teamsData).onConflictDoNothing();
  console.log("✅ Teams seeded");
};
