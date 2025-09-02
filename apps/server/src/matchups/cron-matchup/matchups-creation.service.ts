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
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createAllMatchupsFromEspn() {
    this.logger.log('Running daily ESPN matchup fetch job...');
    try {
      const seasonTypeMap = {
        preseason: 1,
        regular: 2,
        postseason: 3,
        offseason: 4,
      };

      // 1. Get all specified season week URLs
      const weeksResp = await axios.get(
        `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/${seasonTypeMap.regular}/weeks?lang=en&region=us`,
      );
      const weekRefs: string[] = weeksResp.data.items.map((item) => item.$ref);

      // 2. Get event (game) URLs from each week
      for (const weekUrl of weekRefs) {
        // this.logger.log(`Fetching week: ${weekUrl}`);
        const weekData = (await axios.get(weekUrl)).data;
        // Extract the nested events URL
        const eventsUrl: string | undefined = weekData.events?.$ref;
        if (!eventsUrl) {
          this.logger.warn(`No events URL found in week data ${weekUrl}`);
          continue; // skip this week if no events URL
        }
        const eventsData = (await axios.get(eventsUrl)).data;
        //https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/weeks/1/events?lang=en&region=us
        const eventRefs: string[] = eventsData.items.map(
          (item: { $ref: string }) => item.$ref,
        );

        // 3. Get single event detail (single game)
        const eventUrl = eventRefs[0];
        // for (const eventUrl of eventRefs) {
        //https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/401772510?lang=en&region=us

        let eventIdIfExists = eventUrl.split('/').pop()?.split('?')[0];
        // this.logger.log(`Fetching event: ${eventIdIfExists}`);

        // If the event already exists, and IN_PROGRESS/FINISHED/CANCELLED, skip it - Otherwise, update it <For Rescheduled games>
        if (eventIdIfExists) {
          try {
            const existingMatchup =
              await this.matchupsService.getMatchupByEspnId(eventIdIfExists);
            if (
              existingMatchup &&
              existingMatchup.status !== MatchupStatus.SCHEDULED
            ) {
              this.logger.log(
                `Matchup ${eventIdIfExists} already exists and ${existingMatchup.status}, skipping...`,
              );
              continue;
            }
          } catch (err) {
            this.logger.warn(
              `Matchup ${eventIdIfExists} does not exist, creating...`,
            );
          }
        }
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
          if (eventIdIfExists) {
            await this.matchupsService.updateMatchup(eventIdIfExists, {
              homeTeamId: homeTeam.id,
              awayTeamId: awayTeam.id,
              startsAtTimestamp: new Date(competition.date).getTime(),
            });
            this.logger.log(
              `Updated matchup for event ${eventData.id}: ${homeTeam.name} vs ${awayTeam.name}`,
            );
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
        // }
      }
      this.logger.log('ESPN matchup fetch job completed.');
    } catch (error) {
      this.logger.error('Cron job failed while fetching matchups', error);
    }
  }
}
