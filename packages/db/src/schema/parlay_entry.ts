import { numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { parlayTable } from "./parlay";
import { relations } from "drizzle-orm";
import { leg } from "./leg";

export const parlayEntryTable = pgTable("parlay_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  poolId: uuid("pool_id")
    .notNull()
    .references(() => parlayTable.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  score: numeric("score").default("0"),
});

export const parlayEntriesRelations = relations(parlayEntryTable, ({ one, many }) => ({
  pool: one(parlayTable, {
    fields: [parlayEntryTable.poolId],
    references: [parlayTable.id],
  }),

  legs: many(leg),
}));
