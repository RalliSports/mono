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

export const matchups = pgTable("matchups", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameDate: date("game_date"),
  homeTeam: varchar("home_team"),
  awayTeam: varchar("away_team"),
  status: varchar("status"),
  scoreHome: integer("score_home"),
  scoreAway: integer("score_away"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matchupsRelations = relations(matchups, ({ many }) => ({
  lines: many(lines),
  matchupPerformances: many(matchup_performance),
}));
