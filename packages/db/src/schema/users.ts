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
import { bets } from "./bets";
import { pushSubscriptions } from "./push_subscriptions";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username"),
  avatar: text("avatar"),
  walletAddress: varchar("wallet_address"),
  emailAddress: varchar("email_address").unique(),
  paraUserId: text("para_user_id").unique(),
  hasBeenFaucetedSol: boolean("has_been_fauceted_sol").default(false),
  // roleId: uuid("role_id").references(() => roles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  games: many(games),
  participants: many(participants),
  role: one(roles),
  bets: many(bets),
  pushSubscriptions: many(pushSubscriptions),
}));
