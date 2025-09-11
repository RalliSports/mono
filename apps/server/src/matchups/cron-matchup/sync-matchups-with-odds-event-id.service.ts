import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { MatchupsService } from '../matchups.service';
import { OddsEventsResponse } from './types/matchup-odds-events-response.types';
import { ODDS_API_BASE_URL, AMERICAN_FOOTBALL_LABEL } from './types/constants';

@Injectable()
export class SyncMatchupsWithOddsEventIdService {
  private readonly logger = new Logger(SyncMatchupsWithOddsEventIdService.name);

  constructor(private readonly matchupsService: MatchupsService) {}

  async fetchOddsApiEvents() {
    const url = `${ODDS_API_BASE_URL}/${AMERICAN_FOOTBALL_LABEL}/events?apiKey=${process.env.ODDS_API_KEY}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching Odds API events:`, error);
      return null;
    }
  }

  //as odds gets the weekly data
  @Cron(CronExpression.EVERY_WEEK)
  async syncMatchupsWithOddsEventId() {
    this.logger.log('Running matchup odds API event ID sync job...');
    const oddsApiEvents: OddsEventsResponse = await this.fetchOddsApiEvents();
    if (!oddsApiEvents) {
      this.logger.error('No Odds API events found, skipping sync...');
      return;
    }

    // Safer to sort, than trusting the order of the API response
    oddsApiEvents.sort((a, b) => {
      return (
        new Date(a.commence_time).getTime() -
        new Date(b.commence_time).getTime()
      );
    });

    // Get matchups between & including the start and end date range
    const startDateRange = oddsApiEvents[0].commence_time;
    const endDateRange = oddsApiEvents[oddsApiEvents.length - 1].commence_time;
    const matchupsInRange =
      await this.matchupsService.getMatchupsBetweenDateTimeRange(
        startDateRange,
        endDateRange,
      );

    for (const oddsApiEvent of oddsApiEvents) {
      this.logger.log(`Processing Odds API event: ${oddsApiEvent.id}`);
      const matchupPicked = matchupsInRange.find(
        (matchup) =>
          matchup.homeTeam?.name === oddsApiEvent.home_team &&
          matchup.awayTeam?.name === oddsApiEvent.away_team,
      );
      if (matchupPicked) {
        await this.matchupsService.updateMatchup(matchupPicked.id, {
          oddsApiEventId: oddsApiEvent.id,
        });
        this.logger.log(
          `Updated matchup with ESPN event ID ${matchupPicked.espnEventId} with Odds API event ID ${oddsApiEvent.id}`,
        );
      }
    }
    this.logger.log('Matchup odds API event ID sync job completed.');
  }
}
