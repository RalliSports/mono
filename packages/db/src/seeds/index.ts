import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  try {
   
  } catch (error) {
    console.error('❌ Seeding data failed:', error);
  } finally {
    await pool.end();
  }
}

seed().catch(console.error);
