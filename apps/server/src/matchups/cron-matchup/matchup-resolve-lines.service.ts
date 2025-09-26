//UNUSED - Waiting on ON-Chain Program Upadate<Additional Admins>

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { MatchupStatus } from '../enum/matchups';
import { LineStatus } from 'src/lines/enum/lines';
import { MatchupsService } from '../matchups.service';
import { LinesService } from 'src/lines/lines.service';
import {
  EspnMatchupStatusResponse,
  EspnStatusName,
} from './types/matchup-status-espn-response.types';
import { fetchEspnMatchupStatus } from './utils/espn-event-status-fetcher';

@Injectable()
export class MatchupResolveLinesService {
  private readonly logger = new Logger(MatchupResolveLinesService.name);

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
    private readonly matchupsService: MatchupsService,
    private readonly linesService: LinesService,
  ) {}

  // 60 minutes interval
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Running matchup resolve lines cron job...');

    const matchupsToResolve =
      await this.matchupsService.getMatchupsInProgress();

    for (const matchup of matchupsToResolve) {
      if (!matchup.espnEventId) {
        this.logger.warn(
          `Skipping matchup ${matchup.id} due to missing espnEventId`,
        );
        continue;
      }

      if (matchup.status !== MatchupStatus.IN_PROGRESS) {
        this.logger.warn(
          `Skipping matchup ${matchup.id} due to status ${matchup.status}`,
        );
        continue;
      }

      const espnStatus: EspnMatchupStatusResponse =
        await fetchEspnMatchupStatus(matchup.espnEventId);
      if (!espnStatus || !espnStatus.type) {
        this.logger.warn(`Invalid ESPN status data for ${matchup.espnEventId}`);
        continue;
      }

      if (espnStatus.type.name === EspnStatusName.FINAL) {
        for (const line of matchup.lines) {
          await this.linesService.updateLine(line.id, {
            status: LineStatus.RESOLVED,
          });
          this.logger.log(`Resolved line ${line.id}`);
        }
        await this.matchupsService.updateMatchup(matchup.id, {
          status: MatchupStatus.FINISHED,
        });
        this.logger.log(`Updated matchup ${matchup.id} to FINISHED`);
      }
    }
    this.logger.log('Matchup resolve lines cron job completed.');
  }
}
