import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { MatchupsService } from '../matchups.service';
import { TeamService } from 'src/team/team.service';
import { MatchupStatus } from '../enum/matchups';
import { EspnEventData } from './types/matchups-creation-espn';

@Injectable()
export class MatchupCreationService {
  private readonly logger = new Logger(MatchupCreationService.name);

  constructor(
    private readonly matchupsService: MatchupsService,
    private readonly teamService: TeamService,
  ) {}

  // Runs every day
  @Cron(CronExpression.EVERY_WEEK)
  async createAllMatchupsFromEspn() {
    const SEASON_TYPE_MAP = {
      PRESEASON: 1,
      REGULAR: 2,
      POSTSEASON: 3,
      OFFSEASON: 4,
    };

    this.logger.log('Running Daily ESPN matchup fetch job...');
    try {
      // 1. Get all specified season week URLs
      const weeksResp = await axios.get(
        `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/${SEASON_TYPE_MAP.REGULAR}/weeks?lang=en&region=us`,
      );
      const weekRefs: string[] = weeksResp.data.items.map(
        (item: { $ref: string }) => {
          const eventUrl = item.$ref;

          const [urlPart1, urlPart2] = eventUrl.split('?');
          return `${urlPart1}/events?${urlPart2}`;
        },
      );

      // 2. Get event (game) URLs from each week
      for (const weekUrl of weekRefs) {
        try {
          const weekData = (await axios.get(weekUrl)).data;
          const eventRefs: string[] = weekData.items.map(
            (item: { $ref: string }) => item.$ref,
          );

          // 3. Get single event detail (single game)
          for (const eventUrl of eventRefs) {
            try {
              const eventData: EspnEventData = (await axios.get(eventUrl)).data;
              const competition = eventData.competitions?.[0];
              if (!competition) continue;

              const homeCompetitor = competition.competitors.find(
                (c) => c.homeAway === 'home',
              );
              const awayCompetitor = competition.competitors.find(
                (c) => c.homeAway === 'away',
              );
              if (!homeCompetitor || !awayCompetitor) continue;

              const homeEspnId: string = homeCompetitor.id;
              const awayEspnId: string = awayCompetitor.id;

              const homeTeam = await this.teamService.findByEspnId(homeEspnId);
              const awayTeam = await this.teamService.findByEspnId(awayEspnId);

              if (!homeTeam || !awayTeam) {
                this.logger.warn(
                  `Team not found for matchup: home ESPN ID ${homeEspnId}, away ESPN ID ${awayEspnId}`,
                );
                continue;
              }

              const existingMatchup =
                await this.matchupsService.getMatchupByEspnId(eventData.id);

              if (existingMatchup) {
                if (existingMatchup.status !== MatchupStatus.SCHEDULED) {
                  this.logger.log(
                    `Matchup ${eventData.id} already exists and ${existingMatchup.status}, skipping...`,
                  );
                  continue;
                } else {
                  await this.matchupsService.updateMatchup(existingMatchup.id, {
                    startsAtTimestamp: new Date(competition.date).getTime(),
                  });
                  this.logger.log(
                    `Updated matchup for event ${eventData.id}: ${homeTeam.name} vs ${awayTeam.name}`,
                  );
                }
              } else {
                await this.matchupsService.createMatchup({
                  espnEventId: eventData.id,
                  homeTeamId: homeTeam.id,
                  awayTeamId: awayTeam.id,
                  startsAtTimestamp: new Date(competition.date).getTime(),
                });
                this.logger.log(
                  `Created matchup for event ${eventData.id}: ${homeTeam.name} vs ${awayTeam.name}`,
                );
              }
            } catch (err) {
              this.logger.warn('Error processing event: ' + eventUrl, err);
            }
          }
        } catch (err) {
          this.logger.warn('Error fetching events for week: ' + weekUrl, err);
        }
      }
      this.logger.log('ESPN matchup fetch job completed.');
    } catch (error) {
      this.logger.error(
        'MatchupCreationService Cron job failed while fetching matchups',
        error,
      );
    }
  }
}
