import { relations } from "drizzle-orm";
import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { predictions } from "./predictions";
import { matchup_performance } from "./matchup_performance";

export const athletes = pgTable("athletes", {
  id: varchar("id").primaryKey(),
  name: varchar("name"),
  team: varchar("team"),
  position: varchar("position"),
  jerseyNumber: integer("jersey_number"),
  age: integer("age"),
  picture: varchar("picture"),
});

export const athletesRelations = relations(athletes, ({ many }) => ({
  predictions: many(predictions),
  matchupPerformances: many(matchup_performance),
}));