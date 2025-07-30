import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { lines } from "@repo/db";
import * as schema from "@repo/db";

export const linesData: (typeof lines.$inferInsert)[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440060",
    athleteId: "550e8400-e29b-41d4-a716-446655440030", // Josh Allen
    statId: "550e8400-e29b-41d4-a716-446655440040", // passing_yards
    matchupId: "550e8400-e29b-41d4-a716-446655440050", // Chiefs vs Ravens
    predictedValue: "285.5",
    actualValue: "291", // Final actual value from match
    isHigher: true,
    createdAt: new Date("2024-09-01T10:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440061",
    athleteId: "550e8400-e29b-41d4-a716-446655440036", // Travis Kelce
    statId: "550e8400-e29b-41d4-a716-446655440045", // receiving_touchdowns
    matchupId: "550e8400-e29b-41d4-a716-446655440050", // Chiefs vs Ravens
    predictedValue: "1.5",
    actualValue: "2",
    isHigher: true,
    createdAt: new Date("2024-09-01T10:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440062",
    athleteId: "550e8400-e29b-41d4-a716-446655440030", // Josh Allen
    statId: "550e8400-e29b-41d4-a716-446655440047", // fantasy_points
    matchupId: "550e8400-e29b-41d4-a716-446655440051", // Bills vs Dolphins
    predictedValue: "24.0",
    actualValue: "26.12",
    isHigher: true,
    createdAt: new Date("2024-09-02T14:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440063",
    athleteId: "550e8400-e29b-41d4-a716-446655440032", // Christian McCaffrey
    statId: "550e8400-e29b-41d4-a716-446655440042", // rushing_yards
    matchupId: "550e8400-e29b-41d4-a716-446655440052", // 49ers vs Rams
    predictedValue: "120",
    actualValue: null,
    isHigher: null,
    createdAt: new Date("2024-09-10T09:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440064",
    athleteId: "550e8400-e29b-41d4-a716-446655440035", // Cooper Kupp
    statId: "550e8400-e29b-41d4-a716-446655440044", // receiving_yards
    matchupId: "550e8400-e29b-41d4-a716-446655440052", // 49ers vs Rams
    predictedValue: "95",
    actualValue: null,
    isHigher: null,
    createdAt: new Date("2024-09-10T09:10:00Z"),
  },
];

export const seedLines = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(lines).values(linesData).onConflictDoNothing();
  console.log("✅ Lines seeded");
};
