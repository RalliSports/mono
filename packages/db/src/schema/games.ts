import { pgTable, varchar, numeric,text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { game_mode } from "./game_mode";
import { relations } from "drizzle-orm";
import { participants } from "./participants";
import { uuid } from "drizzle-orm/pg-core";

export const gameTypeEnum = pgEnum("type", ["1v1", "limited", "unlimited"]);
export const userControlTypeEnum = pgEnum("user_control_type", ["whitelist", "blacklist", "none"]);

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title"),
  creatorId: text("creator_id"),
  depositAmount: numeric("deposit_amount", {mode: 'number'}),
  currency: varchar("currency"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  status: varchar("status"),
  maxParticipants: integer("max_participants"),
  gameCode: varchar("game_code"),
  matchupGroup: varchar("matchup_group"),
  depositToken: varchar("deposit_token"),
  isPrivate: boolean("isPrivate"),
  type: gameTypeEnum("type"),
  userControlType: userControlTypeEnum("user_control_type"),
  gameModeId: uuid("game_mode_id")
});


export const gamesRelations = relations(games, ({ many, one }) => ({
  participants: many(participants),
  gameMode: one(game_mode, {
    fields: [games.gameModeId],
    references: [game_mode.id],
  }),
  gameAccess: one(game_mode),
  // creator: one(users, {
  //   fields: [games.creatorId],
  //   references: [users.id],
  // }),
}));