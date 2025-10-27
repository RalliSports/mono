import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { athletes } from "./athletes";
import { bets } from "./bets";
import { matchups } from "./matchups";
import { stats } from "./stats";

export const lineStatusEnum = pgEnum("line_status", [
  "open", // Open for bets, not started
  "locked", // Locked once matchup starts, no more bets
  "resolved", // Result is known, bets settled
  "cancelled", // Event cancelled, bets refunded
]);

export const lines = pgTable("lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: lineStatusEnum("status").default("open"),
  athleteId: uuid("athlete_id").references(() => athletes.id),
  statId: uuid("stat_id").references(() => stats.id),
  matchupId: uuid("matchup_id").references(() => matchups.id),
  predictedValue: decimal("predicted_value"),
  oddsOver: decimal("odds_over"),
  oddsUnder: decimal("odds_under"),
  actualValue: decimal("actual_value"),
  currentValue: decimal("current_value"),
  isHigher: boolean("is_higher"),
  isLatestOne: boolean("is_latest_one").default(true),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
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
