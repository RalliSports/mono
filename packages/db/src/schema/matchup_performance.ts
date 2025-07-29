import { pgTable, varchar, json } from "drizzle-orm/pg-core";
import { matchups } from "./matchups";
import { athletes } from "./athletes";
import { relations } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";

export const matchup_performance = pgTable("matchup_performance", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchupId: uuid("matchup_id").references(() => matchups.id),
  athleteId: uuid("athlete_id").references(() => athletes.id),
  stats: json("stats"),
  
});

export const matchupPerformanceRelations = relations(matchup_performance, ({ one }) => ({
  matchup: one(matchups, {
    fields: [matchup_performance.matchupId],
    references: [matchups.id],
  }),
  athlete: one(athletes, {
    fields: [matchup_performance.athleteId],
    references: [athletes.id],
  }),
}));