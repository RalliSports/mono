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
import { sportTypeEnum, leagueTypeEnum } from "./common_enums";


export const athletes = pgTable("athletes", {
  id: uuid("id").primaryKey().defaultRandom(),
  customId: serial("custom_id").unique(),
  espnAthleteId: varchar("espn_athlete_id"),
  name: varchar("name"),
  position: varchar("position"),
  jerseyNumber: integer("jersey_number"),
  age: integer("age"),
  picture: varchar("picture"),
  teamId: uuid("team_id").references(() => teams.id),
  sportType: sportTypeEnum("sport_type"),
  leagueType: leagueTypeEnum("league_type"),
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
