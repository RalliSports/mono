import {
  pgTable,
  uuid,
  varchar,
  date,
  integer,
  json,
} from 'drizzle-orm/pg-core';

export const matchups = pgTable('matchups', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameDate: date('game_date').notNull(),
  homeTeam: varchar('home_team', { length: 100 }).notNull(),
  awayTeam: varchar('away_team', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // e.g., scheduled, in_progress, finished
  scoreHome: integer('score_home'),
  scoreAway: integer('score_away'),
});

export const matchupPerformance = pgTable('matchup_performance', {
  id: uuid('id').primaryKey().defaultRandom(),
  matchupId: uuid('matchup_id').notNull(),
  athleteId: uuid('athlete_id').notNull(),
  stats: json('stats').$type<Record<string, any>>().notNull(),
});

export type Matchup = typeof matchups.$inferSelect;
export type NewMatchup = typeof matchups.$inferInsert;
export type MatchupPerformance = typeof matchupPerformance.$inferSelect;
export type NewMatchupPerformance = typeof matchupPerformance.$inferInsert;
