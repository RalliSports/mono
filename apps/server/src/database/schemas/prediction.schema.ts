import { pgTable, uuid, varchar, decimal, boolean } from 'drizzle-orm/pg-core';

export const stats = pgTable('stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
});

export const predictions = pgTable('predictions', {
  id: uuid('id').primaryKey().defaultRandom(),
  participantId: uuid('participant_id').notNull(),
  athleteId: uuid('athlete_id').notNull(),
  statId: uuid('stat_id').notNull(),
  matchupId: uuid('matchup_id').notNull(),
  predictedDirection: varchar('predicted_direction', { length: 10 }).notNull(), // "Higher" or "Lower"
  predictedValue: decimal('predicted_value', {
    precision: 10,
    scale: 2,
  }).notNull(),
  actualValue: decimal('actual_value', { precision: 10, scale: 2 }),
  isCorrect: boolean('is_correct'),
});

export type Stat = typeof stats.$inferSelect;
export type NewStat = typeof stats.$inferInsert;
export type Prediction = typeof predictions.$inferSelect;
export type NewPrediction = typeof predictions.$inferInsert;
