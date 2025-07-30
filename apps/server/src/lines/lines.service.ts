import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { lines } from '@repo/db';
import type { InferInsertModel } from 'drizzle-orm';
type LineInsert = InferInsertModel<typeof lines>;

interface EspnTeam {
  id: string;
  uid: string;
  abbreviation: string;
  name: string;
  displayName: string;
  logo: string;
}

interface EspnOddsDetails {
  provider: { id: string; name: string; priority?: number };
  details: string; // e.g. "DET -2"
  overUnder?: number;
  spread?: number;
  awayTeamOdds: {
    favorite: boolean;
    underdog: boolean;
    team: EspnTeam;
  };
  homeTeamOdds: {
    favorite: boolean;
    underdog: boolean;
    team: EspnTeam;
  };
  open: {
    over?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
    };
    under?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
    };
    total?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
    };
  };
  current: {
    over?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
      outcome?: { type: string };
    };
    under?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
      outcome?: { type: string };
    };
    total?: { alternateDisplayValue: string; american: string };
  };
}

interface EspnCompetition {
  odds?: EspnOddsDetails[];
}

interface EspnEvent {
  id: string;
  date: string;
  competitions?: EspnCompetition[];
}

interface EspnScoreboardResponse {
  events?: EspnEvent[];
}

@Injectable()
export class LinesService {
  private readonly logger = new Logger(LinesService.name);

  constructor(private readonly db: NodePgDatabase<any>) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async fetchAndStoreNFLBettingLines(): Promise<void> {
    try {
      this.logger.log('Fetching NFL betting lines from ESPN...');
      const scoreboardUrl =
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

      const { data } = await axios.get<EspnScoreboardResponse>(scoreboardUrl);

      const events = data.events ?? [];

      for (const event of events) {
        const competition = event.competitions?.[0];
        if (!competition || !competition.odds) continue;

        const matchupId = event.id;

        for (const odds of competition.odds) {
          const providerId = odds.provider?.id ?? 'default';

          // Skip if neither spread nor overUnder available
          if (odds.spread == null && odds.overUnder == null) continue;

          const upsertLines: Promise<void>[] = [];

          // Handle spread lines (home and away)
          if (odds.spread != null) {
            // Home spread line (value is spread)
            upsertLines.push(
              this.upsertLine({
                id: `espn-${matchupId}-${providerId}-spread-home`,
                athleteId: null,
                statId: '550e8400-e29b-41d4-a716-446655440040', // "spread" stat ID
                matchupId,
                predictedValue: odds.spread.toString(),
                actualValue: null,
                isHigher: null,
                createdAt: new Date(event.date),
              }),
            );

            // Away spread line (value is negative spread)
            upsertLines.push(
              this.upsertLine({
                id: `espn-${matchupId}-${providerId}-spread-away`,
                athleteId: null,
                statId: '550e8400-e29b-41d4-a716-446655440040',
                matchupId,
                predictedValue: (-odds.spread).toString(),
                actualValue: null,
                isHigher: null,
                createdAt: new Date(event.date),
              }),
            );
          }

          // Handle over/under total lines
          if (odds.overUnder != null) {
            upsertLines.push(
              this.upsertLine({
                id: `espn-${matchupId}-${providerId}-total-over`,
                athleteId: null,
                statId: '550e8400-e29b-41d4-a716-446655440041', // "total_over" stat ID
                matchupId,
                predictedValue: odds.overUnder.toString(),
                actualValue: null,
                isHigher: true,
                createdAt: new Date(event.date),
              }),
            );

            upsertLines.push(
              this.upsertLine({
                id: `espn-${matchupId}-${providerId}-total-under`,
                athleteId: null,
                statId: '550e8400-e29b-41d4-a716-446655440041',
                matchupId,
                predictedValue: odds.overUnder.toString(),
                actualValue: null,
                isHigher: false,
                createdAt: new Date(event.date),
              }),
            );
          }

          await Promise.all(upsertLines);
        }
      }

      this.logger.log('✅ NFL betting lines ingested successfully');
    } catch (error) {
      this.logger.error('Failed to ingest NFL betting lines:', error);
    }
  }

  private async upsertLine(line: LineInsert): Promise<void> {
    await this.db
      .insert(lines)
      .values(line)
      .onConflictDoUpdate({
        target: lines.id,
        set: {
          predictedValue: line.predictedValue,
          actualValue: line.actualValue,
          isHigher: line.isHigher,
          createdAt: line.createdAt,
        },
      });
  }
}
