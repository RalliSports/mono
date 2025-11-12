import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { athletes, teams } from "@repo/db";
import * as schema from "@repo/db";
// import { nflPreSeasonAthletes } from "./data/athletes/nfl/nfl-preseason-athletes";
// import { nflTeams32 } from "./data/teams/nfl/nfl-teams32";
import { nbaAthletes } from "./data/athletes/nba/nba-athletes-latest";
import { nbaTeams30 } from "./data/teams/nba/nba-teams30";

export const teamsData: (typeof teams.$inferInsert)[] = nbaTeams30;

export const seedAthletes = async (db: NodePgDatabase<typeof schema>) => {
  const getAthleteId = (index: number) => {
    const paddedIndex = String(index + 1).padStart(4, "0");
    return `770e8400-2940-4aa4-b132-44665544${paddedIndex}`; // NBA custom
    // return `550e8400-2940-4aa4-b132-44665544${paddedIndex}`;// NFL custom
  };
  const athletesWithTeamIds: (typeof athletes.$inferInsert)[] =
    nbaAthletes.map((athlete, index) => {
      const team = teamsData.find(
        (team) => {
          const teamName = team.name.toLowerCase();
          const athleteTeamName = athlete.team.toLowerCase();
          return (
            teamName === athleteTeamName
            && team.espnTeamId === athlete.espnTeamId
            && team.leagueType === athlete.leagueType
            && team.sportType === athlete.sportType
          );//strict match - to avoid collisions
        },
      );
      if (!team) {
        throw new Error(`Team ${athlete.team} not found`);
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
