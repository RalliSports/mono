import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { matchups, matchup_performance } from "@repo/db";
import * as schema from "@repo/db";

export const matchupsData: (typeof matchups.$inferInsert)[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440050",
    gameDate: "2024-09-08", // ✅ String format, not Date object
    homeTeam: "Kansas City Chiefs",
    awayTeam: "Baltimore Ravens",
    status: "finished",
    scoreHome: 27,
    scoreAway: 20,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440051",
    gameDate: "2024-09-08", // ✅ String format
    homeTeam: "Buffalo Bills",
    awayTeam: "Miami Dolphins",
    status: "finished",
    scoreHome: 31,
    scoreAway: 17,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440052",
    gameDate: "2024-09-15", // ✅ String format
    homeTeam: "San Francisco 49ers",
    awayTeam: "Los Angeles Rams",
    status: "in_progress",
    scoreHome: 14,
    scoreAway: 7,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440053",
    gameDate: "2024-09-22", // ✅ String format
    homeTeam: "Miami Dolphins",
    awayTeam: "Kansas City Chiefs",
    status: "scheduled",
    scoreHome: null,
    scoreAway: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440060",
    gameDate: "2025-08-05",
    homeTeam: "Indianapolis Colts",
    awayTeam: "Houston Texans",
    status: "finished",
    scoreHome: 30,
    scoreAway: 24,
  },
];

export const matchupPerformanceData = [
  // Anthony Richardson Sr. vs Texans
  {
    id: "a9a1e36c-7efa-4a8f-a079-111111111111",
    matchupId: "550e8400-e29b-41d4-a716-446655440060",
    athleteId: "e91e546f-75a0-4bfb-9bb5-3e21d2258edf", // Anthony Richardson Sr.
    stats: {
      passing_yards: 261,
      passing_touchdowns: 2,
      rushing_yards: 41,
      rushing_touchdowns: 1,
      fantasy_points: 23.7,
    },
  },
  // Michael Pittman Jr. vs Texans
  {
    id: "b2c5f4dd-4aed-462a-b2e7-222222222222",
    matchupId: "550e8400-e29b-41d4-a716-446655440060",
    athleteId: "9528068f-57b5-4380-bc04-f4238057b440", // Michael Pittman Jr.
    stats: {
      receiving_yards: 83,
      receiving_touchdowns: 1,
      receptions: 6,
      fantasy_points: 17.3,
    },
  },
  // Tim Smith vs Texans (defensive)
  {
    id: "c3d7e8aa-1cbe-4f50-9a1b-333333333333",
    matchupId: "550e8400-e29b-41d4-a716-446655440060",
    athleteId: "1aae0249-6b34-41a3-87b9-5131b91fb9af", // Tim Smith
    stats: {
      total_tackles: 6,
      sacks: 0.5,
      fumbles: 1,
    },
  },
];

export const seedMatchups = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(matchups).values(matchupsData).onConflictDoNothing();
  await db
    .insert(matchup_performance)
    .values(matchupPerformanceData)
    .onConflictDoNothing();
  console.log("✅ Matchups and performances seeded");
};
