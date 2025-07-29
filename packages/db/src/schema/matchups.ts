import { date, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const matchups = pgTable("matchups", {
  id: varchar("id").primaryKey(),
  gameDate: date("game_date"),
  homeTeam: varchar("home_team"),
  awayTeam: varchar("away_team"),
  status: varchar("status"),
  scoreHome: integer("score_home"),
  scoreAway: integer("score_away"),
});
