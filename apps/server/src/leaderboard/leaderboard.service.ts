import { Injectable } from '@nestjs/common';
import { users, participants, bets, games } from '@repo/db';
import { sql, count, eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import {
  LeaderboardResponseDto,
  LeaderboardUserDto,
} from './dto/leaderboard-response.dto';

type SortKey = 'winRate' | 'totalWinnings' | 'netProfit' | 'bettingAccuracy';

@Injectable()
export class LeaderboardService {
  constructor(@Drizzle() private readonly db: Database) {}
  async getLeaderboard(
    page: number = 1,
    limit: number = 50,
    sortBy: SortKey = 'netProfit',
  ): Promise<LeaderboardResponseDto> {
    const offset = (page - 1) * limit;

  const rows = (await this.db.execute(sql`
      WITH betting_stats AS (
        SELECT
          ${bets.userId}     AS user_id,
          COUNT(${bets.id})  AS total_bets,
          SUM(CASE WHEN ${bets.isCorrect} = true THEN 1 ELSE 0 END) AS total_correct_bets
        FROM ${bets}
        GROUP BY ${bets.userId}
      ),
      participant_stats AS (
        SELECT
          p.${participants.userId} AS user_id,
          COUNT(DISTINCT p.${participants.gameId}) AS games_played,
          SUM(CASE WHEN p.${participants.isWinner} = true THEN 1 ELSE 0 END) AS games_won,
          SUM(p.${participants.amountWon}) AS total_amount_won,
          -- PRESERVE original semantics: deposit summed per participant row
          SUM(g.${games.depositAmount}) AS total_amount_deposited
        FROM ${participants} p
        JOIN ${games} g ON g.${games.id} = p.${participants.gameId}
        GROUP BY p.${participants.userId}
      ),
      per_user AS (
        SELECT
          u.${users.id}       AS user_id,
          u.${users.username} AS username,
          u.${users.avatar}   AS avatar,
          COALESCE(ps.games_played, 0)          AS games_played,
          COALESCE(ps.games_won, 0)             AS games_won,
          COALESCE(ps.total_amount_won, 0)      AS total_amount_won,
          COALESCE(ps.total_amount_deposited,0) AS total_amount_deposited
        FROM ${users} u
        LEFT JOIN participant_stats ps ON ps.user_id = u.${users.id}
        WHERE u.${users.username} IS NOT NULL
          AND u.${users.username} <> ''
          AND EXISTS (
            SELECT 1 FROM ${participants} p2 WHERE p2.${participants.userId} = u.${users.id}
          )
      )
      SELECT
        pu.user_id,
        pu.username,
        pu.avatar,
        pu.games_played,
        pu.games_won,
        pu.total_amount_won,
        pu.total_amount_deposited,
        COALESCE(bs.total_bets, 0)         AS total_bets,
        COALESCE(bs.total_correct_bets, 0) AS total_correct_bets,

        -- win %
        CASE
          WHEN pu.games_played > 0
          THEN ROUND(100.0 * pu.games_won::float / pu.games_played::float, 2)
          ELSE 0
        END AS win_percentage,

        -- betting accuracy %
        CASE
          WHEN COALESCE(bs.total_bets, 0) > 0
          THEN ROUND(100.0 * COALESCE(bs.total_correct_bets, 0)::float / bs.total_bets::float, 2)
          ELSE 0
        END AS betting_accuracy,

        -- net profit
        (pu.total_amount_won - pu.total_amount_deposited) AS net_profit,

        -- global total
        COUNT(*) OVER() AS total_users,

        -- global rank with deterministic tie-breaks
        RANK() OVER (
          ORDER BY
            CASE ${sql.param(sortBy)}
              WHEN 'winRate' THEN
                CASE WHEN pu.games_played > 0
                     THEN ROUND(100.0 * pu.games_won::float / pu.games_played::float, 2)
                     ELSE 0 END
              WHEN 'totalWinnings' THEN pu.total_amount_won
              WHEN 'bettingAccuracy' THEN
                CASE WHEN COALESCE(bs.total_bets, 0) > 0
                     THEN ROUND(100.0 * COALESCE(bs.total_correct_bets, 0)::float / bs.total_bets::float, 2)
                     ELSE 0 END
              ELSE (pu.total_amount_won - pu.total_amount_deposited)
            END DESC,
            pu.games_played DESC,
            pu.user_id ASC
        ) AS rank
      FROM per_user pu
      LEFT JOIN betting_stats bs ON bs.user_id = pu.user_id
      ORDER BY
        CASE ${sql.param(sortBy)}
          WHEN 'winRate' THEN
            CASE WHEN pu.games_played > 0
                 THEN ROUND(100.0 * pu.games_won::float / pu.games_played::float, 2)
                 ELSE 0 END
          WHEN 'totalWinnings' THEN pu.total_amount_won
          WHEN 'bettingAccuracy' THEN
            CASE WHEN COALESCE(bs.total_bets, 0) > 0
                 THEN ROUND(100.0 * COALESCE(bs.total_correct_bets, 0)::float / bs.total_bets::float, 2)
                 ELSE 0 END
          ELSE (pu.total_amount_won - pu.total_amount_deposited)
        END DESC,
        pu.games_played DESC,
        pu.user_id ASC
      LIMIT ${sql.param(limit)} OFFSET ${sql.param(offset)};
  `)) as unknown as any[];

    const totalUsers = rows[0]?.total_users ? Number(rows[0].total_users) : 0;
    const totalPages = Math.ceil(totalUsers / limit);

    const usersOut: LeaderboardUserDto[] = rows.map((r: any) => ({
      id: r.user_id,
      username: r.username ?? 'Anonymous',
      avatar: r.avatar ?? '',
      gamesPlayed: Number(r.games_played) || 0,
      gamesWon: Number(r.games_won) || 0,
      winPercentage: Number(r.win_percentage) || 0,
      totalAmountWon: Number(r.total_amount_won) || 0,
      totalAmountDeposited: Number(r.total_amount_deposited) || 0,
      netProfit: Number(r.net_profit) || 0,
      totalCorrectBets: Number(r.total_correct_bets) || 0,
      totalBets: Number(r.total_bets) || 0,
      bettingAccuracy: Number(r.betting_accuracy) || 0,
      rank: Number(r.rank) || 0, // global rank from window function
    }));

    return {
      users: usersOut,
      totalUsers,
      page,
      limit,
      totalPages,
    };
  }
  
  async getUserLeaderboardPosition(
    userId: string,
    sortBy: SortKey = 'netProfit',
  ): Promise<{ rank: number; user: LeaderboardUserDto } | null> {
  const rows = (await this.db.execute(sql/*sql*/`
      WITH betting_stats AS (
        SELECT
          ${bets.userId}     AS user_id,
          COUNT(${bets.id})  AS total_bets,
          SUM(CASE WHEN ${bets.isCorrect} = true THEN 1 ELSE 0 END) AS total_correct_bets
        FROM ${bets}
        GROUP BY ${bets.userId}
      ),
      participant_stats AS (
        SELECT
          p.${participants.userId} AS user_id,
          COUNT(DISTINCT p.${participants.gameId}) AS games_played,
          SUM(CASE WHEN p.${participants.isWinner} = true THEN 1 ELSE 0 END) AS games_won,
          SUM(p.${participants.amountWon}) AS total_amount_won,
          SUM(g.${games.depositAmount}) AS total_amount_deposited
        FROM ${participants} p
        JOIN ${games} g ON g.${games.id} = p.${participants.gameId}
        GROUP BY p.${participants.userId}
      ),
      per_user AS (
        SELECT
          u.${users.id}       AS user_id,
          u.${users.username} AS username,
          u.${users.avatar}   AS avatar,
          COALESCE(ps.games_played, 0)          AS games_played,
          COALESCE(ps.games_won, 0)             AS games_won,
          COALESCE(ps.total_amount_won, 0)      AS total_amount_won,
          COALESCE(ps.total_amount_deposited,0) AS total_amount_deposited
        FROM ${users} u
        LEFT JOIN participant_stats ps ON ps.user_id = u.${users.id}
        WHERE u.${users.username} IS NOT NULL
          AND u.${users.username} <> ''
          AND EXISTS (
            SELECT 1 FROM ${participants} p2 WHERE p2.${participants.userId} = u.${users.id}
          )
      ),
      ranked AS (
        SELECT
          pu.user_id,
          pu.username,
          pu.avatar,
          pu.games_played,
          pu.games_won,
          pu.total_amount_won,
          pu.total_amount_deposited,
          COALESCE(bs.total_bets, 0)         AS total_bets,
          COALESCE(bs.total_correct_bets, 0) AS total_correct_bets,

          CASE
            WHEN pu.games_played > 0
            THEN ROUND(100.0 * pu.games_won::float / pu.games_played::float, 2)
            ELSE 0
          END AS win_percentage,

          CASE
            WHEN COALESCE(bs.total_bets, 0) > 0
            THEN ROUND(100.0 * COALESCE(bs.total_correct_bets, 0)::float / bs.total_bets::float, 2)
            ELSE 0
          END AS betting_accuracy,

          (pu.total_amount_won - pu.total_amount_deposited) AS net_profit,

          RANK() OVER (
            ORDER BY
              CASE ${sql.param(sortBy)}
                WHEN 'winRate' THEN
                  CASE WHEN pu.games_played > 0
                       THEN ROUND(100.0 * pu.games_won::float / pu.games_played::float, 2)
                       ELSE 0 END
                WHEN 'totalWinnings' THEN pu.total_amount_won
                WHEN 'bettingAccuracy' THEN
                  CASE WHEN COALESCE(bs.total_bets, 0) > 0
                       THEN ROUND(100.0 * COALESCE(bs.total_correct_bets, 0)::float / bs.total_bets::float, 2)
                       ELSE 0 END
                ELSE (pu.total_amount_won - pu.total_amount_deposited)
              END DESC,
              pu.games_played DESC,
              pu.user_id ASC
          ) AS rank
        FROM per_user pu
        LEFT JOIN betting_stats bs ON bs.user_id = pu.user_id
      )
      SELECT * FROM ranked WHERE user_id = ${sql.param(userId)} LIMIT 1;
  `)) as unknown as any[];

    const r = rows[0] as any | undefined;
    if (!r) return null;

    const user: LeaderboardUserDto = {
      id: r.user_id,
      username: r.username ?? 'Anonymous',
      avatar: r.avatar ?? '',
      gamesPlayed: Number(r.games_played) || 0,
      gamesWon: Number(r.games_won) || 0,
      winPercentage: Number(r.win_percentage) || 0,
      totalAmountWon: Number(r.total_amount_won) || 0,
      totalAmountDeposited: Number(r.total_amount_deposited) || 0,
      netProfit: Number(r.net_profit) || 0,
      totalCorrectBets: Number(r.total_correct_bets) || 0,
      totalBets: Number(r.total_bets) || 0,
      bettingAccuracy: Number(r.betting_accuracy) || 0,
      rank: Number(r.rank) || 0,
    };

    return { rank: user.rank, user };
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
        totalWinningsDistributed: sql<number>`
          COALESCE(SUM(${participants.amountWon}), 0)
        `.as('total_winnings_distributed'),
      })
      .from(users)
      .leftJoin(participants, eq(users.id, participants.userId))
      .leftJoin(games, eq(participants.gameId, games.id));

    const r = (stats as any[])[0];

    return {
      totalUsers: Number(r?.total_users) || 0,
      totalGames: Number(r?.total_games) || 0,
      totalResolvedGames: Number(r?.total_resolved_games) || 0,
      totalUnresolvedGames: Number(r?.total_unresolved_games) || 0,
      usersWithWinnings: Number(r?.users_with_winnings) || 0,
      totalWinningsDistributed: Number(r?.total_winnings_distributed) || 0,
    };
  }
}
