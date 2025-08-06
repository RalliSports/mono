import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { lines } from "./lines";

export const stats = pgTable("stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  customId: integer("custom_id").notNull(),
  name: varchar("name"),
  description: varchar("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const statsRelations = relations(stats, ({ many }) => ({
  lines: many(lines),
}));
