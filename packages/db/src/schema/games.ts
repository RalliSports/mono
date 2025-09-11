import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { game_mode } from "./game_mode";
import { participants } from "./participants";
import { users } from "./users";

import { uuid } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { tokens } from "./tokens";

export const gameTypeEnum = pgEnum("type", ["1v1", "limited", "unlimited"]);
export const userControlTypeEnum = pgEnum("user_control_type", [
  "whitelist",
  "blacklist",
  "none",
]);

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title"),
  creatorId: uuid("creator_id"),
  depositAmount: numeric("deposit_amount", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  status: varchar("status"),
  maxParticipants: integer("max_participants"),
  numBets: integer("num_bets"),
  gameCode: varchar("game_code"),
  matchupGroup: varchar("matchup_group"),
  tokenId: uuid("token_id"),
  isPrivate: boolean("isPrivate"),
  type: gameTypeEnum("type"),
  userControlType: userControlTypeEnum("user_control_type"),
  gameModeId: uuid("game_mode_id"),
  createdTxnSignature: text("created_txn_signature"),
  resolvedTxnSignature: text("resolved_txn_signature"),
  imageUrl: text("image_url"),
});

export const gamesRelations = relations(games, ({ many, one }) => ({
  participants: many(participants),
  gameMode: one(game_mode, {
    fields: [games.gameModeId],
    references: [game_mode.id],
  }),
  token: one(tokens, {
    fields: [games.tokenId],
    references: [tokens.id],
  }),
  gameAccess: one(game_mode),
  creator: one(users, {
    fields: [games.creatorId],
    references: [users.id],
  }),
}));
