import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games";
import { participants } from "./participants";
import { roles } from "./roles";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  userName: text("user_name"),
  avatar: text("avatar"),
  walletAddress: varchar("wallet_address"),
  emailAddress: varchar("email_address"),
  paraUserId: text("para_user_id"),
  hasBeenFaucetedSol: boolean("has_been_fauceted_sol"),
  // roleId: uuid("role_id").references(() => roles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  games: many(games),
  participants: many(participants),
  role: one(roles),
}));
