import { pgTable, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';

export const participants = pgTable('participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  gameId: uuid('game_id').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  isWinner: boolean('is_winner').default(false).notNull(),
});

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
