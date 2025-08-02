import { relations } from "drizzle-orm";
import { boolean, pgTable, timestamp } from "drizzle-orm/pg-core";
import { games } from "./games";
import { predictions } from "./predictions";

import { uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  gameId: uuid("game_id").references(() => games.id),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  isWinner: boolean("is_winner"),
});

export const participantsRelations = relations(
  participants,
  ({ one, many }) => ({
    game: one(games, {
      fields: [participants.gameId],
      references: [games.id],
    }),

    user: one(users, {
      fields: [participants.userId],
      references: [users.id],
    }),
    predictions: many(predictions),
  })
);
