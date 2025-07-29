import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { predictions } from '@repo/db';
import * as schema from '@repo/db';

export const predictionsData: (typeof predictions.$inferInsert)[] = [
  // Predictions for Week 1 Super Bowl Champions Showdown
  {
    id: '550e8400-e29b-41d4-a716-446655440100',
    participantId: '550e8400-e29b-41d4-a716-446655440090',
    athleteId: '550e8400-e29b-41d4-a716-446655440031', // Patrick Mahomes
    statId: '550e8400-e29b-41d4-a716-446655440040', // passing_yards
    matchupId: '550e8400-e29b-41d4-a716-446655440050',
    predictedDirection: 'Higher',
    predictedValue: '285.00',
    actualValue: '291.00',
    isCorrect: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    participantId: '550e8400-e29b-41d4-a716-446655440090',
    athleteId: '550e8400-e29b-41d4-a716-446655440036', // Travis Kelce
    statId: '550e8400-e29b-41d4-a716-446655440045', // receiving_touchdowns
    matchupId: '550e8400-e29b-41d4-a716-446655440050',
    predictedDirection: 'Higher',
    predictedValue: '1.50',
    actualValue: '2.00',
    isCorrect: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    participantId: '550e8400-e29b-41d4-a716-446655440091',
    athleteId: '550e8400-e29b-41d4-a716-446655440031', // Patrick Mahomes
    statId: '550e8400-e29b-41d4-a716-446655440040', // passing_yards
    matchupId: '550e8400-e29b-41d4-a716-446655440050',
    predictedDirection: 'Lower',
    predictedValue: '275.00',
    actualValue: '291.00',
    isCorrect: false,
  },
  // Predictions for Bills vs Dolphins Head-to-Head
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    participantId: '550e8400-e29b-41d4-a716-446655440093',
    athleteId: '550e8400-e29b-41d4-a716-446655440030', // Josh Allen
    statId: '550e8400-e29b-41d4-a716-446655440047', // fantasy_points
    matchupId: '550e8400-e29b-41d4-a716-446655440051',
    predictedDirection: 'Higher',
    predictedValue: '24.00',
    actualValue: '26.12',
    isCorrect: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440104',
    participantId: '550e8400-e29b-41d4-a716-446655440094',
    athleteId: '550e8400-e29b-41d4-a716-446655440030', // Josh Allen
    statId: '550e8400-e29b-41d4-a716-446655440047', // fantasy_points
    matchupId: '550e8400-e29b-41d4-a716-446655440051',
    predictedDirection: 'Lower',
    predictedValue: '22.00',
    actualValue: '26.12',
    isCorrect: false,
  },
  // Active predictions for NFC West Challenge
  {
    id: '550e8400-e29b-41d4-a716-446655440105',
    participantId: '550e8400-e29b-41d4-a716-446655440095',
    athleteId: '550e8400-e29b-41d4-a716-446655440032', // Christian McCaffrey
    statId: '550e8400-e29b-41d4-a716-446655440042', // rushing_yards
    matchupId: '550e8400-e29b-41d4-a716-446655440052',
    predictedDirection: 'Higher',
    predictedValue: '120.00',
    actualValue: null,
    isCorrect: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440106',
    participantId: '550e8400-e29b-41d4-a716-446655440096',
    athleteId: '550e8400-e29b-41d4-a716-446655440035', // Cooper Kupp
    statId: '550e8400-e29b-41d4-a716-446655440044', // receiving_yards
    matchupId: '550e8400-e29b-41d4-a716-446655440052',
    predictedDirection: 'Higher',
    predictedValue: '95.00',
    actualValue: null,
    isCorrect: null,
  },
];

export const seedPredictions = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(predictions).values(predictionsData).onConflictDoNothing();
  console.log('✅ Predictions seeded');
};
