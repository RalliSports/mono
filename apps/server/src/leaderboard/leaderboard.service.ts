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

    // Build the query to get user statistics
    const leaderboardQuery = this.db
      .select({
        userId: users.id,
        username: users.username,
        avatar: users.avatar,
        gamesPlayed: sql<number>`COALESCE(COUNT(DISTINCT ${participants.gameId}), 0)`,
        gamesWon: sql<number>`COALESCE(SUM(CASE WHEN ${participants.isWinner} = true THEN 1 ELSE 0 END), 0)`,
        totalAmountWon: sql<number>`COALESCE(SUM(${participants.amountWon}), 0)`,
        totalBets: sql<number>`COALESCE(COUNT(${bets.id}), 0)`,
        totalCorrectBets: sql<number>`COALESCE(SUM(CASE WHEN ${bets.isCorrect} = true THEN 1 ELSE 0 END), 0)`,
        totalAmountDeposited: sql<number>`COALESCE(SUM(${games.depositAmount}), 0)`,
      })
      .from(users)
      .leftJoin(participants, eq(users.id, participants.userId))
      .leftJoin(bets, eq(users.id, bets.userId))
      .leftJoin(games, eq(participants.gameId, games.id))
      .where(
        and(sql`${users.username} IS NOT NULL`, sql`${users.username} != ''`),
      )
      .groupBy(users.id, users.username, users.avatar);

    // Get the data
    const rawData = await leaderboardQuery;

    // Calculate derived metrics and filter out inactive users
    const processedData = rawData
      .map((row) => {
        const gamesPlayed = Number(row.gamesPlayed) || 0;
        const gamesWon = Number(row.gamesWon) || 0;
        const totalAmountWon = Number(row.totalAmountWon) || 0;
        const totalBets = Number(row.totalBets) || 0;
        const totalCorrectBets = Number(row.totalCorrectBets) || 0;
        const totalAmountDeposited = Number(row.totalAmountDeposited) || 0;

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
          // First sort by win percentage, then by games played as tiebreaker
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
          // First sort by betting accuracy, then by total bets as tiebreaker
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
  }

  async getUserLeaderboardPosition(
    userId: string,
    sortBy:
      | 'winRate'
      | 'totalWinnings'
      | 'netProfit'
      | 'bettingAccuracy' = 'netProfit',
  ): Promise<{ rank: number; user: LeaderboardUserDto } | null> {
    const leaderboard = await this.getLeaderboard(1, 1000, sortBy); // Get a large chunk to find the user
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
}
