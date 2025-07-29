import { relations } from "drizzle-orm";

import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { predictions } from "./predictions";
import { uuid } from "drizzle-orm/pg-core";

export const stats = pgTable("stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  description: varchar("description"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const statsRelations = relations(stats, ({ many }) => ({
  predictions: many(predictions),
}));