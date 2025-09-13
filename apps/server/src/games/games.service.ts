import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  bets,
  friends,
  game_access,
  games,
  lines,
  participants,
  users,
} from '@repo/db';
import { PublicKey } from '@solana/web3.js';
import { and, count, eq, inArray, ne, or, exists, desc } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { User } from 'src/user/dto/user-response.dto';
import { generateRandonCode } from 'src/utils/generateRandonCode';
import { ParaAnchor } from 'src/utils/services/paraAnchor';
import { CreateGameDto } from './dto/create-game.dto';
import { BulkCreateBetsDto } from './dto/bet.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameStatus, PredictionDirection } from './enum/game';
import { NotificationService } from 'src/notification/notification.service';
import { FriendsService } from 'src/friends/friends.service';

@Injectable()
export class GamesService {
  private anchor: ParaAnchor;

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly friendsService: FriendsService,
  ) {
    this.anchor = new ParaAnchor(this.authService.getPara());
  }
  async create(createGameDto: CreateGameDto, user: User) {
    const gameCode = await this.generateUniqueGameCode();
    const imageUrl = createGameDto.imageUrl ?? '/images/pfp-2.svg';

    const gameData = await this.db.transaction(async (tx) => {
      const [game] = await tx
        .insert(games)
        .values({
          ...createGameDto,
          creatorId: user.id,
          gameCode,
          numBets: createGameDto.numBets,
          imageUrl,
          status: GameStatus.WAITING,
        })
        .returning();

      // Ensure createGameInstruction throws if it fails
      let txn: string;

      try {
        txn = await this.anchor.createGameInstruction(
          game.id.toString(),
          Number(game.depositAmount),
          Number(game.numBets),
          Number(game.maxParticipants),
          new PublicKey(user.walletAddress),
          // new PublicKey(game.depositToken as string),
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
          createdTxnSignature: txn,
        })
        .where(eq(games.id, game.id))
        .returning();

      return updatedGame;
    });

    return gameData;
  }

  async findAll() {
    return this.db.query.games.findMany({
      with: {
        gameMode: true,
        creator: true,
        token: true,
        participants: { with: { user: true, bets: true } },
      },
    });
  }
  async findAllOpen() {
    return this.db.query.games.findMany({
      where: eq(games.status, GameStatus.WAITING),
      with: {
        gameMode: true,
        token: true,
        participants: { with: { user: true, bets: true } },
        creator: true,
      },
    });
  }

  async getJoinedGames(user: User) {
    return this.db.query.participants.findMany({
      where: eq(participants.userId, user.id),
      with: {
        game: true,
        bets: true,
      },
    });
  }

  async getMyOpenGames(user: User) {
    return this.db.query.games.findMany({
      where: and(
        or(
          eq(games.creatorId, user.id),
          exists(
            this.db
              .select()
              .from(participants)
              .where(
                and(
                  eq(participants.gameId, games.id),
                  eq(participants.userId, user.id),
                ),
              ),
          ),
        ),
        ne(games.status, GameStatus.COMPLETED),
      ),
      with: {
        token: true,
        participants: {
          with: {
            user: true,
            bets: {
              with: {
                line: {
                  with: {
                    matchup: true,
                    athlete: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getMyCompletedGames(user: User) {
    return this.db.query.games.findMany({
      where: and(
        or(
          eq(games.creatorId, user.id),
          exists(
            this.db
              .select()
              .from(participants)
              .where(
                and(
                  eq(participants.gameId, games.id),
                  eq(participants.userId, user.id),
                ),
              ),
          ),
        ),
        eq(games.status, GameStatus.COMPLETED),
      ),
      with: {
        token: true,
        participants: {
          with: {
            user: true,
            bets: {
              with: {
                line: {
                  with: {
                    matchup: true,
                    athlete: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const game = await this.db.query.games.findFirst({
      where: eq(games.id, id),
      with: {
        gameMode: true,
        token: true,
        participants: {
          with: {
            user: true,
            bets: {
              with: {
                line: {
                  with: {
                    athlete: {
                      with: {
                        team: true,
                      },
                    },
                    matchup: {
                      with: {
                        homeTeam: true,
                        awayTeam: true,
                      },
                    },
                    stat: true,
                  },
                },
              },
            },
          },
        },
        creator: true,
      },
    });

    if (!game) throw new NotFoundException('Game not found');

    return game;
  }

  async submitBets(user: User, gameCode:string, dto: BulkCreateBetsDto) {
    return await this.db.transaction(async (tx) => {
      const game = await tx.query.games.findFirst({
        where: eq(games.id, dto.gameId),
      });

      if (!game) throw new NotFoundException('Game not found');

      if (game.numBets !== dto.bets.length) {
        throw new BadRequestException(
          `Invalid number of bets: expected ${game.numBets}, but received ${dto.bets.length}`,
        );
      }

      await this.validateGameAccess({
        game,
        userId: user.id,
        providedCode: gameCode,
      });

      const existing = await tx.query.participants.findFirst({
        where: and(
          eq(participants.gameId, dto.gameId),
          eq(participants.userId, user.id),
        ),
      });

      if (existing) {
        throw new ConflictException('User already joined this game');
      }

      const [{ count: currentCount }] = await tx
        .select({ count: count() })
        .from(participants)
        .where(eq(participants.gameId, dto.gameId));

      if (currentCount >= (game.maxParticipants as number)) {
        throw new BadRequestException('Game is already full');
      }

      if (game.status !== GameStatus.WAITING) {
        throw new BadRequestException('Game is not open for joining');
      }

      const [insertedParticipant] = await tx
        .insert(participants)
        .values({
          gameId: dto.gameId,
          userId: user.id,
        })
        .returning();

      const betsValues = dto.bets.map((p) => ({
        participantId: insertedParticipant.id,
        userId: user.id,
        lineId: p.lineId,
        predictedDirection: p.predictedDirection,
        gameId: dto.gameId,
      }));

      const insertedBets = await tx.insert(bets).values(betsValues).returning();

      const picks = insertedBets.flatMap(async (res) => {
        const line = await tx.query.lines.findFirst({
          where: eq(lines.id, res.lineId ?? ''),
        });

        return {
          lineId: new Date(line?.createdAt ?? '').getTime(),
          direction: res.predictedDirection as PredictionDirection,
        };
      });

      const submitTxnSig = await this.anchor.submitBetsInstruction(
        dto.gameId,
        await Promise.all(picks),
      );

      if (!submitTxnSig) {
        throw new BadRequestException(
          'Failed to execute submit bets instruction on-chain',
        );
      }

      await tx
        .update(participants)
        .set({
          submitTxnSignature: submitTxnSig,
        })
        .where(eq(participants.id, insertedParticipant.id ?? ''))
        .returning();

      // Transaction will auto-commit if no error is thrown
      return {
        success: true,
        message: 'Joined game successfully',
        txnSignature: submitTxnSig,
        bets: insertedBets,
      };
    });
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

  async resolveGame(id: string) {
    return await this.db.transaction(async (tx) => {
      const game = await tx.query.games.findFirst({
        where: eq(games.id, id),
        with: {
          gameMode: true,
          participants: {
            with: {
              user: true,
              bets: {
                with: {
                  line: true,
                },
              },
            },
          },
          creator: true,
        },
      });

      if (!game) throw new NotFoundException('Game not found');

      // Update all predictions for this game in one batch
      const predictionUpdates: Array<{ id: string; isCorrect: boolean }> = [];

      // Now calculate winners with updated data
      let winners: string[] = [];
      let winnersIds: string[] = [];
      let betsToWin = 0;
      const allLinesIds = new Set<number>();
      for (const participant of game.participants) {
        let correctPredictions = 0;

        for (const prediction of participant.bets) {
          const line = prediction.line;
          if (!line?.createdAt) {
            throw new BadRequestException('Line or createdAt not found');
          }
          allLinesIds.add(line.createdAt.getTime());

          if (
            !line ||
            line.actualValue === null ||
            line.predictedValue === null
          ) {
            throw new BadRequestException(
              `Line not found or not resolved for prediction ${prediction.id}`,
            );
          }

          // Determine if prediction is correct based on direction and actual vs predicted
          const isCorrect = this.determinePredictionCorrectness(
            prediction.predictedDirection || 'over',
            Number(line.actualValue),
            Number(line.predictedValue),
          );

          predictionUpdates.push({
            id: prediction.id || '',
            isCorrect,
          });

          if (isCorrect) {
            correctPredictions++;
          }
        }

        if (correctPredictions === betsToWin) {
          winners.push(participant.user?.walletAddress!);
          winnersIds.push(participant.userId!);
        } else if (correctPredictions > betsToWin) {
          betsToWin = correctPredictions;
          winners = [participant.user?.walletAddress!];
          winnersIds = [participant.userId!];
        }
      }

      const allWallets = game.participants.map((p) => p.user?.walletAddress!);

      // Update all predictions in batches
      if (predictionUpdates.length > 0) {
        // Use Promise.all to update all predictions concurrently
        await Promise.all(
          predictionUpdates.map((update) =>
            tx
              .update(bets)
              .set({ isCorrect: update.isCorrect })
              .where(eq(bets.id, update.id)),
          ),
        );
      }

      for (const winner of winnersIds) {
        await tx
          .update(participants)
          .set({ isWinner: true })
          .where(
            and(eq(participants.userId, winner), eq(participants.gameId, id)),
          );
      }

      try {
        const resolveTxnSig = await this.anchor.resolveGameInstruction(
          id,
          winners,
          allWallets,
          Array.from(allLinesIds),
        );

        if (!resolveTxnSig) {
          tx.rollback();
          throw new BadRequestException(
            'Failed to execute resolve game instruction on-chain',
          );
        }

        await tx
          .update(games)
          .set({
            status: GameStatus.COMPLETED,
            resolvedTxnSignature: resolveTxnSig,
          })
          .where(eq(games.id, id));
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

      // Send notifications AFTER the DB + on-chain update
      for (const participant of game.participants) {
        const message = this.notificationService.buildGameResolvedMessage(
          game.id,
          game.title ?? '',
        );
        try {
          await this.notificationService.sendNotificationToUser(
            participant.userId ?? '',
            message,
          );
        } catch (err) {
          console.warn(
            `Failed to send notification to user ${participant.userId}:`,
            err.message || err,
          );
        }
      }

      return {
        game,
        winners,
        betsToWin,
        updatedPredictions: predictionUpdates.length,
      };
    });
  }

  private determinePredictionCorrectness(
    predictedDirection: string,
    actualValue: number,
    predictedValue: number,
  ): boolean {
    if (predictedDirection === 'over') {
      return actualValue > predictedValue;
    } else if (predictedDirection === 'under') {
      return actualValue < predictedValue;
    }
    return false;
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
      where: eq(games.id, gameId),
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
    const {
      isPrivate,
      userControlType,
      gameCode,
      id: gameId,
      creatorId,
    } = game;

    if (isPrivate) {
      if (!providedCode || providedCode !== gameCode) {
        throw new ForbiddenException(
          'Private game. Invalid or missing game code.',
        );
      }

      if (!(await this.friendsService.isCreatorFollowing(userId, creatorId as string))) {
        throw new ForbiddenException(
          'This is a private game. Follow the creator to gain access.',
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


  async inviteUserToPlay(userId: string, gameId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      with: { pushSubscriptions: true },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const game = await this.db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

    if (!game) {
      throw new NotFoundException('game not found');
    }

    console.log(game, user, 'invite');

    try {
      const message = this.notificationService.buildGameInviteMessage(
        game?.title as string,
        game.id,
      );

      await this.notificationService.sendNotificationToUser(user.id, message);
    } catch (error) {
      console.log(error, 'unable to send invite');
    }
  }


   async getPrivateGamesFromFollowing(currentUserId: string) {
    // 1. Get all the users I am following
    const following = await this.db.query.friends.findMany({
      where: eq(friends.followerId, currentUserId),
    });
    
    const followingIds = following.map(f => f.followingId);

    if (followingIds.length === 0) {
      return [];
    }

    // 2. Fetch all private games created by those users
    return this.db.query.games.findMany({
      where: and(
        eq(games.isPrivate, true),
        inArray(games.creatorId, followingIds),
      ),
      orderBy: [desc(games.createdAt)],
    });
  }
}
