import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { lines } from "./lines";

export const stats = pgTable("stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  customId: integer("custom_id").notNull().unique(),
  name: varchar("name"),
  displayName: varchar("display_name"),
  shortDisplayName: varchar("short_display_name"),
  abbreviation: varchar("abbreviation"),
  statOddsName: varchar("stat_odds_name"),
  oddsApiStatName: varchar("odds_api_stat_name"),
  description: varchar("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const statsRelations = relations(stats, ({ many }) => ({
  lines: many(lines),
}));
