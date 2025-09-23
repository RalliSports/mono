import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { MatchupStatus } from '../enum/matchups';
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
import { athletes, lines, matchups } from '@repo/db';
import { and, eq, or, inArray } from 'drizzle-orm';

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
    this.logger.log('Matchups livescore update cron job completed.');
  }

  //Live Score Update For In-Progress Matchups
  startLiveScoreCronForMatchup(matchup: typeof matchups.$inferSelect) {
    const matchupId = matchup.id;
    const espnEventId = matchup.espnEventId;
    const homeTeamId = matchup.homeTeamId;
    const awayTeamId = matchup.awayTeamId;
    const liveScoreCronJob = `live-score-update-${matchupId}`;
    if (this.schedulerRegistry.doesExist('cron', liveScoreCronJob)) return; //avoiding double-registration

    const CRON_INTERVAL = 2; // (N) minutes interval
    const cronIntervalExpression = `*/${CRON_INTERVAL} * * * *`;
    const liveScoreCronJobInstance = new CronJob(
      cronIntervalExpression,
      async () => {
        this.logger.log(`LiveScore Updating for matchup: ${matchupId}`);

        const currentEspnStatus: EspnMatchupStatusResponse =
          await fetchEspnMatchupStatus(espnEventId!);
        if (!currentEspnStatus || !currentEspnStatus.type) {
          this.logger.warn(`Invalid ESPN status data for ${matchupId}`);
          this.schedulerRegistry.deleteCronJob(liveScoreCronJob);
          return;
        }
        const allLinesInThisMatchup = await this.db.query.lines.findMany({
          where: and(eq(lines.matchupId, matchupId)),
          with: {
            athlete: {
              columns: {
                name: true,
              },
            },
            stat: {
              columns: {
                name: true,
                statOddsName: true,
              },
            },
          },
        });
        const allAthletesInThisMatchupWithLines =
          await this.db.query.athletes.findMany({
            where: or(
              eq(athletes.teamId, homeTeamId!),
              eq(athletes.teamId, awayTeamId!),
              inArray(
                athletes.id,
                allLinesInThisMatchup.map((line) => line.athleteId ?? ''),
              ),
            ),
          });
        if (allAthletesInThisMatchupWithLines.length === 0) {
          this.logger.warn(
            `No athletes found for matchup ${matchupId}, stopping livescore cron...`,
          );
          this.schedulerRegistry.deleteCronJob(liveScoreCronJob);
          return;
        }
        const matchupBoxScore: ProcessedData = await fetchESPNBoxscoreData(
          espnEventId!,
        );
        for (const athlete of allAthletesInThisMatchupWithLines) {
          const lines = allLinesInThisMatchup.filter(
            (line) => line.athleteId === athlete.id,
          );
          const outcomePerAthlete = matchupBoxScore.athletes.find(
            (athlete) => athlete.name === athlete.name,
          );
          if (!outcomePerAthlete) {
            continue;
          }
          for (const lineData of lines) {
            const stat = lineData.stat;
            if (!stat) {
              continue;
            }
            const currentLineValue =
              outcomePerAthlete.lines[stat.statOddsName!];
            try {
              await this.linesService.updateLine(lineData.id, {
                currentValue: Number(currentLineValue),
              });
            } catch (error) {
              console.error(
                `Error processing line for ${matchupId} - ${athlete.name} - ${stat.name}-${currentLineValue}`,
                error,
              );
              continue;
            }
          }
        }

        //Stopping Live Updates for Finalized Matchups
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
        this.logger.log(`LiveScore Updated for matchup: ${matchupId}`);
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
