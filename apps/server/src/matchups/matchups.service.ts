import { Injectable, NotFoundException } from '@nestjs/common';
import { matchups, stats } from '@repo/db';
import { eq } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { CreateMatchupDto } from './dto/create-matchup.dto';

@Injectable()
export class MatchupsService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {}

  async getAllMatchups() {
    return this.db.query.matchups.findMany();
  }
  async getMatchupById(id: string) {
    const matchup = await this.db.query.matchups.findFirst({
      where: eq(matchups.id, id),
    });

    if (!matchup) throw new NotFoundException('Matchup not found');
    return matchup;
  }

  async createMatchup(dto: CreateMatchupDto) {
    const matchup = await this.db
      .insert(matchups)
      .values({
        homeTeamId: dto.homeTeamId,
        awayTeamId: dto.awayTeamId,
        startsAt: new Date(dto.startsAtTimestamp),
        gameDate: new Date(dto.startsAtTimestamp).toISOString(),
        status: 'pending',
        scoreHome: 0,
        scoreAway: 0,
      })
      .returning();
    return matchup;
  }
}
