/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { lines } from '@repo/db';
// import type { EspnScoreboardResponse } from './types/espn-odds.types';

@Injectable()
export class LinesService {
  private readonly logger = new Logger(LinesService.name);

  constructor(private readonly db: NodePgDatabase<any>) {}

  @Cron(CronExpression.EVERY_10_MINUTES) // Runs every 10 minutes, adjust as needed
  async fetchAndStoreNFLBettingLines() {
    try {
      this.logger.log('Fetching NFL betting lines from ESPN...');
      const scoreboardUrl =
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

      const { data } = await axios.get(scoreboardUrl);

      for (const event of data.events || []) {
        const competition = event.competitions?.[0];
        if (!competition) continue;

        const matchupId = event.id;

        for (const odds of competition.odds || []) {
          if (!odds.spread && !odds.overUnder) continue;

          if (odds.spread !== undefined && odds.spread !== null) {
            await this.upsertLine({
              id: `espn-${matchupId}-${odds.provider.id}-spread-home`,
              athleteId: null,
              statId: '550e8400-e29b-41d4-a716-446655440040',
              matchupId,
              predictedValue: odds.spread.toString(),
              actualValue: null,
              isHigher: null,
              createdAt: new Date(event.date),
            });
            await this.upsertLine({
              id: `espn-${matchupId}-${odds.provider.id}-spread-away`,
              athleteId: null,
              statId: '550e8400-e29b-41d4-a716-446655440040', // same stat id
              matchupId,
              predictedValue: (-odds.spread).toString(),
              actualValue: null,
              isHigher: null,
              createdAt: new Date(event.date),
            });
          }

          if (odds.overUnder !== undefined && odds.overUnder !== null) {
            await this.upsertLine({
              id: `espn-${matchupId}-${odds.provider.id}-total-over`,
              athleteId: null,
              statId: '550e8400-e29b-41d4-a716-446655440041', // your 'total_over' stat id
              matchupId,
              predictedValue: odds.overUnder.toString(),
              actualValue: null,
              isHigher: true,
              createdAt: new Date(event.date),
            });
            await this.upsertLine({
              id: `espn-${matchupId}-${odds.provider.id}-total-under`,
              athleteId: null,
              statId: '550e8400-e29b-41d4-a716-446655440041', // same stat id
              matchupId,
              predictedValue: odds.overUnder.toString(),
              actualValue: null,
              isHigher: false,
              createdAt: new Date(event.date),
            });
          }
        }
      }

      this.logger.log('✅ NFL betting lines ingested successfully');
    } catch (error) {
      this.logger.error('Failed to ingest NFL betting lines:', error);
    }
  }

  private async upsertLine(line) {
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
