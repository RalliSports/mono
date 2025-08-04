import { Injectable, NotFoundException } from '@nestjs/common';
import { Database } from 'src/database/database.provider';
import { Drizzle } from 'src/database/database.decorator';
import { game_mode } from '@repo/db';
import { eq } from 'drizzle-orm';
import { CreateGameModeDto } from './dto/create-game-mode.dto';
import { UpdateGameModeDto } from './dto/update-game-mode.dto';

@Injectable()
export class GameModeService {
  constructor(@Drizzle() private readonly db: Database) {}

  async create(dto: CreateGameModeDto) {
    const [created] = await this.db.insert(game_mode).values(dto).returning();
    return created;
  }

  async findAll() {
    return this.db.select().from(game_mode);
  }

  async findOne(id: string) {
    const [mode] = await this.db
      .select()
      .from(game_mode)
      .where(eq(game_mode.id, id));

    if (!mode) throw new NotFoundException('Game mode not found');
    return mode;
  }

  async update(id: string, dto: UpdateGameModeDto) {
    const [updated] = await this.db
      .update(game_mode)
      .set(dto)
      .where(eq(game_mode.id, id))
      .returning();

    if (!updated) throw new NotFoundException('Game mode not found');
    return updated;
  }

  async remove(id: string) {
    const [deleted] = await this.db
      .delete(game_mode)
      .where(eq(game_mode.id, id))
      .returning();

    if (!deleted) throw new NotFoundException('Game mode not found');
    return deleted;
  }
}
