import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';

export const athletes = pgTable('athletes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  team: varchar('team', { length: 100 }).notNull(),
  position: varchar('position', { length: 50 }).notNull(),
  jerseyNumber: integer('jersey_number'),
  age: integer('age'),
  picture: varchar('picture', { length: 500 }),
});

export type Athlete = typeof athletes.$inferSelect;
export type NewAthlete = typeof athletes.$inferInsert;
