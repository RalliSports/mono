import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { games } from "./games";
import { participants } from "./participants";
import { roles } from "./roles";

import { text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletAddress: varchar("wallet_address"),
  emailAddress: varchar("email_address"),
  paraUserId: text("para_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  // roleId: uuid("role_id").references(() => roles.id),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  games: many(games),
  participants: many(participants),
  role: one(roles),
}));
