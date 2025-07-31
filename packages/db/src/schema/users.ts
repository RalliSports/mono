import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { relations } from "drizzle-orm";
import { participants } from "./participants";
import { games } from "./games";

import { uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:  uuid("id").primaryKey().defaultRandom(),
  username: varchar("username"),
  emailAddress: varchar("email_address"),
  walletAddress: varchar("wallet_address"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  roleId: uuid("role_id").references(() => roles.id),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  games: many(games),
  participants: many(participants),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));