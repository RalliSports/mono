import { pgTable, uuid, integer } from 'drizzle-orm/pg-core';

export const leaderboard = pgTable('leaderboard', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id').notNull(),
  participantId: uuid('participant_id').notNull(),
  entriesInProgress: integer('entries_in_progress').default(0).notNull(),
  entriesCorrect: integer('entries_correct').default(0).notNull(),
  entriesIncorrect: integer('entries_incorrect').default(0).notNull(),
});

export type Leaderboard = typeof leaderboard.$inferSelect;
export type NewLeaderboard = typeof leaderboard.$inferInsert;
