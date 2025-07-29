import { relations } from "drizzle-orm";
import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { predictions } from "./predictions";
import { matchup_performance } from "./matchup_performance";
import { uuid } from "drizzle-orm/pg-core";

export const athletes = pgTable("athletes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  team: varchar("team"),
  position: varchar("position"),
  jerseyNumber: integer("jersey_number"),
  age: integer("age"),
  picture: varchar("picture"),
  createdAt: timestamp("created_at").defaultNow(),
  
});

export const athletesRelations = relations(athletes, ({ many }) => ({
  predictions: many(predictions),
  matchupPerformances: many(matchup_performance),
}));