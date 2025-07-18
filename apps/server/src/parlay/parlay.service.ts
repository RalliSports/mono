import { BadRequestException, Injectable } from '@nestjs/common';
import { leg, parlayTable, parlayEntryTable } from '@repo/db';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Drizzle } from 'src/database/database.decorator';
import { CreatePoolDto } from './dto/create-parlay.dto';
import { JoinPoolDto } from './dto/join-parlay.dto';
import { AuthService } from 'src/auth/auth.service';
import { WebSocketGatewayService } from 'src/websocket/websocket.gateway';

@Injectable()
export class ParlayService {
  constructor(
    @Drizzle() private readonly db: NodePgDatabase,
    private readonly authService: AuthService,
    private readonly wsGateway: WebSocketGatewayService
  ) {}

  async create(dto: CreatePoolDto) {
    const para = await this.authService.getPara()
    const [pool] = await this.db
      .insert(parlayTable)
      .values({
        entryAmount: dto.entryAmount,
        status: 'open',
        createdBy: para.getUserId() ?? "",
      })
      .returning();
    return pool;
  }

  async joinPool(dto: JoinPoolDto) {
    const { poolId, userId, legs } = dto;

    const seen = new Set();
    for (const leg of legs) {
      if (seen.has(leg.playerId)) {
        throw new BadRequestException('Stat stacking not allowed.');
      }
      seen.add(leg.playerId);
    }

    const [entry] = await this.db
      .insert(parlayEntryTable)
      .values({
        userId,
        poolId,
      })
      .returning();

    await this.db.insert(leg).values(
      legs.map((leg) => ({
        entryId: entry.id,
        playerId: leg.playerId,
        statType: leg.statType,
        line: String(leg.line),
        betType: leg.betType,
      })),
    );

    return { success: true, entryId: entry.id };
  }

  async getAllPools() {
    return await this.db.select().from(parlayTable);
  }
}
