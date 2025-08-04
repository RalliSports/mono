import { Injectable, NotFoundException } from '@nestjs/common';
import { Drizzle } from 'src/database/database.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Database } from 'src/database/database.provider';
import { eq } from 'drizzle-orm';
import { athletes } from '@repo/db';

@Injectable()
export class AthletesService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {}

  async getAllAthletes() {
    return this.db.query.athletes.findMany();
  }

  async getAthlete(id: string) {
    const athlete = await this.db.query.athletes.findFirst({
      where: eq(athletes.id, id),
    });

    if (!athlete) throw new NotFoundException('Athlete not found');
    return athlete;
  }
}
