import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from '@repo/db';
import * as schema from '@repo/db';

export const usersData: (typeof users.$inferInsert)[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    username: 'admin_user',
    walletAddress: '0x742d35Cc691C0532925a3b8D7c57B6e8D4C4CE89',
    roleId: '550e8400-e29b-41d4-a716-446655440001', // admin
    createdAt: new Date('2024-01-15T10:00:00Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    username: 'fantasy_king',
    walletAddress: '0x8ba1f109551bD432803012645Hac136c9.EventArgs',
    roleId: '550e8400-e29b-41d4-a716-446655440002', // user
    createdAt: new Date('2024-02-10T14:30:00Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    username: 'nfl_prophet',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    roleId: '550e8400-e29b-41d4-a716-446655440002', // user
    createdAt: new Date('2024-02-12T09:15:00Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    username: 'touchdown_master',
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    roleId: '550e8400-e29b-41d4-a716-446655440002', // user
    createdAt: new Date('2024-02-14T16:45:00Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    username: 'draft_genius',
    walletAddress: '0xfedcba0987654321fedcba0987654321fedcba09',
    roleId: '550e8400-e29b-41d4-a716-446655440002', // user
    createdAt: new Date('2024-02-16T11:20:00Z'),
  },
];

export const seedUsers = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(users).values(usersData).onConflictDoNothing();
  console.log('✅ Users seeded');
};
