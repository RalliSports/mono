import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
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
import {
  ProcessedData,
  fetchESPNBoxscoreData,
} from './utils/espnEvent-finalScore-dataProcess';
import { matchups } from '@repo/db';

@Injectable()
export class MatchupLivescoreService {
  private readonly logger = new Logger(MatchupLivescoreService.name);

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
    private readonly matchupsService: MatchupsService,
    private readonly linesService: LinesService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  // 60 minutes interval
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Running matchups livescore cron job...');
    const matchupsInProgress =
      await this.matchupsService.getMatchupsInProgress();
    for (const matchup of matchupsInProgress) {
      if (!matchup.espnEventId) {
        this.logger.warn(
          `Skipping matchup ${matchup.id} due to missing espnEventId`,
        );
        continue;
      }
      const espnStatus: EspnMatchupStatusResponse =
        await fetchEspnMatchupStatus(matchup.espnEventId);
      if (!espnStatus || !espnStatus.type) {
        this.logger.warn(`Invalid ESPN status data for ${matchup.espnEventId}`);
        continue;
      }

      if (
        espnStatus.type.name !== EspnStatusName.FINAL &&
        espnStatus.type.name !== EspnStatusName.IN_PROGRESS &&
        espnStatus.type.name !== EspnStatusName.CURRENT
      ) {
        this.logger.warn(
          `Matchup ${matchup.id} not in progress/final, skipping`,
        );
        continue;
      }
      this.startLiveScoreCronForMatchup(matchup);
    }
  }

  //Live Score Update For In-Progress Matchups
  startLiveScoreCronForMatchup(matchup) {
    const matchupId = matchup.id;
    const espnEventId = matchup.espnEventId;
    const liveScoreCronJob = `live-score-update-${matchupId}`;
    if (this.schedulerRegistry.doesExist('cron', liveScoreCronJob)) return; //avoiding double-registration

    const CRON_INTERVAL = 3; // (N) minutes interval
    const cronIntervalExpression = `*/${CRON_INTERVAL} * * * *`;
    const liveScoreCronJobInstance = new CronJob(
      cronIntervalExpression,
      async () => {
        this.logger.log(`LiveScore Updating for matchup: ${matchupId}`);

        const currentEspnStatus: EspnMatchupStatusResponse =
          await fetchEspnMatchupStatus(matchupId);
        if (!currentEspnStatus || !currentEspnStatus.type) {
          this.logger.warn(`Invalid ESPN status data for ${matchupId}`);
          this.schedulerRegistry.deleteCronJob(liveScoreCronJob);
          return;
        }
        const matchupBoxScore: ProcessedData =
          await fetchESPNBoxscoreData(espnEventId);
        if (currentEspnStatus.type.name === EspnStatusName.FINAL) {
          this.logger.log(
            `Matchup ${matchupId} is finalized, stopping livescore cron...`,
          );
          this.matchupsService.updateMatchup(matchupId, {
            status: MatchupStatus.FINISHED,
          });
          this.schedulerRegistry.deleteCronJob(liveScoreCronJob);
          return;
        }
      },
    );

    this.schedulerRegistry.addCronJob(
      liveScoreCronJob,
      liveScoreCronJobInstance,
    );
    liveScoreCronJobInstance.start();
    this.logger.log(`Started live-score-update CRON for matchup: ${matchupId}`);
  }
}
