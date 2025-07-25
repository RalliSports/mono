import { pgTable, varchar, decimal, boolean } from "drizzle-orm/pg-core";
import { participants } from "./participants";
import { athletes } from "./athletes";
import { stats } from "./stats";
import { matchups } from "./matchups";
import { relations } from "drizzle-orm";

export const predictions = pgTable("predictions", {
  id: varchar("id").primaryKey(),
  participantId: varchar("participant_id").references(() => participants.id),
  athleteId: varchar("athlete_id").references(() => athletes.id),
  statId: varchar("stat_id").references(() => stats.id),
  matchupId: varchar("matchup_id").references(() => matchups.id),
  predictedDirection: varchar("predicted_direction"), // "Higher" | "Lower"
  predictedValue: decimal("predicted_value"),
  actualValue: decimal("actual_value"),
  isCorrect: boolean("is_correct"),
});


export const predictionsRelations = relations(predictions, ({ one }) => ({
  participant: one(participants, {
    fields: [predictions.participantId],
    references: [participants.id],
  }),
  athlete: one(athletes, {
    fields: [predictions.athleteId],
    references: [athletes.id],
  }),
  stat: one(stats, {
    fields: [predictions.statId],
    references: [stats.id],
  }),
  matchup: one(matchups, {
    fields: [predictions.matchupId],
    references: [matchups.id],
  }),
}));