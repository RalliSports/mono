import { uuid } from "drizzle-orm/pg-core";
import {
  date,
  integer,
  pgTable,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { lines } from "./lines";
import { matchup_performance } from "./matchup_performance";
import { relations } from "drizzle-orm";
import { teams } from "./teams";

export const matchups = pgTable("matchups", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameDate: date("game_date"),
  startsAt: timestamp("starts_at"),
  homeTeam: varchar("home_team"),
  awayTeam: varchar("away_team"),
  status: varchar("status"),
  scoreHome: integer("score_home"),
  scoreAway: integer("score_away"),
  homeTeamId: uuid("home_team_id").references(() => teams.id),
  awayTeamId: uuid("away_team_id").references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matchupsRelations = relations(matchups, ({ many, one }) => ({
  lines: many(lines),
  matchupPerformances: many(matchup_performance),
  homeTeam: one(teams, {
    fields: [matchups.homeTeamId],
    references: [teams.id],
  }),
  awayTeam: one(teams, {
    fields: [matchups.awayTeamId],
    references: [teams.id],
  }),
}));
