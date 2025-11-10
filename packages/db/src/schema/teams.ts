import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { athletes } from "./athletes";
import { relations } from "drizzle-orm";
import { matchups } from "./matchups";
import { sportTypeEnum, leagueTypeEnum } from "./common_enums";

// Teams Table
export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  espnTeamId: varchar("espn_team_id"),
  name: varchar("name", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  foundedYear: integer("founded_year"),
  coachName: varchar("coach_name", { length: 100 }),
  avatar: varchar("avatar"),
  abbreviation: varchar("abbreviation", { length: 3 }),
  sportType: sportTypeEnum("sport_type"),
  leagueType: leagueTypeEnum("league_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const teamsRelations = relations(teams, ({ many }) => ({
  athletes: many(athletes),
  homeMatchups: many(matchups),
  awayMatchups: many(matchups),
}));
