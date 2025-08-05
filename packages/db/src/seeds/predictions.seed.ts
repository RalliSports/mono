import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { predictions } from "@repo/db";
import * as schema from "@repo/db";

export const predictionsData: (typeof predictions.$inferInsert)[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440100",
    participantId: "550e8400-e29b-41d4-a716-446655440090",
    lineId: "a1f5c8b2-1234-4d8a-9b3e-111111111111", // Tim Smith line (updated)
    predictedDirection: "higher",
    isCorrect: true,
    createdAt: new Date("2024-09-01T11:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440101",
    participantId: "550e8400-e29b-41d4-a716-446655440090",
    lineId: "b7d4e9c3-5678-4e9f-8c75-222222222222", // Grover Stewart line (updated)
    predictedDirection: "higher",
    isCorrect: true,
    createdAt: new Date("2024-09-01T11:05:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440102",
    participantId: "550e8400-e29b-41d4-a716-446655440091",
    lineId: "c62f0b74-9abc-463d-81a3-333333333333", // Anthony Richardson Sr. line (updated)
    predictedDirection: "lower",
    isCorrect: false,
    createdAt: new Date("2024-09-01T11:10:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440103",
    participantId: "550e8400-e29b-41d4-a716-446655440093",
    lineId: "d94caf85-3456-4fef-90d1-444444444444", // Michael Pittman Jr. line (updated)
    predictedDirection: "higher",
    isCorrect: null,
    createdAt: new Date("2024-09-02T15:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440104",
    participantId: "550e8400-e29b-41d4-a716-446655440094",
    lineId: "e374c296-7890-4edb-91af-555555555555", // Spencer Shrader line (updated)
    predictedDirection: "lower",
    isCorrect: null,
    createdAt: new Date("2024-09-02T15:10:00Z"),
  },
];

export const seedPredictions = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(predictions).values(predictionsData).onConflictDoNothing();
  console.log("✅ Predictions seeded");
};
