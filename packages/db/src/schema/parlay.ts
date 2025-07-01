import { relations } from "drizzle-orm";
import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { parlayStatus } from "./_enums";
import { parlayEntryTable } from "./parlay_entry";

export const parlayTable = pgTable("parlays", {
  id: uuid("id").primaryKey().defaultRandom(),
  entryAmount: numeric("entry_amount", { mode: "number" }).notNull(),
  status: parlayStatus("status").notNull(),
  createdBy: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parlayRelations = relations(parlayTable, ({ many }) => ({
  entries: many(parlayEntryTable),
}));
