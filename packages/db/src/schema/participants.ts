import { pgTable, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { games } from "./games";
import { relations } from "drizzle-orm";
import { predictions } from "./predictions";
import { uuid } from "drizzle-orm/pg-core";

export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id"),
  gameId: uuid("game_id").references(() => games.id),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  isWinner: boolean("is_winner"),
});


export const participantsRelations = relations(participants, ({ one, many }) => ({
  game: one(games, {
    fields: [participants.gameId],
    references: [games.id],
  }),
  // user: one(users, {
  //   fields: [participants.userId],
  //   references: [users.id],
  // }),
  predictions: many(predictions),
}));