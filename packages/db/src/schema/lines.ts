import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { athletes } from "./athletes";
import { bets } from "./bets";
import { matchups } from "./matchups";
import { stats } from "./stats";

export const lines = pgTable("lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  athleteId: uuid("athlete_id").references(() => athletes.id),
  statId: uuid("stat_id").references(() => stats.id),
  matchupId: uuid("matchup_id").references(() => matchups.id),
  predictedValue: decimal("predicted_value"),
  actualValue: decimal("actual_value"),
  isHigher: boolean("is_higher"),
  createdAt: timestamp("created_at").defaultNow(),
  startsAt: timestamp("starts_at"),
  createdTxnSignature: text("created_txn_signature"),
  resolvedTxnSignature: text("resolved_txn_signature"),
});

export const linesRelations = relations(lines, ({ one, many }) => ({
  athlete: one(athletes, {
    fields: [lines.athleteId],
    references: [athletes.id],
  }),
  stat: one(stats, {
    fields: [lines.statId],
    references: [stats.id],
  }),
  matchup: one(matchups, {
    fields: [lines.matchupId],
    references: [matchups.id],
  }),
  bets: many(bets),
}));
