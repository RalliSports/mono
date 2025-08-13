import { Injectable, NotFoundException } from '@nestjs/common';
import { Drizzle } from 'src/database/database.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Database } from 'src/database/database.provider';
import { eq, isNull } from 'drizzle-orm';
import { athletes } from '@repo/db';
import { CreateAthleteDto } from './dto/create-athlete.dto';

@Injectable()
export class AthletesService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {}

  async getAllAthletes() {
    return this.db.query.athletes.findMany();
  }

  async getActiveAthletesWithUnresolvedLines() {
    const athletes = await this.db.query.athletes.findMany({
      with: {
        lines: {
          with: {
            stat: {
              columns: {
                id: true,
                name: true,
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
                  },
                },
                awayTeam: {
                  columns: {
                    id: true,
                  },
                },
              },
            },
          },
          where: (lines) => isNull(lines.actualValue),
          columns: {
            id: true,
            predictedValue: true,
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
