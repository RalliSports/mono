import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { games } from "./games";
import { lines } from "./lines";
import { participants } from "./participants";
import { users } from "./users";

export const predictedDirectionEnum = pgEnum("predicted_direction", [
  "over",
  "under",
]);

export const bets = pgTable("bets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  participantId: uuid("participant_id").references(() => participants.id),
  lineId: uuid("line_id").references(() => lines.id),
  gameId: uuid("game_id").references(() => games.id),
  predictedDirection: predictedDirectionEnum("predicted_direction"),
  isCorrect: boolean("is_correct"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const betsRelations = relations(bets, ({ one }) => ({
  user: one(users, {
    fields: [bets.userId],
    references: [users.id],
  }),
  participant: one(participants, {
    fields: [bets.participantId],
    references: [participants.id],
  }),
  line: one(lines, {
    fields: [bets.lineId],
    references: [lines.id],
  }),
  game: one(games, {
    fields: [bets.gameId],
    references: [games.id],
  }),
}));
