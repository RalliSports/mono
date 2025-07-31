import { relations } from "drizzle-orm";
import { pgTable, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { lines } from "./lines";

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  description: varchar("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const statsRelations = relations(stats, ({ many }) => ({
  lines: many(lines),
}));
