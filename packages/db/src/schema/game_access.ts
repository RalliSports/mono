import { relations } from "drizzle-orm";

import { pgTable, varchar, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { games } from "./games";
import { users } from "./users";
import { uuid } from "drizzle-orm/pg-core";

export const accessStatusEnum = pgEnum("access_status", ["whitelisted", "blacklisted"]);

export const game_access = pgTable("game_access", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id"),
  userId: varchar("user_id"),
  status: accessStatusEnum("status"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const gameAccessRelations = relations(game_access, ({ one }) => ({
  game: one(games, {
    fields: [game_access.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [game_access.userId],
    references: [users.id],
  }),
}));