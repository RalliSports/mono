import { Injectable, NotFoundException } from '@nestjs/common';
import { matchups, stats, athletes, lines } from '@repo/db';
import { and, eq, gt, lt, gte, lte, or } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { CreateMatchupDto } from './dto/create-matchup.dto';
import { UpdateMatchupDto } from './dto/update-matchup.dto';
import { MatchupStatus } from './enum/matchups';
import { CreateLineDto } from 'src/lines/dto/create-line.dto';
import { NFLBettingData } from './cron-matchup/types/oddsApiTypes';
import { LinesService } from 'src/lines/lines.service';
import { User } from 'src/user/dto/user-response.dto';
import {
  AMERICAN_FOOTBALL_LABEL,
  ODDS_API_BASE_URL,
  AMERICAN_FOOTBALL_MARKETS,
} from './cron-matchup/types/constants';
import { CreateLinesDto } from './dto/create-lines.dto';
import { StatsService } from 'src/stats/stats.service';
import {
  EspnMatchupStatusResponse,
  EspnStatusName,
} from './cron-matchup/types/matchup-status-espn-response.types';
import { fetchEspnMatchupStatus } from './cron-matchup/utils/espn-event-status-fetcher';
import { ResolveLineDto } from 'src/lines/dto/resolve-line.dto';
import {
  fetchESPNBoxscoreData,
  ProcessedData,
} from './cron-matchup/utils/espnEvent-finalScore-dataProcess';

