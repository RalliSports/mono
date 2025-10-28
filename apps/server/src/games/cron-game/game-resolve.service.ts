import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { and, eq, gte, or } from 'drizzle-orm';
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
        const gamesToBeInProgress = await this.db.query.games.findMany({
            where: or(
                gte(games.lockedAt, new Date(Date.now())),
                gte(games.currentParticipants, games.maxParticipants),
            ),
        });
        if (gamesToBeInProgress.length > 0) {
            for (const game of gamesToBeInProgress) {
                await this.db
                    .update(games)
                    .set({ status: GameStatus.IN_PROGRESS })
                    .where(eq(games.id, game.id));
            }
        }
        const resolvedGames = await this.gamesService.resolveAllPossibleGames();
        for (const game of resolvedGames) {
            this.logger.log(`Resolved game: ${game}`);
        }
        this.logger.log('Game resolve cron job completed.');
    }
}