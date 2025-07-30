import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { predictions } from "@repo/db";
import * as schema from "@repo/db";

export const predictionsData: (typeof predictions.$inferInsert)[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440100",
    participantId: "550e8400-e29b-41d4-a716-446655440090",
    lineId: "550e8400-e29b-41d4-a716-446655440060", // Corresponds to Patrick Mahomes passing yards line
    predictedDirection: "higher",
    isCorrect: true,
    createdAt: new Date("2024-09-01T11:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440101",
    participantId: "550e8400-e29b-41d4-a716-446655440090",
    lineId: "550e8400-e29b-41d4-a716-446655440061", // Travis Kelce receiving touchdowns line
    predictedDirection: "higher",
    isCorrect: true,
    createdAt: new Date("2024-09-01T11:05:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440102",
    participantId: "550e8400-e29b-41d4-a716-446655440091",
    lineId: "550e8400-e29b-41d4-a716-446655440060",
    predictedDirection: "lower",
    isCorrect: false,
    createdAt: new Date("2024-09-01T11:10:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440103",
    participantId: "550e8400-e29b-41d4-a716-446655440093",
    lineId: "550e8400-e29b-41d4-a716-446655440062", // Josh Allen fantasy points line
    predictedDirection: "higher",
    isCorrect: true,
    createdAt: new Date("2024-09-02T15:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440104",
    participantId: "550e8400-e29b-41d4-a716-446655440094",
    lineId: "550e8400-e29b-41d4-a716-446655440062",
    predictedDirection: "lower",
    isCorrect: false,
    createdAt: new Date("2024-09-02T15:10:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440105",
    participantId: "550e8400-e29b-41d4-a716-446655440095",
    lineId: "550e8400-e29b-41d4-a716-446655440063", // Christian McCaffrey rushing yards line
    predictedDirection: "higher",
    isCorrect: null,
    createdAt: new Date("2024-09-10T10:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440106",
    participantId: "550e8400-e29b-41d4-a716-446655440096",
    lineId: "550e8400-e29b-41d4-a716-446655440064", // Cooper Kupp receiving yards line
    predictedDirection: "higher",
    isCorrect: null,
    createdAt: new Date("2024-09-10T10:15:00Z"),
  },
];

export const seedPredictions = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(predictions).values(predictionsData).onConflictDoNothing();
  console.log("✅ Predictions seeded");
};
