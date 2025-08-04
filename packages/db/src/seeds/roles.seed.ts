import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { roles } from "@repo/db";
import * as schema from "@repo/db";

export const rolesData: (typeof roles.$inferInsert)[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    type: "admin",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    type: "user",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    type: "moderator",
  },
];

export const seedRoles = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(roles).values(rolesData).onConflictDoNothing();
  console.log("✅ Roles seeded");
};
