import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { generateRandonCode } from 'src/utils/generateRandonCode';
import { game_access, games, participants } from '@repo/db';
import { and, count, eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Database } from 'src/database/database.provider';
import { GameStatus } from './enum/game';

@Injectable()
export class GamesService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const para = await this.authService.getPara();
    const gameCode = await this.generateUniqueGameCode();


    const [game] = await this.db
      .insert(games)
      .values({
        ...createGameDto,
        creatorId: para.getUserId() as string ?? "",
        gameCode,   
        status: GameStatus.WAITING     
      })
      .returning();

    return game;
  }

  async findAll() {
    return this.db.query.games.findMany();
  }

  async findOne(id: string) {
    const game = await this.db.query.games.findFirst({
      where: eq(games.id, id),
      with: {
        gameMode: true,
        participants: true,
      },
    });

    if (!game) throw new NotFoundException('Game not found');
    
    return game;
  }

  async joinGame(gameId: string, gameCode?: string) {
    const para = await this.authService.getPara();
    const userId = para.getUserId() ?? '';

    const game = await this.db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

    if (!game) throw new NotFoundException('Game not found');

    await this.validateGameAccess({ game, userId, providedCode: gameCode });

    const existing = await this.db.query.participants.findFirst({
      where: and(
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    });

    if (existing) {
      throw new ConflictException('User already joined this game');
    }

    const [{ count: currentCount }] = await this.db
      .select({ count: count() })
      .from(participants)
      .where(eq(participants.gameId, gameId));

    if (currentCount >= (game.maxParticipants as number)) {
      throw new BadRequestException('Game is already full');
    }

    if (game.status !== GameStatus.WAITING) {
      throw new BadRequestException('Game is not open for joining');
    }

    await this.db.insert(participants).values({
      gameId,
      userId,
    });

    return { success: true, message: 'Joined game successfully' };
  }

  async findByGameCode(code: string) {
    const game = await this.db.query.games.findFirst({
      where: eq(games.gameCode, code),
    });

    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async findGamesCreateByUser() {
    const para = await this.authService.getPara();

    const result = await this.db.query.games.findMany({
      where: eq(games.creatorId, para.getUserId() ?? ''),
    });

    if (!result.length) throw new NotFoundException('Games not found');
    return result;
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    const [updated] = await this.db
      .update(games)
      .set(updateGameDto)
      .where(eq(games.id, id))
      .returning();

    if (!updated) throw new NotFoundException('Game not found');
    return updated;
  }

  async remove(id: string) {
    const [deleted] = await this.db
      .delete(games)
      .where(eq(games.id, id))
      .returning();

    if (!deleted) throw new NotFoundException('Game not found');
    return deleted;
  }

  async generateUniqueGameCode(): Promise<string> {
    let attempt = 0;
    let code: string;

    do {
      code = generateRandonCode(6); // Generate random 6-character code
      const existing = await this.db.query.games.findFirst({
        where: eq(games.gameCode, code),
      }); // Check DB for conflicts

      if (!existing) break; // If code not found in DB, use it

      attempt++; // If found, try again
    } while (attempt < 10); // Try max 10 times

    if (attempt === 10) {
      throw new Error('Failed to generate unique game code'); // Safety fallback
    }

    return code; // Return the unique code
  }

  async validateGameAccess({
    game,
    userId,
    providedCode,
  }: {
    game: typeof games.$inferSelect;
    userId: string;
    providedCode?: string;
  }) {
    const { isPrivate, userControlType, gameCode, id: gameId } = game;

    if (isPrivate) {
      if (!providedCode || providedCode !== gameCode) {
        throw new ForbiddenException(
          'Private game. Invalid or missing game code.',
        );
      }
    }

    if (userControlType === 'whitelist') {
      const access = await this.db.query.game_access.findFirst({
        where: and(
          eq(game_access.gameId, gameId),
          eq(game_access.userId, userId),
          eq(game_access.status, 'whitelisted'),
        ),
      });
      if (!access) {
        throw new ForbiddenException('You are not whitelisted for this game');
      }
    }

    if (userControlType === 'blacklist') {
      const access = await this.db.query.game_access.findFirst({
        where: and(
          eq(game_access.gameId, gameId),
          eq(game_access.userId, userId),
          eq(game_access.status, 'blacklisted'),
        ),
      });
      if (access) {
        throw new ForbiddenException('You are blacklisted from this game');
      }
    }
  }
}
