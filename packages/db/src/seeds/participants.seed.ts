import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { participants } from "@repo/db";
import * as schema from "@repo/db";

export const participantsData: (typeof participants.$inferInsert)[] = [
  // Week 1 Super Bowl Champions Showdown participants
  {
    id: "550e8400-e29b-41d4-a716-446655440090",
    userId: "550e8400-e29b-41d4-a716-446655440011",
    gameId: "550e8400-e29b-41d4-a716-446655440070",
    joinedAt: new Date("2024-09-01T10:05:00Z"),
    isWinner: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440091",
    userId: "550e8400-e29b-41d4-a716-446655440012",
    gameId: "550e8400-e29b-41d4-a716-446655440070",
    joinedAt: new Date("2024-09-01T11:30:00Z"),
    isWinner: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440092",
    userId: "550e8400-e29b-41d4-a716-446655440013",
    gameId: "550e8400-e29b-41d4-a716-446655440070",
    joinedAt: new Date("2024-09-01T13:15:00Z"),
    isWinner: false,
  },
  // Bills vs Dolphins Head-to-Head participants
  {
    id: "550e8400-e29b-41d4-a716-446655440093",
    userId: "550e8400-e29b-41d4-a716-446655440012",
    gameId: "550e8400-e29b-41d4-a716-446655440071",
    joinedAt: new Date("2024-09-02T14:35:00Z"),
    isWinner: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440094",
    userId: "550e8400-e29b-41d4-a716-446655440014",
    gameId: "550e8400-e29b-41d4-a716-446655440071",
    joinedAt: new Date("2024-09-02T15:20:00Z"),
    isWinner: false,
  },
  // NFC West Prediction Challenge participants
  {
    id: "550e8400-e29b-41d4-a716-446655440095",
    userId: "550e8400-e29b-41d4-a716-446655440013",
    gameId: "550e8400-e29b-41d4-a716-446655440072",
    joinedAt: new Date("2024-09-10T09:30:00Z"),
    isWinner: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440096",
    userId: "550e8400-e29b-41d4-a716-446655440011",
    gameId: "550e8400-e29b-41d4-a716-446655440072",
    joinedAt: new Date("2024-09-10T10:45:00Z"),
    isWinner: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440097",
    userId: "550e8400-e29b-41d4-a716-446655440014",
    gameId: "550e8400-e29b-41d4-a716-446655440072",
    joinedAt: new Date("2024-09-10T12:00:00Z"),
    isWinner: false,
  },
];

export const seedParticipants = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(participants).values(participantsData).onConflictDoNothing();
  console.log("✅ Participants seeded");
};
