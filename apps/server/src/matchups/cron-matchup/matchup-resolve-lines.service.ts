import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { MatchupsService } from '../matchups.service';
import { ADMIN_WALLET_PUBLIC_KEY } from 'src/utils/services/paraAnchor';
import { matchups } from '@repo/db';
import { and, eq } from 'drizzle-orm';
import { LinesResolveSuccessOutput } from './types/lines-resolve-success-outpot.type';

@Injectable()
export class MatchupResolveLinesService {
  private readonly logger = new Logger(MatchupResolveLinesService.name);

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly matchupsService: MatchupsService,
  ) { }

  // 30 minutes interval
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    this.logger.log('Running matchup resolve lines cron job...');
    const matchupsToResolve = await this.db.query.matchups.findMany({
      where: and(
        eq(matchups.status, 'finished'),
        eq(matchups.ifLinesResolved, false),
      ),
    })
    if (matchupsToResolve.length === 0) {
      this.logger.log('No matchups to resolve lines for, skipping...');
      return;
    }
    this.logger.log(
      `Found ${matchupsToResolve.length} matchups to resolve lines for`,
    );
    for (const matchup of matchupsToResolve) {
      const matchupId = matchup.id;
      this.logger.log(`Resolving lines for matchup ${matchupId}`);
      const walletAddress = ADMIN_WALLET_PUBLIC_KEY.toString();
      try {
        const resolvedLinesData: LinesResolveSuccessOutput[] =
          await this.matchupsService.resolveLinesForMatchup(
            {
              matchupId,
            },
            {
              walletAddress,
            },
          );
        for (const line of resolvedLinesData) {
          const { statName, athleteName, predictedValue, actualValue } = line;
          const result = actualValue > predictedValue ? 'OVER' : actualValue < predictedValue ? 'UNDER' : 'PUSH';
          this.logger.log(`Resolved Line: ${statName} - ${athleteName} | Predicted: ${predictedValue} | Actual: ${actualValue} | Result: ${result}`);
        }
        await this.db.update(matchups).set({ ifLinesResolved: true }).where(eq(matchups.id, matchupId));
        if (resolvedLinesData.length === 0) {
          this.logger.log(`No lines found for matchup ${matchupId}`);
          continue;
        }
        this.logger.log(`SUCCESS: Resolved lines for matchup ${matchupId}`);
      } catch (error) {
        this.logger.error(
          `ERROR: Error resolving lines for matchup ${matchupId}`,
          error,
        );
      }
    }
  }
}
