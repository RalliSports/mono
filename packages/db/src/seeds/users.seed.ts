import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "@repo/db";
import * as schema from "@repo/db";

export const usersData: (typeof users.$inferInsert)[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    emailAddress: "admin@example.com",
    walletAddress: "0x742d35Cc691C0532925a3b8D7c57B6e8D4C4CE89",
    paraUserId: "550e8400-e29b-41d4-a716-446655440001",
    roleId: "550e8400-e29b-41d4-a716-446655440001",
    createdAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    emailAddress: "fantasy@example.com",
    walletAddress: "0x8ba1f109551bD432803012645Hac136c9",
    paraUserId: "550e8400-e29b-41d4-a716-446655440002",
    roleId: "550e8400-e29b-41d4-a716-446655440002",
    createdAt: new Date("2024-02-10T14:30:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    emailAddress: "nfl@example.com",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    paraUserId: "550e8400-e29b-41d4-a716-446655440002",
    roleId: "550e8400-e29b-41d4-a716-446655440002",
    createdAt: new Date("2024-02-12T09:15:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440013",
    emailAddress: "touchdown_master@example.com",
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    paraUserId: "550e8400-e29b-41d4-a716-446655440002",
    roleId: "550e8400-e29b-41d4-a716-446655440002",
    createdAt: new Date("2024-02-14T16:45:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440014",
    emailAddress: "draft_genius@example.com",
    walletAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
    paraUserId: "550e8400-e29b-41d4-a716-446655440002",
    roleId: "550e8400-e29b-41d4-a716-446655440002",
    createdAt: new Date("2024-02-16T11:20:00Z"),
  },
];

export const seedUsers = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(users).values(usersData).onConflictDoNothing();
  console.log("✅ Users seeded");
};
