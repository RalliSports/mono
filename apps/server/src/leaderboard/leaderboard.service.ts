import { Injectable } from '@nestjs/common';
import { users, participants, bets, games } from '@repo/db';
import { sql, and, count, eq, desc, sum } from 'drizzle-orm';
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
      // Create a subquery for betting stats
      const bettingStatsSubquery = this.db
        .select({
          userId: bets.userId,
          totalBets: count(bets.id).as('total_bets'),
          totalCorrectBets: sum(
            sql`CASE WHEN ${bets.isCorrect} = true THEN 1 ELSE 0 END`,
          ).as('total_correct_bets'),
        })
        .from(bets)
        .groupBy(bets.userId)
        .as('betting_stats');

      // Main query using Drizzle syntax
      const baseQuery = this.db
        .select({
          userId: users.id,
          username: users.username,
          avatar: users.avatar,
          gamesPlayed:
            sql<number>`COALESCE(COUNT(DISTINCT ${participants.gameId}), 0)`.as(
              'games_played',
            ),
          gamesWon:
            sql<number>`COALESCE(SUM(CASE WHEN ${participants.isWinner} = true THEN 1 ELSE 0 END), 0)`.as(
              'games_won',
            ),
          totalAmountWon:
            sql<number>`COALESCE(SUM(${participants.amountWon}), 0)`.as(
              'total_amount_won',
            ),
          totalAmountDeposited:
            sql<number>`COALESCE(SUM(${games.depositAmount}), 0)`.as(
              'total_amount_deposited',
            ),
          totalBets:
            sql<number>`COALESCE(${bettingStatsSubquery.totalBets}, 0)`.as(
              'total_bets',
            ),
          totalCorrectBets:
            sql<number>`COALESCE(${bettingStatsSubquery.totalCorrectBets}, 0)`.as(
              'total_correct_bets',
            ),
          // Calculated fields using sql expressions
          winPercentage: sql<number>`
            CASE 
              WHEN COUNT(DISTINCT ${participants.gameId}) > 0 
              THEN ROUND((SUM(CASE WHEN ${participants.isWinner} = true THEN 1 ELSE 0 END)::numeric / COUNT(DISTINCT ${participants.gameId})::numeric) * 100, 2)
              ELSE 0 
            END`.as('win_percentage'),
          bettingAccuracy: sql<number>`
            CASE 
              WHEN COALESCE(${bettingStatsSubquery.totalBets}, 0) > 0 
              THEN ROUND((COALESCE(${bettingStatsSubquery.totalCorrectBets}, 0)::numeric / ${bettingStatsSubquery.totalBets}::numeric) * 100, 2)
              ELSE 0 
            END`.as('betting_accuracy'),
          netProfit: sql<number>`
            COALESCE(SUM(${participants.amountWon}), 0) - COALESCE(SUM(${games.depositAmount}), 0)
          `.as('net_profit'),
        })
        .from(users)
        .leftJoin(participants, eq(users.id, participants.userId))
        .leftJoin(games, eq(participants.gameId, games.id))
        .leftJoin(
          bettingStatsSubquery,
          eq(users.id, bettingStatsSubquery.userId),
        )
        .where(
          and(sql`${users.username} IS NOT NULL`, sql`${users.username} != ''`),
        )
        .groupBy(
          users.id,
          users.username,
          users.avatar,
          bettingStatsSubquery.totalBets,
          bettingStatsSubquery.totalCorrectBets,
        )
        .having(sql`COUNT(DISTINCT ${participants.gameId}) > 0`);

      // Apply sorting based on sortBy parameter
      let sortedQuery;
      switch (sortBy) {
        case 'winRate':
          sortedQuery = baseQuery.orderBy(
            desc(sql`win_percentage`),
            desc(sql`games_played`),
          );
          break;
        case 'totalWinnings':
          sortedQuery = baseQuery.orderBy(desc(sql`total_amount_won`));
          break;
        case 'bettingAccuracy':
          sortedQuery = baseQuery.orderBy(
            desc(sql`betting_accuracy`),
            desc(sql`total_bets`),
          );
          break;
        case 'netProfit':
        default:
          sortedQuery = baseQuery.orderBy(desc(sql`net_profit`));
          break;
      }

      // Execute query with pagination
      const paginatedQuery = sortedQuery.limit(limit).offset(offset);
      const results = await paginatedQuery;

      // Get total count for pagination
      const totalCountQuery = this.db
        .select({
          count: count(),
        })
        .from(users)
        .leftJoin(participants, eq(users.id, participants.userId))
        .where(
          and(sql`${users.username} IS NOT NULL`, sql`${users.username} != ''`),
        )
        .groupBy(users.id)
        .having(sql`COUNT(DISTINCT ${participants.gameId}) > 0`);

      const totalResult = await this.db
        .select({
          totalUsers: count(),
        })
        .from(totalCountQuery.as('user_count'));

      const totalUsers = totalResult[0]?.totalUsers || 0;
      const totalPages = Math.ceil(totalUsers / limit);

      // Transform results to match DTO
      const transformedUsers: LeaderboardUserDto[] = results.map(
        (row, index) => ({
          id: row.userId,
          username: row.username || 'Anonymous',
          avatar: row.avatar || '',
          gamesPlayed: Number(row.gamesPlayed) || 0,
          gamesWon: Number(row.gamesWon) || 0,
          winPercentage: Number(row.winPercentage) || 0,
          totalAmountWon: Number(row.totalAmountWon) || 0,
          totalAmountDeposited: Number(row.totalAmountDeposited) || 0,
          netProfit: Number(row.netProfit) || 0,
          totalCorrectBets: Number(row.totalCorrectBets) || 0,
          totalBets: Number(row.totalBets) || 0,
          bettingAccuracy: Number(row.bettingAccuracy) || 0,
          rank: offset + index + 1,
        }),
      );

      return {
        users: transformedUsers,
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
    try {
      // Get full leaderboard to find user position
      // For better performance, you might want to use a window function here
      const fullLeaderboard = await this.getLeaderboard(1, 10000, sortBy);
      const userPosition = fullLeaderboard.users.find(
        (user) => user.id === userId,
      );

      if (!userPosition) {
        return null;
      }

      return {
        rank: userPosition.rank,
        user: userPosition,
      };
    } catch (error) {
      console.error('User leaderboard position query error:', error);
      throw new Error(
        `Failed to fetch user leaderboard position: ${error.message}`,
      );
    }
  }

  async getTopPerformers(limit: number = 10): Promise<{
    topByNetProfit: LeaderboardUserDto[];
    topByWinRate: LeaderboardUserDto[];
    topByBettingAccuracy: LeaderboardUserDto[];
  }> {
    try {
      // Use Promise.all to run queries in parallel for better performance
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
    } catch (error) {
      console.error('Top performers query error:', error);
      throw new Error(`Failed to fetch top performers: ${error.message}`);
    }
  }

  async getLeaderboardStats(): Promise<{
    totalUsers: number;
    totalGames: number;
    totalResolvedGames: number;
    totalUnresolvedGames: number;
    usersWithWinnings: number;
    totalWinningsDistributed: number;
  }> {
    try {
      const stats = await this.db
        .select({
          totalUsers: count(sql`DISTINCT ${users.id}`).as('total_users'),
          totalGames: count(sql`DISTINCT ${games.id}`).as('total_games'),
          totalResolvedGames: count(
            sql`DISTINCT CASE WHEN ${games.status} = 'completed' OR ${games.resolvedTxnSignature} IS NOT NULL THEN ${games.id} END`,
          ).as('total_resolved_games'),
          totalUnresolvedGames: count(
            sql`DISTINCT CASE WHEN ${games.status} != 'completed' AND ${games.resolvedTxnSignature} IS NULL THEN ${games.id} END`,
          ).as('total_unresolved_games'),
          usersWithWinnings: count(
            sql`DISTINCT CASE WHEN ${participants.amountWon} > 0 THEN ${participants.userId} END`,
          ).as('users_with_winnings'),
          totalWinningsDistributed:
            sql<number>`COALESCE(SUM(${participants.amountWon}), 0)`.as(
              'total_winnings_distributed',
            ),
        })
        .from(users)
        .leftJoin(participants, eq(users.id, participants.userId))
        .leftJoin(games, eq(participants.gameId, games.id));

      const result = stats[0];

      return {
        totalUsers: Number(result.totalUsers) || 0,
        totalGames: Number(result.totalGames) || 0,
        totalResolvedGames: Number(result.totalResolvedGames) || 0,
        totalUnresolvedGames: Number(result.totalUnresolvedGames) || 0,
        usersWithWinnings: Number(result.usersWithWinnings) || 0,
        totalWinningsDistributed: Number(result.totalWinningsDistributed) || 0,
      };
    } catch (error) {
      console.error('Leaderboard stats query error:', error);
      throw new Error(`Failed to fetch leaderboard stats: ${error.message}`);
    }
  }
}
