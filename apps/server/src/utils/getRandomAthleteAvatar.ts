import { sql } from 'drizzle-orm';
import { athletes } from '@repo/db';
import { Database } from 'src/database/database.provider';

export async function getRandomAthleteAvatar(
  db: Database,
): Promise<string | null> {
  const randomAthlete = await db.query.athletes.findFirst({
    where: sql`${athletes.picture} IS NOT NULL AND ${athletes.picture} != ''`,
    orderBy: sql`RANDOM()`,
  });

  return randomAthlete?.picture || null;
}
