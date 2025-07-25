import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { predictions } from "./predictions";

export const stats = pgTable("stats", {
  id: varchar("id").primaryKey(),
  name: varchar("name"),
  description: varchar("description"),
});


export const statsRelations = relations(stats, ({ many }) => ({
  predictions: many(predictions),
}));