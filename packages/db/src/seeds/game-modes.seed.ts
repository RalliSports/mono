import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { game_mode } from '@repo/db';
import * as schema from '@repo/db';

export const gameModesData: (typeof game_mode.$inferInsert)[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440020',
    label: 'Quick Match',
    description: 'Fast-paced prediction game for a single matchup',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440021',
    label: 'Weekly Challenge',
    description: 'Predict player performance across an entire week',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440022',
    label: 'Season Long',
    description: 'Long-term predictions spanning multiple weeks',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440023',
    label: 'Head-to-Head',
    description: 'Direct competition between two players',
  },
];

export const seedGameModes = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(game_mode).values(gameModesData).onConflictDoNothing();
  console.log('✅ Game modes seeded');
};
