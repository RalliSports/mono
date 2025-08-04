import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Database } from 'src/database/database.provider';
import { Drizzle } from 'src/database/database.decorator';
import { and, eq } from 'drizzle-orm';
import { game_access } from '@repo/db';
import { CreateGameAccessDto } from './dto/create-game-access.dto';
import { UpdateGameAccessDto } from './dto/update-game-access.dto';

@Injectable()
export class GameAccessService {
  constructor(@Drizzle() private readonly db: Database) {}

  async create(dto: CreateGameAccessDto) {
    const [existing] = await this.db
      .select()
      .from(game_access)
      .where(eq(game_access.gameId, dto.gameId));

    if (existing) {
      throw new BadRequestException('Access record already exists');
    }

    const [record] = await this.db.insert(game_access).values(dto).returning();
    return record;
  }

  async ViewGameAccessList(gameId: string) {
    return this.db
      .select()
      .from(game_access)
      .where(eq(game_access.gameId, gameId));
  }

  async checkAccess(gameId: string, userId: string) {
    const [access] = await this.db
      .select()
      .from(game_access)
      .where(
        and(eq(game_access.gameId, gameId), eq(game_access.userId, userId)),
      );

    if (!access) throw new NotFoundException('Access not found');
    return access;
  }

  async update(id: string, dto: UpdateGameAccessDto) {
    const [updated] = await this.db
      .update(game_access)
      .set(dto)
      .where(eq(game_access.id, id))
      .returning();

    if (!updated) throw new NotFoundException('Access record not found');
    return updated;
  }

  async remove(gameId: string, userId: string) {
    const [deleted] = await this.db
      .delete(game_access)
      .where(
        and(eq(game_access.gameId, gameId), eq(game_access.userId, userId)),
      )
      .returning();

    if (!deleted) throw new NotFoundException('Access not found');
    return deleted;
  }
}
