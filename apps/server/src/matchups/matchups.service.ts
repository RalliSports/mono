import { Injectable, NotFoundException } from '@nestjs/common';
import { matchups, stats, athletes, lines, lineStatusEnum } from '@repo/db';
import {
  and,
  eq,
  lt,
  gte,
  lte,
  or,
  inArray,
  exists
} from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { CreateMatchupDto } from './dto/create-matchup.dto';
import { UpdateMatchupDto } from './dto/update-matchup.dto';
import { MatchupStatus } from './enum/matchups';
import { CreateLineDto } from 'src/lines/dto/create-line.dto';
import { NFLBettingData } from './cron-matchup/types/oddsApiTypes';
import { LinesService } from 'src/lines/lines.service';
import { UserMockForAutoLinesDto } from 'src/user/dto/user-mock-for-auto-lines.dto';
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
import { ResolveLinesDto } from 'src/lines/dto/resolve-lines.dto';
import { sleep } from 'src/utils';
import { LineStatus } from 'src/lines/enum/lines';
import { line, PgColumn } from 'drizzle-orm/pg-core';
import { LinesCreationSuccessOutput } from './cron-matchup/types/lines-creation-success-outpot.type';

@Injectable()
export class MatchupsService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
    private readonly linesService: LinesService,
    private readonly statsService: StatsService,
  ) { }

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

  async getMatchupsWithOpenLines() {
    return this.db.query.matchups.findMany({
      with: {
        lines: {
          columns: {
            id: true,
            status: true,
          },
        },
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
      where: exists(
        this.db
          .select()
          .from(lines)
          .where(
            and(
              eq(lines.status, LineStatus.OPEN),
              eq(lines.matchupId, matchups.id),
            ),
          ),
      ),
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
          },
        },
        homeTeam: {
          columns: {
            id: true,
            name: true,
            espnTeamId: true,
          },
        },
        awayTeam: {
          columns: {
            id: true,
            name: true,
            espnTeamId: true,
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
      with: {
        lines: {
          columns: {
            id: true,
            status: true,
          },
        },
        homeTeam: {
          columns: {
            id: true,
            espnTeamId: true,
            name: true,
          },
        },
        awayTeam: {
          columns: {
            id: true,
            espnTeamId: true,
            name: true,
          },
        },
      },
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

  async createLinesForMatchup(dto: CreateLinesDto, user: UserMockForAutoLinesDto) {
    const matchupId = dto.matchupId;
    if (!matchupId) {
      console.warn('Matchup id is required');
      return [];
    }
    const matchup = await this.db.query.matchups.findFirst({
      where: eq(matchups.id, matchupId),
      with: {
        homeTeam: {
          columns: {
            abbreviation: true,
          },
        },
        awayTeam: {
          columns: {
            abbreviation: true,
          },
        },
      },
    });
    const linesURL = `${ODDS_API_BASE_URL}/${AMERICAN_FOOTBALL_LABEL}/events/${matchup?.oddsApiEventId}/odds?apiKey=${process.env.ODDS_API_KEY}&regions=us&markets=${AMERICAN_FOOTBALL_MARKETS.join(',').replace('[', '').replace(']', '')}&bookmakers=draftkings`;

    const linesResponse: NFLBettingData = await fetch(linesURL).then((res) =>
      res.json(),
    );
    if (!linesResponse) {
      console.warn('No lines found for matchup: ', matchupId);
      return [];
    }
    const allAthletes = await this.db.query.athletes.findMany({
      where: or(
        eq(athletes.teamId, matchup?.homeTeamId!),
        eq(athletes.teamId, matchup?.awayTeamId!),
      ),
    });

    const allStats = await this.statsService.getAllStats();

    const formattedLines: CreateLineDto[] = [];
    const linesForCRONlogger: LinesCreationSuccessOutput[] = [];
    if (!linesResponse?.bookmakers[0]?.markets) {
      console.warn('No bookmakers found for matchup: ', matchupId);
      return [];
    }

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

        const possibleExistingLine = await this.db.query.lines.findFirst({
          where: and(
            eq(lines.athleteId, athleteId),
            eq(lines.statId, statId),
            eq(lines.matchupId, matchup?.id!),
            eq(lines.status, LineStatus.OPEN),
          ),
        });
        if (possibleExistingLine) {
          console.warn(
            `Line already exists for ${matchup?.espnEventId} ${athleteId} ${statId}`,
          );
          continue;
        }

        formattedLines.push({
          statId: statId,
          athleteId: athleteId,
          matchupId: matchup?.id!,
          predictedValue: outcome.point,
        });

        //returning data for CRON logger
        linesForCRONlogger.push({
          statName: market.key,
          athleteName: outcome.description,
          predictedValue: outcome.point,
          matchupId: matchup?.id!,
          homeTeam: matchup?.homeTeam?.abbreviation!,
          awayTeam: matchup?.awayTeam?.abbreviation!,
        });
      }
    }

    // Chunk lines into groups of 5
    const CHUNK_SIZE = 5;
    const chunks: CreateLineDto[][] = [];
    for (let i = 0; i < formattedLines.length; i += CHUNK_SIZE) {
      chunks.push(formattedLines.slice(i, i + CHUNK_SIZE));
    }

    try {
      // Process each chunk sequentially with 500ms delay between chunks
      for (let i = 0; i < chunks.length; i++) {
        if (i > 0) {
          await sleep(500);
        }
        await this.linesService.bulkCreateLines(chunks[i], user);
        await this.db
          .update(matchups)
          .set({ ifLinesCreated: true })
          .where(eq(matchups.id, matchupId));
      }
      console.log('Lines created successfully');
      return linesForCRONlogger;
    } catch (error) {
      console.error('Error creating lines:', error);
      return [];
    }

  }

  async resolveLinesForMatchup(dto: ResolveLinesDto, user: User) {
    // const matchupsToResolve = await this.getMatchupsInProgress();
    const matchup = await this.db.query.matchups.findFirst({
      where: eq(matchups.id, dto.matchupId),
    });
    if (!matchup) throw new NotFoundException('Matchup not found');
    const matchupsToResolve = [matchup];
    const allStats = await this.statsService.getAllStats();
    const allLinesToResolve: (ResolveLineDto & {
      athleteName: string;
      statName: string;
    })[] = [];
    for (const matchup of matchupsToResolve) {
      const { homeTeamId, awayTeamId } = matchup;
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

      const allLinesInThisMatchup = await this.linesService.getLinesByMatchupId(
        matchup.id,
      );
      const allAthletesInThisMatchupWithLines =
        await this.db.query.athletes.findMany({
          where: and(
            or(
              eq(athletes.teamId, homeTeamId!),
              eq(athletes.teamId, awayTeamId!),
            ),
            inArray(
              athletes.id,
              allLinesInThisMatchup.map((line) => line.athleteId ?? ''),
            ),
          ),
        });
      const matchupBoxScore: ProcessedData = await fetchESPNBoxscoreData(
        matchup.espnEventId,
      );

      for (const athlete of allAthletesInThisMatchupWithLines) {
        const athleteName = athlete.name;
        const allLinesForThisAthlete = allLinesInThisMatchup.filter(
          (line) => line.athleteId === athlete.id,
        );
        const outcomePerAthlete = matchupBoxScore.athletes.find(
          (athlete) => athlete.name === athleteName,
        );
        if (!outcomePerAthlete) {
          continue;
        }
        for (const lineData of allLinesForThisAthlete) {
          const stat = lineData.stat;
          if (!stat) {
            continue;
          }
          const actualValue = outcomePerAthlete.lines[stat.statOddsName!];
          try {
            allLinesToResolve.push({
              lineId: lineData.id,
              actualValue: Number(actualValue) || 0.0,
              athleteName: athlete.name!,
              statName: stat.name!,
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
    const chunks: (ResolveLineDto & {
      athleteName: string;
      statName: string;
    })[][] = [];
    for (let i = 0; i < allLinesToResolve.length; i += CHUNK_SIZE) {
      chunks.push(allLinesToResolve.slice(i, i + CHUNK_SIZE));
    }

    // Process each chunk sequentially with 500ms delay between chunks
    for (let i = 0; i < chunks.length; i++) {
      if (i > 0) {
        await sleep(500);
      }
      await this.linesService.bulkResolveLines(chunks[i], user);
    }

    return { message: 'Lines Resolved Successfully.' };
  }
}
