import { uuid } from "drizzle-orm/pg-core";
import {
  date,
  integer,
  pgTable,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

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
