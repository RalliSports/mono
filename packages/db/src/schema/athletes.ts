import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  integer,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { lines } from "./lines";
import { matchup_performance } from "./matchup_performance";
import { uuid } from "drizzle-orm/pg-core";
import { teams } from "./teams";

export const athletes = pgTable("athletes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  team: varchar("team"),
  position: varchar("position"),
  jerseyNumber: integer("jersey_number"),
  age: integer("age"),
  picture: varchar("picture"),
  customId: serial("custom_id").unique(),
  teamId: uuid("team_id").references(() => teams.id),

  createdAt: timestamp("created_at").defaultNow(),
});

export const athletesRelations = relations(athletes, ({ many, one }) => ({
  lines: many(lines),
  matchupPerformances: many(matchup_performance),
  team: one(teams, {
    fields: [athletes.teamId],
    references: [teams.id],
  }),
}));
