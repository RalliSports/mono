import {
  pgTable,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

// Tokens Table
export const tokens = pgTable("tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  ticker: varchar("ticker").notNull(),
  mint: varchar("mint").notNull(),
  cluster: varchar("cluster").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
