import { Injectable, NotFoundException } from '@nestjs/common';
import { Drizzle } from 'src/database/database.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Database } from 'src/database/database.provider';
import { and, eq, isNull } from 'drizzle-orm';
import { athletes } from '@repo/db';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { LineStatus } from 'src/lines/enum/lines';

@Injectable()
export class AthletesService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) { }

  async getAllAthletes() {
    return this.db.query.athletes.findMany({
      with: {
        team: {
          columns: {
            name: true,
          },
        },
      },
    });
  }

  async getActiveAthletesWithUnresolvedLines() {
    const athletes = await this.db.query.athletes.findMany({
      with: {
        team: true,
        lines: {
          with: {
            stat: {
              columns: {
                id: true,
                name: true,
                displayName: true,
              },
            },
            matchup: {
              columns: {
                id: true,
                gameDate: true,
              },
              with: {
                homeTeam: {
                  columns: {
                    id: true,
                    name: true,
                    city: true,
                    avatar: true,
                    abbreviation: true,
                  },
                },
                awayTeam: {
                  columns: {
                    id: true,

                    name: true,
                    city: true,
                    avatar: true,
                    abbreviation: true,
                  },
                },
              },
            },
          },
          where: (lines) => and(
            eq(lines.status, LineStatus.OPEN),
            eq(lines.isLatestOne, true),
          ),
          columns: {
            id: true,
            predictedValue: true,
            oddsOver: true,
            oddsUnder: true,
          },
        },
      },
    });
    const filteredAthletes = athletes.filter(
      (athlete) => athlete.lines.length > 0,
    );
    return filteredAthletes;
  }

  async createAthlete(dto: CreateAthleteDto) {
    const [inserted] = await this.db
      .insert(athletes)
      .values({
        espnAthleteId: dto.espnAthleteId,
        name: dto.name,
        teamId: dto.teamId,
        position: dto.position,
        jerseyNumber: dto.jerseyNumber,
        age: dto.age,
        picture: dto.picture || null,
      })
      .returning();

    return inserted;
  }

  async getAthlete(id: string) {
    const athlete = await this.db.query.athletes.findFirst({
      where: eq(athletes.id, id),
    });

    if (!athlete) throw new NotFoundException('Athlete not found');
    return athlete;
  }
}
