import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { athletes } from "@repo/db";
import * as schema from "@repo/db";
import { preSeasonAthletes } from "./data/athletes/preseason-athletes";
import { teamsData } from "./teams.seed";

export const athletesData: (typeof athletes.$inferInsert)[] = preSeasonAthletes;

export const seedAthletes = async (db: NodePgDatabase<typeof schema>) => {
  const getAthleteId = (index: number) => {
    const paddedIndex = String(index + 1).padStart(4, "0");
    return `550e8400-2940-4aa4-b132-44665544${paddedIndex}`;
  };
  const athletesWithTeamIds = athletesData.map((athlete, index) => {
    const team = teamsData.find((team) => team.name === athlete.teamId);
    if (!team) {
      throw new Error(`Team ${athlete.teamId} not found`);
    }
    return {
      ...athlete,
      teamId: team.id,
      id: getAthleteId(index),
    };
  });

  await db.insert(athletes).values(athletesWithTeamIds).onConflictDoNothing();
  console.log("✅ Athletes seeded");
};
