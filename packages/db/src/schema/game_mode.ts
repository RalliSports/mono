import { relations } from "drizzle-orm";

import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { games } from "./games";
import { uuid } from "drizzle-orm/pg-core";

export const game_mode = pgTable("game_mode", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label"),
  description: varchar("description"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const gameModeRelations = relations(game_mode, ({ many }) => ({
  games: many(games),
}));