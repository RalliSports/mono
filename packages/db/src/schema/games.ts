import { pgTable, varchar, decimal, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { game_mode } from "./game_mode";
import { relations } from "drizzle-orm";
import { participants } from "./participants";

export const gameTypeEnum = pgEnum("type", ["1v1", "limited", "unlimited"]);
export const userControlTypeEnum = pgEnum("user_control_type", ["whitelist", "blacklist", "none"]);

export const games = pgTable("games", {
  id: varchar("id").primaryKey(),
  title: varchar("title"),
  creatorId: varchar("creator_id").references(() => users.id),
  depositAmount: decimal("deposit_amount"),
  currency: varchar("currency"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  inviteLink: varchar("invite_link"),
  status: varchar("status"),
  maxParticipants: integer("max_participants"),
  gameCode: varchar("game_code"),
  matchupGroup: varchar("matchup_group"),
  depositToken: varchar("deposit_token"),
  isPrivate: boolean("isPrivate"),
  type: gameTypeEnum("type"),
  gameAccessId: varchar("game_access_id"),
  userControlType: userControlTypeEnum("user_control_type"),
  gameModeId: varchar("game_mode_id").references(() => game_mode.id),
});


export const gamesRelations = relations(games, ({ many, one }) => ({
  participants: many(participants),
  gameMode: one(game_mode, {
    fields: [games.gameModeId],
    references: [game_mode.id],
  }),
  creator: one(users, {
    fields: [games.creatorId],
    references: [users.id],
  }),
}));