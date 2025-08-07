/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { lines, matchups, stats } from '@repo/db';
import { eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Database } from 'src/database/database.provider';
import { CreateLineDto } from './dto/create-line.dto';
import { ResolveLineDto } from './dto/resolve-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { PublicKey } from '@solana/web3.js';
import { ParaAnchor } from 'src/utils/services/paraAnchor';
import { User } from 'src/user/dto/user-response.dto';

@Injectable()
export class LinesService {
  private anchor: ParaAnchor;

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {
    this.anchor = new ParaAnchor(this.authService.getPara());
  }

  async createLine(dto: CreateLineDto, user: User) {
    const [inserted] = await this.db
      .insert(lines)
      .values({
        athleteId: dto.athleteId,
        statId: dto.statId,
        matchupId: dto.matchupId,
        predictedValue: dto.predictedValue.toString(),
        actualValue: null,
        isHigher: null,
      })
      .returning();

    // Ensure createGameInstruction throws if it fails
    let txn: string;
    const createdAt = inserted.createdAt;
    if (!createdAt) throw new BadRequestException('Line not created');
    const timestamp = new Date(createdAt).getTime() / 1000;
    const statCustomId = await this.db.query.stats.findFirst({
      where: eq(stats.id, dto.statId),
    }).then((stat) => stat?.customId);

    if (!statCustomId) throw new BadRequestException('Stat not found');

    try {
      txn = await this.anchor.createLineInstruction(
        timestamp,
        statCustomId,
        dto.predictedValue,
        12,
        (Date.now() + 30000) / 1000,
        new PublicKey(user.walletAddress),
      );

      if (!txn || typeof txn !== 'string') {
        throw new Error(
          'Invalid transaction ID returned from createGameInstruction',
        );
      }
    } catch (error) {
      console.error(
        'Anchor instruction failed, rolling back transaction:',
        error,
      );
      // Throw to rollback DB transaction
      throw new BadRequestException(
        "'Anchor instruction failed, rolling back game creation",
        error,
      );
    }
    return inserted;
  }

  async getAllLines() {
    return this.db.query.lines.findMany({
      with: {
        stat: true,
        matchup: true,
        athlete: true,
      }
    });
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
        statId: String(dto.statId),
        matchupId: dto.matchupId,
        predictedValue: dto.predictedValue?.toString(),
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

  async resolveLine(id: string, dto: ResolveLineDto, user: User) {
    const line = await this.getLineById(id);
    if (!line) throw new NotFoundException(`Line ${id} not found`);
    if (line.actualValue)
      throw new BadRequestException(`Line ${id} already resolved`);
    if (!line.predictedValue)
      throw new BadRequestException(`Line ${id} not predicted`);
    const predictedValue = Number(line.predictedValue);

    const res = await this.db
      .update(lines)
      .set({
        actualValue: dto.actualValue?.toString(),
        isHigher:
          dto.actualValue && line.predictedValue
            ? dto.actualValue > Number(line.predictedValue)
            : null,
      })
      .where(eq(lines.id, id))
      .returning();
    if (res.length === 0) throw new NotFoundException(`Line ${id} not found`);

    // Ensure createGameInstruction throws if it fails
    let txn: string;

    try {
      txn = await this.anchor.resolveLineInstruction(
        3,
        predictedValue,
        dto.actualValue!,
        false,
        new PublicKey(user.walletAddress),
      );

      if (!txn || typeof txn !== 'string') {
        throw new Error(
          'Invalid transaction ID returned from createGameInstruction',
        );
      }
    } catch (error) {
      console.error(
        'Anchor instruction failed, rolling back transaction:',
        error,
      );
      // Throw to rollback DB transaction
      throw new BadRequestException(
        "'Anchor instruction failed, rolling back game creation",
        error,
      );
    }
    return res[0];
  }
}
