/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { athletes, lines, matchups, stats } from '@repo/db';
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
import { LineStatus } from './enum/lines';

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
    return await this.db.transaction(async (tx) => {
      const matchup = await tx.query.matchups.findFirst({
        where: eq(matchups.id, dto.matchupId),
      });
      if (!matchup) throw new BadRequestException('Matchup not found');

      const [inserted] = await tx
        .insert(lines)
        .values({
          status: LineStatus.OPEN,
          athleteId: dto.athleteId,
          statId: dto.statId,
          matchupId: dto.matchupId,
          predictedValue: dto.predictedValue.toString(),
          actualValue: null,
          isHigher: null,
          startsAt: matchup.startsAt,
        })
        .returning();

      // Ensure createGameInstruction throws if it fails
      let txn: string;
      const createdAt = inserted.createdAt;
      if (!createdAt) throw new BadRequestException('Line not created');
      const timestamp = new Date(createdAt).getTime();
      const statCustomId = await tx.query.stats
        .findFirst({
          where: eq(stats.id, dto.statId),
        })
        .then((stat) => stat?.customId);

      const athleteCustomId = await tx.query.athletes
        .findFirst({
          where: eq(athletes.id, dto.athleteId),
        })
        .then((athlete) => athlete?.customId);

      if (!statCustomId) throw new BadRequestException('Stat not found');
      if (!athleteCustomId) throw new BadRequestException('Athlete not found');

      console.log('matchup.startsAt', matchup);
      const adjustedTimestamp =
        new Date(matchup.startsAt ?? '').getTime() / 1000;
      console.log('adjustedTimestamp', adjustedTimestamp);

      try {
        txn = await this.anchor.createLineInstruction(
          timestamp,
          statCustomId,
          dto.predictedValue,
          athleteCustomId,
          adjustedTimestamp,
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
    });
  }

  async getAllLines() {
    const lines = await this.db.query.lines.findMany({
      with: {
        stat: true,
        matchup: {
          with: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        athlete: {
          with: {
            team: true,
          },
        },
      },
    });
    return lines;
  }

  async getLineById(id: string) {
    return this.db.query.lines.findFirst({
      where: eq(lines.id, id),
      with: {
        stat: true,
        matchup: true,
        athlete: true,
      },
    });
  }

  async updateLine(id: string, dto: UpdateLineDto) {
    const res = await this.db
      .update(lines)
      .set({
        athleteId: dto.athleteId?.toString(),
        statId: dto.statId?.toString(),
        matchupId: dto.matchupId?.toString(),
        predictedValue: dto.predictedValue?.toString(),
        status: dto.status,
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
    return await this.db.transaction(async (tx) => {
      console.log('resolveLine', id, dto, user);
      const line = await this.getLineById(id);
      if (!line) throw new NotFoundException(`Line ${id} not found`);
      // if (line.actualValue)
      //   throw new BadRequestException(`Line ${id} already resolved`);
      if (!line.predictedValue)
        throw new BadRequestException(`Line ${id} not predicted`);
      const predictedValue = Number(line.predictedValue);

      const res = await tx
        .update(lines)
        .set({
          actualValue: dto.actualValue?.toString(),
          isHigher:
            dto.actualValue && line.predictedValue
              ? dto.actualValue > Number(line.predictedValue)
              : null,
          status: LineStatus.RESOLVED,
        })
        .where(eq(lines.id, id))
        .returning();
      if (res.length === 0) throw new NotFoundException(`Line ${id} not found`);
      const lineCreatedAt = line.createdAt;
      if (!lineCreatedAt) throw new BadRequestException('Line not created');
      const lineCreatedAtTimestamp = new Date(lineCreatedAt).getTime();

      // Ensure resolveLineInstruction throws if it fails
      let txn: string;

      try {
        txn = await this.anchor.resolveLineInstruction(
          lineCreatedAtTimestamp,
          predictedValue,
          dto.actualValue!,
          false,
          new PublicKey(user.walletAddress),
        );

        if (!txn || typeof txn !== 'string') {
          throw new Error(
            'Invalid transaction ID returned from resolveLineInstruction',
          );
        }
      } catch (error) {
        console.error(
          'Anchor instruction failed, rolling back transaction:',
          error,
        );
        // Throw to rollback DB transaction
        throw new BadRequestException(
          "'Anchor instruction failed, rolling back resolve game",
          error,
        );
      }
      return res[0];
    });
  }
}
