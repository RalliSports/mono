
import {
  pgTable,
  varchar,
  decimal,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { participants } from "./participants";
import { athletes } from "./athletes";
import { stats } from "./stats";
import { matchups } from "./matchups";
import { relations } from "drizzle-orm";

import { uuid } from "drizzle-orm/pg-core";

export const predictions = pgTable("predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id").references(() => participants.id),
  athleteId: uuid("athlete_id").references(() => athletes.id),
  statId: uuid("stat_id").references(() => stats.id),
  matchupId: uuid("matchup_id").references(() => matchups.id),
  predictedDirection: varchar("predicted_direction"), // "Higher" | "Lower"
  predictedValue: decimal("predicted_value"),
  actualValue: decimal("actual_value"),
  isCorrect: boolean("is_correct"),
  createdAt: timestamp("created_at").defaultNow(),
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

