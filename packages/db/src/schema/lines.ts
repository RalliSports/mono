import { pgTable, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { athletes } from "./athletes";
import { stats } from "./stats";
import { matchups } from "./matchups";
import { relations } from "drizzle-orm";
import { predictions } from "./predictions";
import { serial } from "drizzle-orm/pg-core";

export const lines = pgTable("lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  athleteId: uuid("athlete_id").references(() => athletes.id),
  statId: serial("stat_id").references(() => stats.id),
  matchupId: uuid("matchup_id").references(() => matchups.id),
  predictedValue: decimal("predicted_value"),
  actualValue: decimal("actual_value"),
  isHigher: boolean("is_higher"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const linesRelations = relations(lines, ({ one, many }) => ({
  athlete: one(athletes, {
    fields: [lines.athleteId],
    references: [athletes.id],
  }),
  stat: one(stats, {
    fields: [lines.statId],
    references: [stats.id],
  }),
  matchup: one(matchups, {
    fields: [lines.matchupId],
    references: [matchups.id],
  }),
  predictions: many(predictions),
}));
