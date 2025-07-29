import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { stats } from '@repo/db';
import * as schema from '@repo/db';

export const statsData: (typeof stats.$inferInsert)[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440040',
    name: 'passing_yards',
    description: 'Total passing yards in a game',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440041',
    name: 'passing_touchdowns',
    description: 'Number of passing touchdowns',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440042',
    name: 'rushing_yards',
    description: 'Total rushing yards in a game',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440043',
    name: 'rushing_touchdowns',
    description: 'Number of rushing touchdowns',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440044',
    name: 'receiving_yards',
    description: 'Total receiving yards in a game',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440045',
    name: 'receiving_touchdowns',
    description: 'Number of receiving touchdowns',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440046',
    name: 'receptions',
    description: 'Number of catches made',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440047',
    name: 'fantasy_points',
    description: 'Total fantasy points scored',
  },
];

export const seedStats = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(stats).values(statsData).onConflictDoNothing();
  console.log('✅ Stats seeded');
};
