import { relations } from "drizzle-orm";
import { boolean, pgTable, timestamp } from "drizzle-orm/pg-core";
import { games } from "./games";
import { bets } from "./bets";

import { uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { text } from "drizzle-orm/pg-core";

export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  gameId: uuid("game_id").references(() => games.id),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  isWinner: boolean("is_winner"),
  submitTxnSignature: text("created_txn_signature"),
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
    bets: many(bets),
  })
);
