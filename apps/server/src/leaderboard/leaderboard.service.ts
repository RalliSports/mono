import { Injectable } from '@nestjs/common';
import { users, participants, bets, games } from '@repo/db';
import { eq, sql, and } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import {
  LeaderboardResponseDto,
  LeaderboardUserDto,
} from './dto/leaderboard-response.dto';

@Injectable()
export class LeaderboardService {
  constructor(@Drizzle() private readonly db: Database) {}

  async getLeaderboard(
    page: number = 1,
    limit: number = 50,
    sortBy:
      | 'winRate'
      | 'totalWinnings'
      | 'netProfit'
      | 'bettingAccuracy' = 'netProfit',
  ): Promise<LeaderboardResponseDto> {
    const offset = (page - 1) * limit;

    try {
      // Get all users first
      const allUsers = await this.db
        .select({
          userId: users.id,
          username: users.username,
          avatar: users.avatar,
        })
        .from(users)
        .where(
          and(sql`${users.username} IS NOT NULL`, sql`${users.username} != ''`),
        );

      // Get game statistics for each user
      const gameStats = await this.db
        .select({
          userId: participants.userId,
          gamesPlayed: sql<number>`COUNT(DISTINCT ${participants.gameId})`,
          gamesWon: sql<number>`SUM(CASE WHEN ${participants.isWinner} = true THEN 1 ELSE 0 END)`,
          totalAmountWon: sql<number>`SUM(COALESCE(${participants.amountWon}, 0))`,
          totalAmountDeposited: sql<number>`SUM(COALESCE(${games.depositAmount}, 0))`,
        })
        .from(participants)
        .leftJoin(games, eq(participants.gameId, games.id))
        .groupBy(participants.userId);

      // Get betting statistics for each user
      const bettingStats = await this.db
        .select({
          userId: bets.userId,
          totalBets: sql<number>`COUNT(${bets.id})`,
          totalCorrectBets: sql<number>`SUM(CASE WHEN ${bets.isCorrect} = true THEN 1 ELSE 0 END)`,
        })
        .from(bets)
        .groupBy(bets.userId);

      // Create lookup maps
      const gameStatsMap = new Map(gameStats.map((row) => [row.userId, row]));
      const bettingStatsMap = new Map(
        bettingStats.map((row) => [row.userId, row]),
      );

      // Merge all data
      const rawData = allUsers.map((user) => {
        const gameData = gameStatsMap.get(user.userId) || {
          gamesPlayed: 0,
          gamesWon: 0,
          totalAmountWon: 0,
          totalAmountDeposited: 0,
        };
        const bettingData = bettingStatsMap.get(user.userId) || {
          totalBets: 0,
          totalCorrectBets: 0,
        };

        return {
          userId: user.userId,
          username: user.username,
          avatar: user.avatar,
          gamesPlayed: Number(gameData.gamesPlayed) || 0,
          gamesWon: Number(gameData.gamesWon) || 0,
          totalAmountWon: Number(gameData.totalAmountWon) || 0,
          totalAmountDeposited: Number(gameData.totalAmountDeposited) || 0,
          totalBets: Number(bettingData.totalBets) || 0,
          totalCorrectBets: Number(bettingData.totalCorrectBets) || 0,
        };
      });

      // Calculate derived metrics and filter out inactive users
      const processedData = rawData
        .map((row) => {
          const gamesPlayed = row.gamesPlayed;
          const gamesWon = row.gamesWon;
          const totalAmountWon = row.totalAmountWon;
          const totalBets = row.totalBets;
          const totalCorrectBets = row.totalCorrectBets;
          const totalAmountDeposited = row.totalAmountDeposited;

          const winPercentage =
            gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;
          const bettingAccuracy =
            totalBets > 0 ? (totalCorrectBets / totalBets) * 100 : 0;
          const netProfit = totalAmountWon - totalAmountDeposited;

          return {
            id: row.userId,
            username: row.username || 'Anonymous',
            avatar: row.avatar || '',
            gamesPlayed,
            gamesWon,
            winPercentage: Math.round(winPercentage * 100) / 100,
            totalAmountWon,
            totalAmountDeposited,
            netProfit,
            totalCorrectBets,
            totalBets,
            bettingAccuracy: Math.round(bettingAccuracy * 100) / 100,
            rank: 0, // Will be set after sorting
          };
        })
        .filter((user) => user.gamesPlayed > 0); // Only show users who have played at least one game

      // Sort based on the specified criteria
      let sortedData: typeof processedData;

      switch (sortBy) {
        case 'winRate':
          sortedData = processedData.sort((a, b) => {
            if (b.winPercentage !== a.winPercentage) {
              return b.winPercentage - a.winPercentage;
            }
            return b.gamesPlayed - a.gamesPlayed;
          });
          break;
        case 'totalWinnings':
          sortedData = processedData.sort(
            (a, b) => b.totalAmountWon - a.totalAmountWon,
          );
          break;
        case 'bettingAccuracy':
          sortedData = processedData.sort((a, b) => {
            if (b.bettingAccuracy !== a.bettingAccuracy) {
              return b.bettingAccuracy - a.bettingAccuracy;
            }
            return b.totalBets - a.totalBets;
          });
          break;
        case 'netProfit':
        default:
          sortedData = processedData.sort((a, b) => b.netProfit - a.netProfit);
          break;
      }

      // Add ranks
      sortedData.forEach((user, index) => {
        user.rank = index + 1;
      });

      // Apply pagination
      const totalUsers = sortedData.length;
      const totalPages = Math.ceil(totalUsers / limit);
      const paginatedData = sortedData.slice(offset, offset + limit);

      return {
        users: paginatedData,
        totalUsers,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('Leaderboard query error:', error);
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }
  }

  async getUserLeaderboardPosition(
    userId: string,
    sortBy:
      | 'winRate'
      | 'totalWinnings'
      | 'netProfit'
      | 'bettingAccuracy' = 'netProfit',
  ): Promise<{ rank: number; user: LeaderboardUserDto } | null> {
    const leaderboard = await this.getLeaderboard(1, 1000, sortBy);
    const userPosition = leaderboard.users.find((user) => user.id === userId);

    if (!userPosition) {
      return null;
    }

    return {
      rank: userPosition.rank,
      user: userPosition,
    };
  }

  async getTopPerformers(limit: number = 10): Promise<{
    topByNetProfit: LeaderboardUserDto[];
    topByWinRate: LeaderboardUserDto[];
    topByBettingAccuracy: LeaderboardUserDto[];
  }> {
    const [netProfitLeaders, winRateLeaders, bettingAccuracyLeaders] =
      await Promise.all([
        this.getLeaderboard(1, limit, 'netProfit'),
        this.getLeaderboard(1, limit, 'winRate'),
        this.getLeaderboard(1, limit, 'bettingAccuracy'),
      ]);

    return {
      topByNetProfit: netProfitLeaders.users,
      topByWinRate: winRateLeaders.users,
      topByBettingAccuracy: bettingAccuracyLeaders.users,
    };
  }

  async getLeaderboardStats(): Promise<{
    totalUsers: number;
    totalGames: number;
    totalResolvedGames: number;
    totalUnresolvedGames: number;
    usersWithWinnings: number;
    totalWinningsDistributed: number;
  }> {
    const stats = await this.db
      .select({
        totalUsers: sql<number>`COUNT(DISTINCT ${users.id})`,
        totalGames: sql<number>`COUNT(DISTINCT ${games.id})`,
        totalResolvedGames: sql<number>`COUNT(DISTINCT CASE WHEN ${games.status} = 'completed' OR ${games.resolvedTxnSignature} IS NOT NULL THEN ${games.id} END)`,
        totalUnresolvedGames: sql<number>`COUNT(DISTINCT CASE WHEN ${games.status} != 'completed' AND ${games.resolvedTxnSignature} IS NULL THEN ${games.id} END)`,
        usersWithWinnings: sql<number>`COUNT(DISTINCT CASE WHEN ${participants.amountWon} > 0 THEN ${participants.userId} END)`,
        totalWinningsDistributed: sql<number>`COALESCE(SUM(${participants.amountWon}), 0)`,
      })
      .from(users)
      .leftJoin(participants, eq(users.id, participants.userId))
      .leftJoin(games, eq(participants.gameId, games.id));

    return stats[0];
  }
}
