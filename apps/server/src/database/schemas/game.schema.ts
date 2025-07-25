import {
  pgTable,
  uuid,
  varchar,
  decimal,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const gameTypeEnum = pgEnum('game_type', [
  '1v1',
  'limited',
  'unlimited',
]);
export const userControlTypeEnum = pgEnum('user_control_type', [
  'whitelist',
  'blacklist',
  'none',
]);
export const gameAccessStatusEnum = pgEnum('game_access_status', [
  'whitelisted',
  'blacklisted',
]);

export const gameMode = pgTable('game_mode', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
});

export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  creatorId: uuid('creator_id').notNull(),
  depositAmount: decimal('deposit_amount', {
    precision: 18,
    scale: 8,
  }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  inviteLink: varchar('invite_link', { length: 500 }),
  status: varchar('status', { length: 50 }).notNull(),
  maxParticipants: integer('max_participants'),
  gameCode: varchar('game_code', { length: 20 }).notNull().unique(),
  matchupGroup: varchar('matchup_group', { length: 100 }),
  depositToken: varchar('deposit_token', { length: 100 }),
  isPrivate: boolean('is_private').default(false).notNull(),
  type: gameTypeEnum('type').notNull(),
  gameModeId: uuid('game_mode_id').notNull(),
  gameAccessId: uuid('game_access_id'),
  userControlType: userControlTypeEnum('user_control_type')
    .default('none')
    .notNull(),
});

export const gameAccess = pgTable('game_access', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id').notNull(),
  userId: uuid('user_id').notNull(),
  status: gameAccessStatusEnum('status').notNull(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type GameMode = typeof gameMode.$inferSelect;
export type NewGameMode = typeof gameMode.$inferInsert;
export type GameAccess = typeof gameAccess.$inferSelect;
export type NewGameAccess = typeof gameAccess.$inferInsert;
