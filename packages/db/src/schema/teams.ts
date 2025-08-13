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

// Teams Table
export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  foundedYear: integer("founded_year"),
  coachName: varchar("coach_name", { length: 100 }),
  avatar: varchar("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  abbreviation: varchar("abbreviation", { length: 3 }),
});

// Relations
export const teamsRelations = relations(teams, ({ many }) => ({
  athletes: many(athletes),
  homeMatchups: many(matchups),
  awayMatchups: many(matchups),
}));
