import { pgTable, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { games } from "./games";
import { relations } from "drizzle-orm";
import { predictions } from "./predictions";

export const participants = pgTable("participants", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  gameId: varchar("game_id").references(() => games.id),
  joinedAt: timestamp("joined_at", { withTimezone: true }),
  isWinner: boolean("is_winner"),
});


export const participantsRelations = relations(participants, ({ one, many }) => ({
  game: one(games, {
    fields: [participants.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [participants.userId],
    references: [users.id],
  }),
  predictions: many(predictions),
}));