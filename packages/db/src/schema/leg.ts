// schema/poolEntryLegs.ts
import { pgTable, uuid, numeric, varchar, text } from "drizzle-orm/pg-core";
import { parlayEntryTable } from "./parlay_entry";
import { relations } from "drizzle-orm";

export const leg = pgTable("legs", {
  id: uuid("id").primaryKey().defaultRandom(),

  entryId: uuid("entry_id")
    .notNull()
    .references(() => parlayEntryTable.id, { onDelete: "cascade" }),

  playerId: text("player_id").notNull(),

  statType: varchar("stat_type", { length: 50 }).notNull(),

  line: numeric("line").notNull(),

  betType: varchar("bet_type", { length: 10 }).notNull(), // "over" | "under"
});

export const poolEntryLegsRelations = relations(leg, ({ one }) => ({
  entry: one(parlayEntryTable, {
    fields: [leg.entryId],
    references: [parlayEntryTable.id],
  }),
}));
