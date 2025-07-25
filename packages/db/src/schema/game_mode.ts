import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { games } from "./games";

export const game_mode = pgTable("game_mode", {
  id: varchar("id").primaryKey(),
  label: varchar("label"),
  description: varchar("description"),
});


export const gameModeRelations = relations(game_mode, ({ many }) => ({
  games: many(games),
}));