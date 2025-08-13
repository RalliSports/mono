import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { games, game_access } from "@repo/db";
import * as schema from "@repo/db";

export const gamesData: (typeof games.$inferInsert)[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440070",
    title: "Week 1 Super Bowl Champions Showdown",
    creatorId: "550e8400-e29b-41d4-a716-446655440011",
    depositAmount: 25.0,
    currency: "USD",
    status: "completed",
    maxParticipants: 10,
    gameCode: "W1SHOW24",
    matchupGroup: "Week 1",
    depositToken: "USDC",
    isPrivate: false,
    type: "limited",
    userControlType: "none",
    gameModeId: "550e8400-e29b-41d4-a716-446655440021",
    createdAt: new Date("2024-09-01T10:00:00Z"),
    createdTxnSignature: "123",
    resolvedTxnSignature: "123",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440071",
    title: "Bills vs Dolphins Head-to-Head",
    creatorId: "550e8400-e29b-41d4-a716-446655440012",
    depositAmount: 50.0,
    currency: "ETH",
    status: "completed",
    maxParticipants: 2,
    gameCode: "BUFMIA24",
    matchupGroup: "Week 1",
    depositToken: "ETH",
    isPrivate: false,
    type: "1v1",
    userControlType: "none",
    gameModeId: "550e8400-e29b-41d4-a716-446655440023",
    createdAt: new Date("2024-09-02T14:30:00Z"),
    createdTxnSignature: "123",
    resolvedTxnSignature: "123",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440072",
    title: "NFC West Prediction Challenge",
    creatorId: "550e8400-e29b-41d4-a716-446655440013",
    depositAmount: 10.0,
    currency: "USD",
    status: "active",
    maxParticipants: 20,
    gameCode: "NFCW24",
    matchupGroup: "Week 2",
    depositToken: "USDT",
    isPrivate: false,
    type: "limited",
    userControlType: "none",
    gameModeId: "550e8400-e29b-41d4-a716-446655440021",
    createdAt: new Date("2024-09-10T09:00:00Z"),
    createdTxnSignature: "123",
    resolvedTxnSignature: "123",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440073",
    title: "Private League Champions",
    creatorId: "550e8400-e29b-41d4-a716-446655440014",
    depositAmount: 100.0,
    currency: "USD",
    status: "pending",
    maxParticipants: 8,
    gameCode: "PRIVCHMP",
    matchupGroup: "Week 3",
    depositToken: "USDC",
    isPrivate: true,
    type: "limited",
    userControlType: "whitelist",
    gameModeId: "550e8400-e29b-41d4-a716-446655440022",
    createdAt: new Date("2024-09-15T16:00:00Z"),
    createdTxnSignature: "123",
    resolvedTxnSignature: "123",
  },
];

export const gameAccessData: (typeof game_access.$inferInsert)[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440080",
    gameId: "550e8400-e29b-41d4-a716-446655440073",
    userId: "550e8400-e29b-41d4-a716-446655440011",
    status: "whitelisted",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440081",
    gameId: "550e8400-e29b-41d4-a716-446655440073",
    userId: "550e8400-e29b-41d4-a716-446655440012",
    status: "whitelisted",
  },
];

export const seedGames = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(games).values(gamesData).onConflictDoNothing();
  await db.insert(game_access).values(gameAccessData).onConflictDoNothing();
  console.log("✅ Games and game access seeded");
};
