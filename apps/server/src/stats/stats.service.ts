import { Injectable, NotFoundException } from '@nestjs/common';
import { stats } from '@repo/db';
import { eq } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';

@Injectable()
export class StatsService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {}

  async getAllStats() {
    return this.db.query.stats.findMany();
  }
  async getStatById(id: number) {
    const stat = await this.db.query.stats.findFirst({
      where: eq(stats.customId, id),
    });

    if (!stat) throw new NotFoundException('Stat not found');
    return stat;
  }
}
