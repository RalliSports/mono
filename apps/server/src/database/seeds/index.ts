import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@repo/db';
import { seedRoles } from './roles.seed';
import { seedUsers } from './users.seed';
import { seedGameModes } from './game-modes.seed';
import { seedAthletes } from './athletes.seed';
import { seedStats } from './stats.seed';
import { seedMatchups } from './matchups.seed';
import { seedGames } from './games.seed';
import { seedParticipants } from './participants.seed';
import { seedPredictions } from './predictions.seed';

export async function runSeeds(db: NodePgDatabase<typeof schema>) {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed in dependency order
    await seedRoles(db);
    await seedUsers(db);
    await seedGameModes(db);
    await seedAthletes(db);
    await seedStats(db);
    await seedMatchups(db);
    await seedGames(db);
    await seedParticipants(db);
    await seedPredictions(db);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

// Export individual seed functions for selective seeding
export {
  seedRoles,
  seedUsers,
  seedGameModes,
  seedAthletes,
  seedStats,
  seedMatchups,
  seedGames,
  seedParticipants,
  seedPredictions,
};
