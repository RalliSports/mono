import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { game_access, games, participants, predictions } from '@repo/db';
import { PublicKey } from '@solana/web3.js';
import { and, count, eq } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { User } from 'src/user/dto/user-response.dto';
import { generateRandonCode } from 'src/utils/generateRandonCode';
import { ParaAnchor } from 'src/utils/services/paraAnchor';
import { CreateGameDto } from './dto/create-game.dto';
import { BulkCreatePredictionsDto } from './dto/prediction.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameStatus } from './enum/game';


@Injectable()
export class GamesService {
  private anchor: ParaAnchor;

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {
    this.anchor = new ParaAnchor(this.authService.getPara());
  }
  async create(createGameDto: CreateGameDto, user: User) {
    const gameCode = await this.generateUniqueGameCode();

    const gameData = await this.db.transaction(async (tx) => {
      const [game] = await tx
        .insert(games)
        .values({
          ...createGameDto,
          creatorId: user.id,
          gameCode,
          maxBet: createGameDto.maxBets,
          status: GameStatus.WAITING,
        })
        .returning();

      // Ensure createGameInstruction throws if it fails
      let txn: string;

      try {
        txn = await this.anchor.createGameInstruction(
          game.id.toString(),
          Number(game.depositAmount),
          Number(game.maxBet),
          Number(game.maxParticipants),
          new PublicKey(user.walletAddress),
          new PublicKey(game.depositToken as string),
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

      const [updatedGame] = await tx
        .update(games)
        .set({
          txnId: txn,
        })
        .where(eq(games.id, game.id))
        .returning();

      return updatedGame;
    });

    return gameData;
  }

  async findAll() {
    return this.db.query.games.findMany({
      with: { gameMode: true, creator: true, participants: {with: {user: true}} },
    });
  }

  async getJoinedGames(user: User) {
    return this.db.query.participants.findMany({
      where: eq(participants.userId, user.id),
      with: {
        game: true,
        predictions: true,
      },
    });
  }

  async findOne(id: string) {
    const game = await this.db.query.games.findFirst({
      where: eq(games.id, id),
      with: {
        gameMode: true,
        participants: true,
        creator: true,
      },
    });

    if (!game) throw new NotFoundException('Game not found');

    return game;
  }

  async joinGame(user: User, gameId: string, gameCode?: string) {
    return await this.db.transaction(async (tx) => {
      const game = await tx.query.games.findFirst({
        where: eq(games.id, gameId),
      });

      if (!game) throw new NotFoundException('Game not found');

      await this.validateGameAccess({
        game,
        userId: user.id,
        providedCode: gameCode,
      });

      const existing = await tx.query.participants.findFirst({
        where: and(
          eq(participants.gameId, gameId),
          eq(participants.userId, user.id),
        ),
      });

      if (existing) {
        throw new ConflictException('User already joined this game');
      }

      const [{ count: currentCount }] = await tx
        .select({ count: count() })
        .from(participants)
        .where(eq(participants.gameId, gameId));

      if (currentCount >= (game.maxParticipants as number)) {
        throw new BadRequestException('Game is already full');
      }

      if (game.status !== GameStatus.WAITING) {
        throw new BadRequestException('Game is not open for joining');
      }

      // Call Anchor join instruction (must succeed else rollback DB)
      const joinTxSig = await this.anchor.joinGameInstruction({
        gameId: game.id.toString(),
        depositAmount: game.depositAmount as number,
      });
      if (!joinTxSig) {
        throw new BadRequestException(
          'Failed to execute join game instruction on-chain',
        );
      }

      await tx.insert(participants).values({
        gameId,
        userId: user.id,
        txnId: joinTxSig,
      });

      // Transaction will auto-commit if no error is thrown
      return {
        success: true,
        message: 'Joined game successfully',
        txSig: joinTxSig,
      };
    });
  }

  async predictGames(dto: BulkCreatePredictionsDto) {
    const values = dto.predictions.map((p) => ({
      participantId: p.participantId,
      lineId: p.lineId,
      predictedDirection: p.predictedDirection,
    }));

    await this.db.insert(predictions).values(values);
    return { message: `${values.length} predictions added.` };
  }

  async findByGameCode(code: string) {
    const game = await this.db.query.games.findFirst({
      where: eq(games.gameCode, code),
      with: {
        gameMode: true,
        participants: true,
        creator: true,
      },
    });

    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async findGamesCreatedByUser(user: User) {
    const result = await this.db.query.games.findMany({
      where: eq(games.creatorId, user.id),
    });

    if (!result.length) throw new NotFoundException('Games not found');
    return result;
  }

  async update(id: string, updateGameDto: UpdateGameDto, user: User) {
    await this.ensureUserOwnsGame(id, user.id);

    const [updated] = await this.db
      .update(games)
      .set(updateGameDto)
      .where(eq(games.id, id))
      .returning();

    if (!updated) throw new NotFoundException('Game not found');
    return updated;
  }

  async remove(id: string, user: User) {
    await this.ensureUserOwnsGame(id, user.id);
    const [deleted] = await this.db
      .delete(games)
      .where(eq(games.id, id))
      .returning();

    if (!deleted) throw new NotFoundException('Game not found');
    return deleted;
  }

  async ensureUserOwnsGame(gameId: string, userId: string) {
    const game = await this.db.query.games.findFirst({
      where: (g, { eq }) => eq(g.id, gameId),
    });

    if (!game) throw new NotFoundException('Game not found');
    if (game.creatorId !== userId) {
      throw new ForbiddenException('You do not own this game');
    }

    return game;
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
