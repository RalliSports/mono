import { Injectable, NotFoundException } from '@nestjs/common';
import { lines } from '@repo/db/';
import { eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Database } from 'src/database/database.provider';
import { CreateLineDto } from './dto/create-line.dto';
import { ResolveLineDto } from './dto/resolve-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';

@Injectable()
export class LinesService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {}

  async createLine(dto: CreateLineDto) {
    const [inserted] = await this.db
      .insert(lines)
      .values({
        athleteId: dto.athleteId,
        statId: dto.statId,
        matchupId: dto.matchupId,
        predictedValue: dto.predictedValue.toString(),
        actualValue: dto.actualValue?.toString() ?? null,
        isHigher: dto.isHigher ?? null,
      })
      .returning();
    return inserted;
  }

  async getAllLines() {
    return this.db.query.lines.findMany();
  }

  async getLineById(id: string) {
    return this.db.query.lines.findFirst({
      where: eq(lines.id, id),
    });
  }

  async updateLine(id: string, dto: UpdateLineDto) {
    const res = await this.db
      .update(lines)
      .set({
        athleteId: dto.athleteId,
        statId: dto.statId,
        matchupId: dto.matchupId,
        predictedValue: dto.predictedValue?.toString(),
        actualValue: dto.actualValue?.toString() ?? null,
        isHigher: dto.isHigher ?? null,
      })
      .where(eq(lines.id, id))
      .returning();
    if (res.length === 0) throw new NotFoundException(`Line ${id} not found`);
    return res[0];
  }

  async deleteLine(id: string) {
    const res = await this.db.delete(lines).where(eq(lines.id, id)).returning();
    if (res.length === 0) throw new NotFoundException(`Line ${id} not found`);
    return { success: true };
  }

  async resolveLine(id: string, dto: ResolveLineDto) {
    // Update actualValue, isHigher, and possibly predictedValue if included
    const res = await this.db
      .update(lines)
      .set({
        actualValue: dto.actualValue?.toString(),
        isHigher: dto.isHigher,
        // optional update predictedValue if passed
        ...(dto.predictedValue !== undefined && {
          predictedValue: dto.predictedValue.toString(),
        }),
      })
      .where(eq(lines.id, id))
      .returning();
    if (res.length === 0) throw new NotFoundException(`Line ${id} not found`);
    return res[0];
  }
}
