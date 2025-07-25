import { relations } from "drizzle-orm";
import { pgTable, varchar, pgEnum } from "drizzle-orm/pg-core";
import { games } from "./games";
import { users } from "./users";

export const accessStatusEnum = pgEnum("accessStatus", ["whitelisted", "blacklisted"]);

export const game_access = pgTable("game_access", {
  id: varchar("id").primaryKey(),
  gameId: varchar("game_id"),
  userId: varchar("user_id"),
  status: accessStatusEnum("accessStatus"),
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