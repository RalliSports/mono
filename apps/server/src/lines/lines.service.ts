/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { athletes, lines, matchups, stats } from '@repo/db';
import { and, eq, inArray } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Database } from 'src/database/database.provider';
import { CreateLineDto } from './dto/create-line.dto';
import { ResolveLineDto } from './dto/resolve-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { PublicKey } from '@solana/web3.js';
import { User } from 'src/user/dto/user-response.dto';
import { LineStatus } from './enum/lines';
import { ParaAnchor } from 'src/utils/services/paraAnchor';
import { UserAutoLinesDto } from 'src/user/dto/user-auto-lines.dto';

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
          oddsOver: dto.oddsOver.toString(),
          oddsUnder: dto.oddsUnder.toString(),
          actualValue: null,
          isHigher: null,
          startsAt: matchup.startsAt,
        })
        .returning();

      // Ensure createLineInstruction throws if it fails
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

      const adjustedTimestamp =
        new Date(matchup.startsAt ?? '').getTime() / 1000;

      try {
        txn = await this.anchor.createLineInstruction(
          timestamp,
          statCustomId,
          dto.predictedValue,
          athleteCustomId,
          adjustedTimestamp,
          new PublicKey(user.walletAddress),
        );
        await this.db
          .update(lines)
          .set({
            createdTxnSignature: txn,
          })
          .where(eq(lines.id, inserted.id));

        if (!txn || typeof txn !== 'string') {
          throw new Error(
            'Invalid transaction ID returned from createLineInstruction',
          );
        }
      } catch (error) {
        console.error(
          'Anchor instruction failed, rolling back transaction:',
          error,
        );
        // Throw to rollback DB transaction
        throw new BadRequestException(
          "'Anchor instruction failed, rolling back line creation",
          error,
        );
      }
      return inserted;
    });
  }

  async bulkCreateLines(dto: CreateLineDto[], user: UserAutoLinesDto) {
    return await this.db.transaction(async (tx) => {
      let txn: string;

      const linesInformation: {
        timestamp: number;
        statCustomId: number;
        athleteCustomId: number;
        adjustedTimestamp: number;
        predictedValue: number;
        oddsOver: number;
        oddsUnder: number;
      }[] = [];
      const insertedLines = [] as (typeof lines.$inferInsert)[];
      const initialTimestamp = new Date().getTime();
      for (const [index, line] of dto.entries()) {
        const matchup = await tx.query.matchups.findFirst({
          where: eq(matchups.id, line.matchupId),
        });
        if (!matchup) throw new BadRequestException('Matchup not found');

        const [inserted] = await tx
          .insert(lines)
          .values({
            status: LineStatus.OPEN,
            athleteId: line.athleteId,
            statId: line.statId,
            matchupId: line.matchupId,
            predictedValue: line.predictedValue.toString(),
            oddsOver: line.oddsOver.toString(),
            oddsUnder: line.oddsUnder.toString(),
            actualValue: null,
            isHigher: null,
            startsAt: matchup.startsAt,
            createdAt: new Date(initialTimestamp + index),
          })
          .returning();

        // Ensure createGameInstruction throws if it fails
        const createdAt = inserted.createdAt;
        if (!createdAt) throw new BadRequestException('Line not created');
        const timestamp = new Date(createdAt).getTime();
        const statCustomId = await tx.query.stats
          .findFirst({
            where: eq(stats.id, line.statId),
          })
          .then((stat) => stat?.customId);

        const athleteCustomId = await tx.query.athletes
          .findFirst({
            where: eq(athletes.id, line.athleteId),
          })
          .then((athlete) => athlete?.customId);

        if (!statCustomId) throw new BadRequestException('Stat not found');
        if (!athleteCustomId)
          throw new BadRequestException('Athlete not found');

        const adjustedTimestamp =
          new Date(matchup.startsAt ?? '').getTime() / 1000;

        linesInformation.push({
          timestamp,
          statCustomId,
          athleteCustomId,
          adjustedTimestamp,
          predictedValue: line.predictedValue,
          oddsOver: line.oddsOver,
          oddsUnder: line.oddsUnder,
        });
        insertedLines.push(inserted);
      }
      try {
        txn = await this.anchor.bulkCreateLineInstruction(
          linesInformation,
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
        await tx.rollback();
        // Throw to rollback DB transaction
        throw new BadRequestException(
          "'Anchor instruction failed, rolling back lines creation",
          error,
        );
      }
      return insertedLines;
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
        stat: {
          columns: {
            id: true,
            customId: true,
            name: true,
            statOddsName: true,
          },
        },
        matchup: {
          columns: {
            id: true,
            espnEventId: true,
          },
          with: {
            homeTeam: {
              columns: {
                id: true,
                name: true,
                espnTeamId: true,
              },
            },
            awayTeam: {
              columns: {
                id: true,
                name: true,
                espnTeamId: true,
              },
            },
          },
        },
        athlete: {
          columns: {
            id: true,
            name: true,
            espnAthleteId: true,
          },
        },
      },
    });
  }

  async getLinesByMatchupId(matchupId: string) {
    return await this.db.query.lines.findMany({
      where: and(eq(lines.matchupId, matchupId)),
      with: {
        athlete: {
          columns: {
            name: true,
          },
        },
        stat: {
          columns: {
            name: true,
            statOddsName: true,
          },
        },
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
        currentValue: dto.currentValue?.toString(),
        lastUpdatedAt: dto.lastUpdatedAt,
        isLatestOne: dto.isLatestOne,
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

  async resolveLine(id: string, dto: ResolveLineDto, user: UserAutoLinesDto) {
    return await this.db.transaction(async (tx) => {
      const line = await this.getLineById(id);
      if (!line) throw new NotFoundException(`Line ${id} not found`);
      if (!line.predictedValue)
        throw new BadRequestException(`Line ${id} not predicted`);
      const predictedValue = Number(line.predictedValue);
      const res = await tx
        .update(lines)
        .set({
          actualValue: dto.actualValue?.toString(),
          isHigher:
            (dto.actualValue || dto.actualValue === 0) && line.predictedValue
              ? dto.actualValue > predictedValue
              : null,
          status: LineStatus.RESOLVED,
          resolvedAt: new Date(),
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

  async bulkResolveLines(
    dto: (ResolveLineDto & { athleteName: string; statName: string })[],
    user: UserAutoLinesDto,
  ) {
    // First, try the bulk transaction approach
    try {
      return await this.db.transaction(async (tx) => {
        const linesInformation: {
          lineId: number;
          predictedValue: number;
          actualValue: number;
          shouldRefundBettors: boolean;
        }[] = [];

        for (const lineDataForResole of dto) {
          const lineData = await tx.query.lines.findFirst({
            where: eq(lines.id, lineDataForResole.lineId),
          });

          // Check if line exists and is not resolved
          if (!lineData) {
            console.warn(
              `Line not found for ${lineDataForResole.lineId}, athlete: ${lineDataForResole.athleteName}, stat: ${lineDataForResole.statName}`,
            );
            continue;
          }
          if (lineData.actualValue) {
            console.warn(
              `Line already resolved for ${lineDataForResole.lineId} ${lineDataForResole.athleteName} ${lineDataForResole.statName}`,
            );
            continue;
          }
          if (!lineData.predictedValue) {
            console.warn(
              `Line not predicted for ${lineDataForResole.lineId} ${lineDataForResole.athleteName} ${lineDataForResole.statName}`,
            );
            continue;
          }
          if (
            lineDataForResole.actualValue === null ||
            lineDataForResole.actualValue === undefined
          ) {
            console.warn(
              `Actual value not provided for ${lineDataForResole.lineId} ${lineDataForResole.athleteName} ${lineDataForResole.statName}`,
            );
            continue;
          }
          const lineCreatedAt = lineData.createdAt;
          if (!lineCreatedAt) {
            console.warn(
              `Line not created for ${lineDataForResole.lineId} ${lineDataForResole.athleteName} ${lineDataForResole.statName}`,
            );
            continue;
          }
          const lineCreatedAtTimestamp = new Date(lineCreatedAt).getTime();
          // Update line to mark as resolved
          await tx
            .update(lines)
            .set({
              actualValue: lineDataForResole.actualValue.toString(),
              isHigher:
                (lineDataForResole.actualValue || lineDataForResole.actualValue === 0) && lineData.predictedValue
                  ? lineDataForResole.actualValue >
                  Number(lineData.predictedValue)
                  : null,
              status: LineStatus.RESOLVED,
              resolvedAt: new Date(),
            })
            .where(eq(lines.id, lineDataForResole.lineId));

          linesInformation.push({
            lineId: lineCreatedAtTimestamp,
            predictedValue: Number(lineData.predictedValue),
            actualValue: lineDataForResole.actualValue,
            shouldRefundBettors: false,
          });
        }

        const { success, txSig, error } =
          await this.anchor.bulkResolveLineInstruction(
            linesInformation,
            new PublicKey(user.walletAddress),
          );

        if (!success || typeof txSig !== 'string') {
          if (error?.includes('LineAlreadyResolved')) {
            console.warn('Line already resolved');
            return { success: true };
          }
          throw new Error(
            'Invalid transaction ID returned from bulkResolveLineInstruction',
          );
        }

        return { success: true };
      });
    } catch (bulkError) {
      console.error(
        'Bulk resolve failed, falling back to individual resolution:',
        bulkError,
      );

      // Fallback: resolve each line individually
      const results = {
        successful: [] as string[],
        failed: [] as string[],
      };

      for (const lineDataForResole of dto) {
        try {
          await this.resolveLine(
            lineDataForResole.lineId,
            lineDataForResole,
            user,
          );
          results.successful.push(lineDataForResole.lineId);
          console.log(`✓ Resolved line ${lineDataForResole.lineId}`);
        } catch (error) {
          results.failed.push(lineDataForResole.lineId);
          console.error(
            `✗ Failed to resolve line ${lineDataForResole.lineId}:`,
            error.message,
          );
        }
      }

      console.log(
        `Bulk resolve fallback complete: ${results.successful.length} succeeded, ${results.failed.length} failed`,
      );

      return {
        success: results.successful.length > 0,
        message: `Resolved ${results.successful.length}/${dto.length} lines individually`,
        ...results,
      };
    }
  }

  async cancelDuplicateActiveLines() {
    const allActiveLines = await this.db.query.lines.findMany({
      where: and(
        eq(lines.status, LineStatus.OPEN),
        eq(lines.isLatestOne, true),
      ),
      columns: {
        id: true,
        athleteId: true,
        statId: true,
        matchupId: true,
        predictedValue: true,
        createdAt: true,
      },
      orderBy(fields, operators) {
        return [operators.desc(fields.createdAt)];
      },
    });
    let uniqueActiveLinesRecord: Record<string, string> = {};
    let toBeCancelledLines: string[] = [];
    for (const line of allActiveLines) {
      const lineKey = `${line.athleteId}-${line.statId}-${line.matchupId}-${line.predictedValue}`;
      if (uniqueActiveLinesRecord[lineKey]) {
        toBeCancelledLines.push(line.id);
      } else {
        uniqueActiveLinesRecord[lineKey] = line.id;
      }
    }
    if (toBeCancelledLines.length > 0) {
      try {
        await this.db
          .update(lines)
          .set({ isLatestOne: false })
          .where(inArray(lines.id, toBeCancelledLines));
        console.log(`Cancelled ${toBeCancelledLines.length} duplicate lines`);
      } catch (error) {
        console.error('Error cancelling duplicate lines:', error);
        return { cancelledCount: 0, message: 'Error cancelling duplicate lines', success: false };
      }
    };
    return { cancelledCount: toBeCancelledLines.length, message: 'Duplicate lines cancelled', success: true };
  }
}
