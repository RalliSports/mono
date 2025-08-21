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

  async getMatchupsThatShouldHaveStarted() {
    const now = new Date();
    // console.log('now', now);

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

  async getMatchupById(id: string) {
    const matchup = await this.db.query.matchups.findFirst({
      where: eq(matchups.id, id),
    });

    if (!matchup) throw new NotFoundException('Matchup not found');
    return matchup;
  }

  async updateMatchup(id: string, dto: UpdateMatchupDto) {
    const updateData: Partial<{
      espnEventId: string;
      homeTeamId: string;
      awayTeamId: string;
      startsAt: Date;
      gameDate: string;
      status: MatchupStatus;
      scoreHome: number;
      scoreAway: number;
    }> = {
      espnEventId: dto.espnEventId,
      homeTeamId: dto.homeTeamId,
      awayTeamId: dto.awayTeamId,
      status: dto.status,
      scoreHome: dto.scoreHome,
      scoreAway: dto.scoreAway,
    };

    // Only update `startsAt` and `gameDate` if matchup is ReSCHEDULED
    if (
      dto.startsAtTimestamp !== undefined &&
      dto.startsAtTimestamp !== null &&
      dto.status === MatchupStatus.SCHEDULED
    ) {
      updateData.startsAt = new Date(dto.startsAtTimestamp);
      updateData.gameDate = new Date(dto.startsAtTimestamp).toISOString();
    }

    const matchup = await this.db
      .update(matchups)
      .set(updateData)
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
