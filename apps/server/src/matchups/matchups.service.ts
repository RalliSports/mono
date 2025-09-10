import { Injectable, NotFoundException } from '@nestjs/common';
import { matchups, stats } from '@repo/db';
import { and, eq, gt, lt } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { CreateMatchupDto } from './dto/create-matchup.dto';
import { UpdateMatchupDto } from './dto/update-matchup.dto';
import { MatchupStatus } from './enum/matchups';

@Injectable()
export class MatchupsService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
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
}
