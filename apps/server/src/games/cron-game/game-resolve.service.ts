import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { and, eq, gte, isNotNull, lte, or } from 'drizzle-orm';
import { GamesService } from '../games.service';
import { games } from '@repo/db';
import { GameStatus } from '../enum/game';

@Injectable()
export class GameResolveService {
    private readonly logger = new Logger(GameResolveService.name);

    constructor(
        @Drizzle() private readonly db: Database,
        private readonly gamesService: GamesService,
    ) { }

    // 30 minutes interval
    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleCron() {
        this.logger.log('Running game resolve cron job...');
        const now = new Date();
        const gamesToBeInProgress = await this.db
            .update(games)
            .set({ status: GameStatus.IN_PROGRESS })
            .where(and(
                eq(games.status, GameStatus.WAITING),
                or(
                    and(isNotNull(games.lockedAt), lte(games.lockedAt, now)),
                    and(isNotNull(games.maxParticipants), isNotNull(games.currentParticipants), gte(games.currentParticipants, games.maxParticipants)),
                )),
            ).returning({ id: games.id, title: games.title });
        this.logger.log(
            `Changed ${gamesToBeInProgress.length} games to IN_PROGRESS.`,
        );
        const resolvedGames = await this.gamesService.resolveAllPossibleGames();
        for (const game of resolvedGames) {
            this.logger.log(`Resolved game: ${game}`);
        }
        this.logger.log('Game resolve cron job completed.');
    }
}