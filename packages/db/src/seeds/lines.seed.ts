import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { lines } from "@repo/db";
import * as schema from "@repo/db";

export const linesData: (typeof lines.$inferInsert)[] = [
  {
    id: "a1f5c8b2-1234-4d8a-9b3e-111111111111",
    athleteId: "1aae0249-6b34-41a3-87b9-5131b91fb9af", // Tim Smith
    statId: "550e8401-e29b-41d4-a716-446655440001", // total_tackles
    matchupId: "550e8400-e29b-41d4-a716-446655440050",
    predictedValue: "4.5",
    actualValue: "6",
    isHigher: true,
    createdAt: new Date("2025-08-05T10:00:00Z"),
    startsAt: new Date("2025-08-05T10:00:00Z"),
  },
  {
    id: "b7d4e9c3-5678-4e9f-8c75-222222222222",
    athleteId: "8bd865b0-22dc-42b5-aa73-d37dd3729765", // Grover Stewart
    statId: "550e8401-e29b-41d4-a716-446655440026", // sacks
    matchupId: "550e8400-e29b-41d4-a716-446655440051",
    predictedValue: "0.5",
    actualValue: "1",
    isHigher: true,
    createdAt: new Date("2025-08-05T10:00:00Z"),
    startsAt: new Date("2025-08-05T10:00:00Z"),
  },
  {
    id: "c62f0b74-9abc-463d-81a3-333333333333",
    athleteId: "e91e546f-75a0-4bfb-9bb5-3e21d2258edf", // Anthony Richardson Sr.
    statId: "550e8401-e29b-41d4-a716-446655440001", // passing_yards
    matchupId: "550e8400-e29b-41d4-a716-446655440050",
    predictedValue: "245.5",
    actualValue: "261",
    isHigher: true,
    createdAt: new Date("2025-08-05T11:00:00Z"),
    startsAt: new Date("2025-08-05T11:00:00Z"),
  },
  {
    id: "d94caf85-3456-4fef-90d1-444444444444",
    athleteId: "9528068f-57b5-4380-bc04-f4238057b440", // Michael Pittman Jr.
    statId: "550e8401-e29b-41d4-a716-446655440014", // receiving_yards
    matchupId: "550e8400-e29b-41d4-a716-446655440051",
    predictedValue: "78.0",
    actualValue: null,
    isHigher: null,
    createdAt: new Date("2025-08-05T11:00:00Z"),
    startsAt: new Date("2025-08-05T11:00:00Z"),
  },
  {
    id: "e374c296-7890-4edb-91af-555555555555",
    athleteId: "17b27fd9-8ebe-4ce7-9e84-cb34714386a6", // Spencer Shrader
    statId: "550e8401-e29b-41d4-a716-446655440028", // field_goals_made
    matchupId: "550e8400-e29b-41d4-a716-446655440050",
    predictedValue: "1.5",
    actualValue: null,
    isHigher: null,
    createdAt: new Date("2025-08-05T12:00:00Z"),
    startsAt: new Date("2025-08-05T12:00:00Z"),
  },
];

export const seedLines = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(lines).values(linesData).onConflictDoNothing();
  console.log("✅ Lines seeded");
};
