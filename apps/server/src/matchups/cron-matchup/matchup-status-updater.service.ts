import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { MatchupStatus } from '../enum/matchups';
import { LineStatus } from 'src/lines/enum/lines';
import { MatchupsService } from '../matchups.service';
import {
  EspnStatusType,
  EspnStatusName,
  EspnMatchupStatusResponse,
} from './types/matchup-status-espn-response.types';
import { LinesService } from 'src/lines/lines.service';

@Injectable()
export class MatchupStatusUpdaterService {
  private readonly logger = new Logger(MatchupStatusUpdaterService.name);

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
    private readonly matchupsService: MatchupsService,
    private readonly linesService: LinesService,
  ) {}

  // Fetch live ESPN status of a matchup by espnEventId, returns parsed JSON or null
  async fetchEspnMatchupStatus(espnEventId: string) {
    const url = `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${espnEventId}/competitions/${espnEventId}/status?lang=en&region=us`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error fetching ESPN status for event ${espnEventId}:`,
        error,
      );
      return null;
    }
  }

  // 60 minutes interval
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Running matchup status update cron job...');

    const matchupsToUpdate =
      await this.matchupsService.getMatchupsThatShouldHaveStarted();

    for (const matchup of matchupsToUpdate) {
      if (!matchup.espnEventId) {
        this.logger.warn(
          `Skipping matchup ${matchup.id} due to missing espnEventId`,
        );
        continue;
      }

      if (matchup.status !== MatchupStatus.SCHEDULED) {
        this.logger.warn(
          `Skipping matchup ${matchup.id} due to status ${matchup.status}`,
        );
        continue;
      }

      const espnStatus: EspnMatchupStatusResponse =
        await this.fetchEspnMatchupStatus(matchup.espnEventId);
      if (!espnStatus || !espnStatus.type) {
        this.logger.warn(`Invalid ESPN status data for ${matchup.espnEventId}`);
        continue;
      }

      if (
        espnStatus.type.name === EspnStatusName.IN_PROGRESS ||
        espnStatus.type.name === EspnStatusName.CURRENT
      ) {
        for (const line of matchup.lines) {
          if (line.status !== LineStatus.OPEN) {
            this.logger.warn(
              `Skipping line ${line.id} due to status ${line.status}`,
            );
            continue;
          }

          await this.linesService.updateLine(line.id, {
            status: LineStatus.LOCKED,
          });
          this.logger.log(`Updated line ${line.id} to LOCKED`);
        }
        await this.matchupsService.updateMatchup(matchup.id, {
          status: MatchupStatus.IN_PROGRESS,
        });
        this.logger.log(`Updated matchup ${matchup.id} to IN_PROGRESS`);
      }
    }
    this.logger.log('Matchup status update cron job completed.');
  }
}
