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
import { UserAutoLinesDto } from 'src/user/dto/user-auto-lines.dto';
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
import { LinesCreationSuccessOutput } from './cron-matchup/types/lines-creation-success-outpot.type';
import { LinesResolveSuccessOutput } from './cron-matchup/types/lines-resolve-success-outpot.type';
import { calculateOddsFromPrice } from './cron-matchup/utils/odds-calculation-from-price';

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

  async createLinesForMatchup(dto: CreateLinesDto, user: UserAutoLinesDto) {
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

    if (!matchup) {
      console.warn('Matchup not found: ', matchupId);
      return [];
    }
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
    if (!linesResponse?.bookmakers?.[0]?.markets) {
      console.warn('No bookmakers found for matchup: ', matchupId);
      return [];
    }
    const marketPredictions = linesResponse.bookmakers[0].markets;
    for (const market of marketPredictions) {
      const predictionOutcomes = market.outcomes;
      const statName = market.key;
      const statId = allStats.find(
        (stat) => stat.oddsApiStatName === statName,
      )?.id;
      if (!statId) {
        console.warn('Stat id not found for: ', statName);
        continue;
      }
      const athletePredictionMap: Record<string, { thresholdValue: number; oddsOverValue: number; oddsUnderValue: number; }> = {};
      for (const outcome of predictionOutcomes) {
        const overOrUnder = outcome.name;
        const athleteName = outcome.description;
        const thresholdVal = outcome.point;
        const oddsVal = outcome.price;
        if (!athletePredictionMap[athleteName]) {
          athletePredictionMap[athleteName] = {
            thresholdValue: thresholdVal,
            oddsOverValue: 0,
            oddsUnderValue: 0,
          };
        }
        if (overOrUnder === 'Over') {
          athletePredictionMap[athleteName].oddsOverValue = calculateOddsFromPrice(oddsVal);
        } else if (overOrUnder === 'Under') {
          athletePredictionMap[athleteName].oddsUnderValue = calculateOddsFromPrice(oddsVal);
        }
      }
      for (const athleteName in athletePredictionMap) {
        const { thresholdValue, oddsOverValue, oddsUnderValue } =
          athletePredictionMap[athleteName];

        const athleteId = allAthletes.find(
          (athlete) => athlete.name === athleteName,
        )?.id;

        if (!athleteId) {
          console.warn(
            `Athlete "${athleteName}" not found for ${matchup?.espnEventId}`,
          );
          continue;
        }

        const possibleExistingLines = await this.db.query.lines.findMany({
          where: and(
            eq(lines.athleteId, athleteId),
            eq(lines.statId, statId),
            eq(lines.matchupId, matchupId),
            eq(lines.isLatestOne, true)
          ),
        });
        let existingLineWithSamePredictedValue = false;
        for (const possibleExistingLine of possibleExistingLines) {
          if (possibleExistingLine && possibleExistingLine.predictedValue === thresholdValue.toString()) {
            console.log(
              `Line already exists with same predicted value for ${matchup?.espnEventId} - ${athleteName} - ${statName} - ${thresholdValue}`,
            );
            existingLineWithSamePredictedValue = true;
            continue;
          } else if (possibleExistingLine) {
            await this.linesService.updateLine(possibleExistingLine.id, {
              isLatestOne: false,
            });
            console.log(
              `Line with old predicted value found for ${matchup?.espnEventId} - ${athleteName} - ${statName} - ${possibleExistingLine.predictedValue}.`,
            );
          }
        }
        if (existingLineWithSamePredictedValue) {
          continue;
        }
        formattedLines.push({
          statId: statId,
          athleteId: athleteId,
          matchupId: matchup?.id!,
          predictedValue: thresholdValue,
          oddsOver: oddsOverValue,
          oddsUnder: oddsUnderValue,
        });

        //returning data for CRON logger
        linesForCRONlogger.push({
          statName: statName,
          athleteName: athleteName,
          predictedValue: thresholdValue,
          oddsOver: oddsOverValue,
          oddsUnder: oddsUnderValue,
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

  async resolveLinesForMatchup(dto: ResolveLinesDto, user: UserAutoLinesDto) {
    const matchup = await this.db.query.matchups.findFirst({
      where: eq(matchups.id, dto.matchupId),
    });
    if (!matchup) {
      console.warn('Matchup not found!');
      return [];
    }
    const matchupsToResolve = [matchup];
    const allLinesToResolve: (ResolveLineDto & {
      athleteName: string;
      statName: string;
    })[] = [];

    //returning data for ResolveCronLogger
    const resolvedLinesData: LinesResolveSuccessOutput[] = [];
    for (const matchup of matchupsToResolve) {
      const matchupId = matchup.id;
      const { homeTeamId, awayTeamId } = matchup;
      if (!matchup.espnEventId) {
        console.warn(`Matchup ${matchupId} missing ESPN event ID`);
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
        console.warn(`Matchup ${matchupId} not final, skipping`);
        continue;
      }

      const allLinesInThisMatchup = await this.linesService.getLinesByMatchupId(
        matchupId,
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
            resolvedLinesData.push({
              statName: stat.name!,
              athleteName: athlete.name!,
              predictedValue: Number(lineData.predictedValue),
              actualValue: Number(actualValue) || 0.0,
              matchupId: matchup.id!,
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

    try {
      // Process each chunk sequentially with 500ms delay between chunks
      for (let i = 0; i < chunks.length; i++) {
        if (i > 0) {
          await sleep(500);
        }
        await this.linesService.bulkResolveLines(chunks[i], user);
      }
      console.log('Lines resolved successfully');
      return resolvedLinesData;
    }
    catch (error) {
      console.error('Error resolving lines:', error);
      return [];
    }
  }
}