@Injectable()
export class MatchupsService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
    private readonly linesService: LinesService,
    private readonly statsService: StatsService,
  ) {}

  async getAllMatchups() {
    return this.db.query.matchups.findMany({
      with: {
        homeTeam: {
          columns: {
            name: true,
          },
        },
        awayTeam: {
          columns: {
            name: true,
          },
        },
      },
    });
  }

  async getAllOpenMatchups() {
    return this.db.query.matchups.findMany({
      with: {
        homeTeam: {
          columns: {
            name: true,
          },
        },
        awayTeam: {
          columns: {
            name: true,
          },
        },
      },
      where: and(eq(matchups.status, MatchupStatus.SCHEDULED)),
    });
  }

  async getMatchupsThatShouldHaveStarted() {
    const now = new Date();

    return this.db.query.matchups.findMany({
      with: {
        lines: {
          columns: {
            id: true,
            status: true,
          },
        },
      },
      where: and(
        eq(matchups.status, MatchupStatus.SCHEDULED),
        lt(matchups.startsAt, now),
      ),
    });
  }

  async getMatchupsBetweenDateTimeRange(
    startDateTime: string,
    endDateTime: string,
  ) {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    const DAY_TOLERANCE = 1; // 1 day tolerance both ways
    start.setDate(start.getDate() - DAY_TOLERANCE);
    end.setDate(end.getDate() + DAY_TOLERANCE);

    return this.db.query.matchups.findMany({
      where: and(gte(matchups.startsAt, start), lte(matchups.startsAt, end)),
      with: {
        homeTeam: {
          columns: {
            name: true,
          },
        },
        awayTeam: {
          columns: {
            name: true,
          },
        },
      },
    });
  }

  async getMatchupsInProgress() {
    const now = new Date();

    return this.db.query.matchups.findMany({
      with: {
        lines: {
          columns: {
            id: true,
            status: true,
            statId: true,
            athleteId: true,
            matchupId: true,
          },
        },
      },
      where: and(
        eq(matchups.status, MatchupStatus.IN_PROGRESS),
        lt(matchups.startsAt, now),
      ),
    });
  }

  async getMatchupById(id: string) {
    const matchup = await this.db.query.matchups.findFirst({
      where: eq(matchups.id, id),
    });

    if (!matchup) throw new NotFoundException('Matchup not found');
    return matchup;
  }

  async getMatchupByEspnId(espnEventId: string) {
    return await this.db.query.matchups.findFirst({
      where: eq(matchups.espnEventId, espnEventId),
    });
  }

  async updateMatchup(id: string, dto: UpdateMatchupDto) {
    const matchup = await this.db
      .update(matchups)
      .set({
        ...dto,
        startsAt: dto.startsAtTimestamp
          ? new Date(dto.startsAtTimestamp)
          : undefined,
        gameDate: dto.startsAtTimestamp
          ? new Date(dto.startsAtTimestamp).toISOString()
          : undefined,
      })
      .where(eq(matchups.id, id))
      .returning();

    return matchup;
  }

  async createMatchup(dto: CreateMatchupDto) {
    const matchup = await this.db
      .insert(matchups)
      .values({
        espnEventId: dto.espnEventId,
        homeTeamId: dto.homeTeamId,
        awayTeamId: dto.awayTeamId,
        startsAt: new Date(dto.startsAtTimestamp),
        gameDate: new Date(dto.startsAtTimestamp).toISOString(),
        status: MatchupStatus.SCHEDULED,
        scoreHome: 0,
        scoreAway: 0,
      })
      .returning();
    return matchup;
  }

  async createLinesForMatchup(dto: CreateLinesDto, user: User) {
    const matchup = await this.db.query.matchups.findFirst({
      where: eq(matchups.id, dto.matchupId),
    });
    const linesURL = `${ODDS_API_BASE_URL}/${AMERICAN_FOOTBALL_LABEL}/events/${matchup?.oddsApiEventId}/odds?apiKey=${process.env.ODDS_API_KEY}&regions=us&markets=${AMERICAN_FOOTBALL_MARKETS.join(',').replace('[', '').replace(']', '')}&bookmakers=draftkings`;

    const linesResponse: NFLBettingData = await fetch(linesURL).then((res) =>
      res.json(),
    );
    console.log('linesResponse', linesResponse);
    const allAthletes = await this.db.query.athletes.findMany({
      where: or(
        eq(athletes.teamId, matchup?.homeTeamId!),
        eq(athletes.teamId, matchup?.awayTeamId!),
      ),
    });

    const allStats = await this.db.query.stats.findMany();

    const formattedLines: CreateLineDto[] = [];

    for (const market of linesResponse.bookmakers[0].markets) {
      const outcomes = market.outcomes;
      for (const outcome of outcomes) {
        if (outcome.name === 'Over') {
          continue;
        }
        const statId = allStats.find(
          (stat) => stat.oddsApiStatName === market.key,
        )?.id;
        if (!statId) {
          console.warn('Stat id not found for: ', market.key);
          continue;
        }
        const athleteId = allAthletes.find(
          (athlete) => athlete.name === outcome.description,
        )?.id;

        if (!athleteId) {
          console.warn(
            `Athlete "${outcome.description}" not found for ${matchup?.espnEventId}`,
          );
          continue;
        }

        formattedLines.push({
          statId: statId,
          athleteId: athleteId,
          matchupId: matchup?.id!,
          predictedValue: outcome.point,
        });
      }
    }

    // Chunk lines into groups of 5
    const chunkSize = 5;
    const chunks: CreateLineDto[][] = [];
    for (let i = 0; i < formattedLines.length; i += chunkSize) {
      chunks.push(formattedLines.slice(i, i + chunkSize));
    }

    // Process each chunk sequentially with 500ms delay between chunks
    for (let i = 0; i < chunks.length; i++) {
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      await this.linesService.bulkCreateLines(chunks[i], user);
    }

    return { message: 'Lines Created Successfully' };
  }

  async resolveLinesForMatchup(dto: ResolveLineDto, user: User) {
    console.log('Resolving lines for matchups...');
    const matchupsToResolve = await this.getMatchupsInProgress();
    const allStats = await this.statsService.getAllStats();
    const allLinesToResolve: ResolveLineDto[] = [];
    for (const matchup of matchupsToResolve) {
      if (!matchup.espnEventId) {
        console.warn(`Matchup ${matchup.id} missing ESPN event ID`);
        continue;
      }
      const espnStatus: EspnMatchupStatusResponse =
        await fetchEspnMatchupStatus(matchup.espnEventId);

      //Check if matchup is final
      if (!espnStatus || !espnStatus.type) {
        console.warn(`Invalid ESPN status data for ${matchup.espnEventId}`);
        continue;
      }
      if (espnStatus.type.name !== EspnStatusName.FINAL) {
        console.warn(`Matchup ${matchup.id} not final, skipping`);
        continue;
      }
      const allAthletesInThisMatchup = await this.db.query.athletes.findMany({
        where: or(
          eq(athletes.teamId, matchup?.homeTeamId!),
          eq(athletes.teamId, matchup?.awayTeamId!),
        ),
      });
      const matchupBoxScore: ProcessedData = await fetchESPNBoxscoreData(
        matchup.espnEventId,
      );

      for (const outcomePerAthlete of matchupBoxScore.athletes) {
        const athlete = allAthletesInThisMatchup.find(
          (athlete) => athlete.name === outcomePerAthlete.name,
        );
        if (!athlete) {
          console.warn(
            `Athlete "${outcomePerAthlete.name}" not found for ${matchup.espnEventId}`,
          );
          continue;
        }
        for (const linesDataPerAthlete in outcomePerAthlete.lines) {
          const stat = allStats.find(
            (stat) => stat.oddsApiStatName === linesDataPerAthlete,
          );
          if (!stat) {
            console.warn(
              `Stat "${linesDataPerAthlete}" not found for ${matchup.espnEventId}`,
            );
            continue;
          }
          const line = await this.db.query.lines.findFirst({
            where: and(
              eq(lines.athleteId, athlete.id),
              eq(lines.statId, stat.id),
              eq(lines.matchupId, matchup.id),
            ),
          });
          if (!line) {
            console.warn(
              `Line not found for ${matchup.espnEventId} - ${athlete.name} - ${stat.name}`,
            );
            continue;
          }
          const actualValue = outcomePerAthlete.lines[linesDataPerAthlete];
          try {
            allLinesToResolve.push({
              lineId: line.id,
              actualValue: Number(actualValue),
            });
          } catch (error) {
            console.error(
              `Error processing line for ${matchup.espnEventId} - ${athlete.name} - ${stat.name}-${actualValue}`,
              error,
            );
            continue;
          }
        }
      }
    }

    // Chunk lines into groups of 5
    const CHUNK_SIZE = 5;
    const chunks: ResolveLineDto[][] = [];
    for (let i = 0; i < allLinesToResolve.length; i += CHUNK_SIZE) {
      chunks.push(allLinesToResolve.slice(i, i + CHUNK_SIZE));
    }

    // Process each chunk sequentially with 500ms delay between chunks
    for (let i = 0; i < chunks.length; i++) {
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      await this.linesService.bulkResolveLines(chunks[i], user);
    }

    return { message: 'Lines Resolved Successfully.' };
  }
}
