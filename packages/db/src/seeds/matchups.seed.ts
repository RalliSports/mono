import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { matchups, matchup_performance } from '@repo/db';
import * as schema from '@repo/db';

export const matchupsData: (typeof matchups.$inferInsert)[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440050',
    gameDate: '2024-09-08', // ✅ String format, not Date object
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Baltimore Ravens',
    status: 'finished',
    scoreHome: 27,
    scoreAway: 20,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440051',
    gameDate: '2024-09-08', // ✅ String format
    homeTeam: 'Buffalo Bills',
    awayTeam: 'Miami Dolphins',
    status: 'finished',
    scoreHome: 31,
    scoreAway: 17,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440052',
    gameDate: '2024-09-15', // ✅ String format
    homeTeam: 'San Francisco 49ers',
    awayTeam: 'Los Angeles Rams',
    status: 'in_progress',
    scoreHome: 14,
    scoreAway: 7,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440053',
    gameDate: '2024-09-22', // ✅ String format
    homeTeam: 'Miami Dolphins',
    awayTeam: 'Kansas City Chiefs',
    status: 'scheduled',
    scoreHome: null,
    scoreAway: null,
  },
];

export const matchupPerformanceData = [
  // Patrick Mahomes vs Ravens
  {
    id: '550e8400-e29b-41d4-a716-446655440060',
    matchupId: '550e8400-e29b-41d4-a716-446655440050',
    athleteId: '550e8400-e29b-41d4-a716-446655440031',
    stats: {
      passing_yards: 291,
      passing_touchdowns: 3,
      rushing_yards: 15,
      rushing_touchdowns: 0,
      fantasy_points: 23.46,
    },
  },
  // Travis Kelce vs Ravens
  {
    id: '550e8400-e29b-41d4-a716-446655440061',
    matchupId: '550e8400-e29b-41d4-a716-446655440050',
    athleteId: '550e8400-e29b-41d4-a716-446655440036',
    stats: {
      receiving_yards: 103,
      receiving_touchdowns: 2,
      receptions: 7,
      fantasy_points: 22.3,
    },
  },
  // Josh Allen vs Dolphins
  {
    id: '550e8400-e29b-41d4-a716-446655440062',
    matchupId: '550e8400-e29b-41d4-a716-446655440051',
    athleteId: '550e8400-e29b-41d4-a716-446655440030',
    stats: {
      passing_yards: 320,
      passing_touchdowns: 2,
      rushing_yards: 58,
      rushing_touchdowns: 1,
      fantasy_points: 26.12,
    },
  },
];

export const seedMatchups = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(matchups).values(matchupsData).onConflictDoNothing();
  await db
    .insert(matchup_performance)
    .values(matchupPerformanceData)
    .onConflictDoNothing();
  console.log('✅ Matchups and performances seeded');
};
